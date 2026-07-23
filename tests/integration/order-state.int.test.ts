import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { reserveInventory } from "@/lib/inventory/reservations"
import { updateOrderStatus } from "@/lib/services/order-service"
import { prisma } from "@/lib/prisma"

const hasDb = Boolean(process.env.DATABASE_URL)
const tag = `order_state_itest_${Date.now()}_${Math.random()
  .toString(36)
  .slice(2, 8)}`

describe.skipIf(!hasDb)("order state transitions (DB)", () => {
  let adminId = ""
  let customerId = ""
  let productId = ""
  let orderId = ""
  let attemptId = ""

  beforeAll(async () => {
    const [admin, customer] = await Promise.all([
      prisma.user.create({
        data: {
          email: `${tag}_admin@example.test`,
          passwordHash: "x",
          role: "ADMIN",
        },
        select: { id: true },
      }),
      prisma.user.create({
        data: {
          email: `${tag}_customer@example.test`,
          passwordHash: "x",
        },
        select: { id: true },
      }),
    ])
    adminId = admin.id
    customerId = customer.id

    const product = await prisma.product.create({
      data: {
        name: `${tag} Product`,
        slug: `${tag}-product`,
        description: "test",
        images: ["/placeholder.png"],
        priceNGN: 50_000,
        category: "PERFUMES",
        publishStatus: "PUBLISHED",
        stock: 2,
      },
      select: { id: true },
    })
    productId = product.id

    const order = await prisma.order.create({
      data: {
        userId: customerId,
        status: "PENDING",
        paymentMethod: "CARD",
        subtotalNGN: 50_000,
        totalNGN: 50_000,
        addressLine1: "1 Test St",
        city: "Lagos",
        state: "Lagos",
        phone: "08000000000",
        items: {
          create: [{ productId, quantity: 1, priceNGN: 50_000 }],
        },
      },
      select: { id: true },
    })
    orderId = order.id

    await prisma.$transaction((tx) =>
      reserveInventory(
        tx,
        orderId,
        [{ productId, quantity: 1 }],
        new Date(Date.now() + 30 * 60 * 1000),
      ),
    )

    const attempt = await prisma.paymentAttempt.create({
      data: {
        orderId,
        providerReference: `cancel_${tag}`,
        idempotencyKey: `cancel-${tag}`,
        expectedAmountNGN: 50_000,
        expectedCurrency: "NGN",
        status: "PENDING",
      },
      select: { id: true },
    })
    attemptId = attempt.id
  })

  afterAll(async () => {
    await prisma.auditLog.deleteMany({ where: { targetId: orderId } }).catch(() => {})
    await prisma.notification.deleteMany({ where: { orderId } }).catch(() => {})
    await prisma.paymentAttempt.deleteMany({ where: { id: attemptId } }).catch(() => {})
    await prisma.inventoryMovement.deleteMany({ where: { sourceId: orderId } }).catch(() => {})
    await prisma.inventoryReservation.deleteMany({ where: { orderId } }).catch(() => {})
    await prisma.orderItem.deleteMany({ where: { orderId } }).catch(() => {})
    await prisma.order.deleteMany({ where: { id: orderId } }).catch(() => {})
    await prisma.product.deleteMany({ where: { id: productId } }).catch(() => {})
    await prisma.user.deleteMany({
      where: { id: { in: [adminId, customerId] } },
    }).catch(() => {})
  })

  it("cancels a pending order and releases stock exactly once", async () => {
    await updateOrderStatus({
      orderId,
      status: "CANCELLED",
      actorId: adminId,
      reason: "Customer requested cancellation",
    })

    const [order, reservation, product, attempt, movement, audit] =
      await Promise.all([
        prisma.order.findUniqueOrThrow({ where: { id: orderId } }),
        prisma.inventoryReservation.findUniqueOrThrow({
          where: { orderId_productId: { orderId, productId } },
        }),
        prisma.product.findUniqueOrThrow({ where: { id: productId } }),
        prisma.paymentAttempt.findUniqueOrThrow({ where: { id: attemptId } }),
        prisma.inventoryMovement.findFirst({
          where: {
            sourceId: orderId,
            reason: "RESERVATION_CANCELLED",
          },
        }),
        prisma.auditLog.findFirst({
          where: {
            targetId: orderId,
            action: "order.status.transition",
          },
        }),
      ])

    expect(order.status).toBe("CANCELLED")
    expect(reservation.status).toBe("RELEASED")
    expect(product.stock).toBe(2)
    expect(attempt.status).toBe("ABANDONED")
    expect(movement?.delta).toBe(1)
    expect(audit?.actorId).toBe(adminId)

    await expect(
      updateOrderStatus({
        orderId,
        status: "CANCELLED",
        actorId: adminId,
        reason: "Duplicate submission",
      }),
    ).rejects.toMatchObject({ code: "VALIDATION_ERROR" })
    expect(
      (await prisma.product.findUniqueOrThrow({ where: { id: productId } }))
        .stock,
    ).toBe(2)
  })
})
