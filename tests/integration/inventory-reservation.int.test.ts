import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest"

import {
  finalizeInventoryForOrder,
  releaseExpiredReservations,
  reserveInventory,
} from "@/lib/inventory/reservations"
import { prisma } from "@/lib/prisma"

const hasDb = Boolean(process.env.DATABASE_URL)
const tag = `inventory_itest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

describe.skipIf(!hasDb)("inventory reservation lifecycle (DB)", () => {
  let userId = ""
  let productId = ""
  const orderIds: string[] = []

  beforeAll(async () => {
    const user = await prisma.user.create({
      data: {
        email: `${tag}@example.test`,
        passwordHash: "x",
        name: "Inventory Integration Test",
      },
      select: { id: true },
    })
    userId = user.id
    const product = await prisma.product.create({
      data: {
        name: `${tag} Perfume`,
        slug: `${tag}-perfume`,
        description: "test",
        images: ["/placeholder.png"],
        priceNGN: 50_000,
        category: "PERFUMES",
        publishStatus: "PUBLISHED",
        stock: 5,
      },
      select: { id: true },
    })
    productId = product.id
  })

  beforeEach(async () => {
    await prisma.inventoryMovement.deleteMany({ where: { productId } })
    await prisma.inventoryReservation.deleteMany({ where: { productId } })
    await prisma.product.update({ where: { id: productId }, data: { stock: 5 } })
  })

  afterAll(async () => {
    await prisma.inventoryMovement.deleteMany({ where: { productId } }).catch(() => {})
    await prisma.inventoryReservation.deleteMany({ where: { productId } }).catch(() => {})
    await prisma.orderItem.deleteMany({ where: { orderId: { in: orderIds } } }).catch(() => {})
    await prisma.order.deleteMany({ where: { id: { in: orderIds } } }).catch(() => {})
    await prisma.product.deleteMany({ where: { id: productId } }).catch(() => {})
    await prisma.user.deleteMany({ where: { id: userId } }).catch(() => {})
  })

  async function createOrder(quantity: number) {
    const order = await prisma.order.create({
      data: {
        userId,
        totalNGN: quantity * 50_000,
        subtotalNGN: quantity * 50_000,
        addressLine1: "1 Test St",
        city: "Lagos",
        state: "Lagos",
        phone: "08000000000",
        items: { create: [{ productId, quantity, priceNGN: 50_000 }] },
      },
      select: { id: true },
    })
    orderIds.push(order.id)
    return order.id
  }

  it("returns expired reserved stock exactly once", async () => {
    const orderId = await createOrder(2)
    const expiredAt = new Date(Date.now() - 60_000)
    await prisma.$transaction((tx) =>
      reserveInventory(tx, orderId, [{ productId, quantity: 2 }], expiredAt),
    )

    expect((await prisma.product.findUniqueOrThrow({
      where: { id: productId },
      select: { stock: true },
    })).stock).toBe(3)

    expect((await releaseExpiredReservations({ now: new Date(), limit: 100 })).released).toBe(1)
    expect((await releaseExpiredReservations({ now: new Date(), limit: 100 })).released).toBe(0)

    const reservation = await prisma.inventoryReservation.findUniqueOrThrow({
      where: { orderId_productId: { orderId, productId } },
      select: { status: true },
    })
    const product = await prisma.product.findUniqueOrThrow({
      where: { id: productId },
      select: { stock: true },
    })
    expect(reservation.status).toBe("EXPIRED")
    expect(product.stock).toBe(5)
  })

  it("finalizes a live reservation without decrementing stock twice", async () => {
    const orderId = await createOrder(3)
    await prisma.$transaction((tx) =>
      reserveInventory(
        tx,
        orderId,
        [{ productId, quantity: 3 }],
        new Date(Date.now() + 30 * 60_000),
      ),
    )
    await prisma.$transaction((tx) =>
      finalizeInventoryForOrder(tx, orderId, [{ productId, quantity: 3 }]),
    )

    const reservation = await prisma.inventoryReservation.findUniqueOrThrow({
      where: { orderId_productId: { orderId, productId } },
      select: { status: true },
    })
    const product = await prisma.product.findUniqueOrThrow({
      where: { id: productId },
      select: { stock: true },
    })
    expect(reservation.status).toBe("SOLD")
    expect(product.stock).toBe(2)
  })

  it("allows only one concurrent checkout to claim the final stock", async () => {
    await prisma.product.update({ where: { id: productId }, data: { stock: 2 } })
    const firstOrderId = await createOrder(2)
    const secondOrderId = await createOrder(2)
    const expiresAt = new Date(Date.now() + 30 * 60_000)

    const outcomes = await Promise.allSettled([
      prisma.$transaction((tx) =>
        reserveInventory(tx, firstOrderId, [{ productId, quantity: 2 }], expiresAt),
      ),
      prisma.$transaction((tx) =>
        reserveInventory(tx, secondOrderId, [{ productId, quantity: 2 }], expiresAt),
      ),
    ])

    expect(outcomes.filter((outcome) => outcome.status === "fulfilled")).toHaveLength(1)
    expect(outcomes.filter((outcome) => outcome.status === "rejected")).toHaveLength(1)
    expect((await prisma.product.findUniqueOrThrow({
      where: { id: productId },
      select: { stock: true },
    })).stock).toBe(0)
    expect(await prisma.inventoryReservation.count({
      where: { orderId: { in: [firstOrderId, secondOrderId] } },
    })).toBe(1)
  })
})
