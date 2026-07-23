import type { Prisma } from "@prisma/client"

import { AppError } from "@/lib/http/errors"
import { prisma } from "@/lib/prisma"

export const CARD_RESERVATION_MINUTES = 30
export const BANK_TRANSFER_RESERVATION_HOURS = 24

export interface InventoryLine {
  productId: string
  quantity: number
}

export function aggregateInventoryLines(items: InventoryLine[]): InventoryLine[] {
  const quantities = new Map<string, number>()
  for (const item of items) {
    quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity)
  }
  return [...quantities.entries()]
    .map(([productId, quantity]) => ({ productId, quantity }))
    .sort((a, b) => a.productId.localeCompare(b.productId))
}

export function reservationExpiry(
  paymentMethod: "CARD" | "BANK_TRANSFER",
  now = new Date(),
): Date {
  const durationMs =
    paymentMethod === "BANK_TRANSFER"
      ? BANK_TRANSFER_RESERVATION_HOURS * 60 * 60 * 1000
      : CARD_RESERVATION_MINUTES * 60 * 1000
  return new Date(now.getTime() + durationMs)
}

export async function reserveInventory(
  tx: Prisma.TransactionClient,
  orderId: string,
  rawItems: InventoryLine[],
  expiresAt: Date,
) {
  const items = aggregateInventoryLines(rawItems)
  for (const item of items) {
    const claimed = await tx.product.updateMany({
      where: {
        id: item.productId,
        stock: { gte: item.quantity },
        deletedAt: null,
        publishStatus: "PUBLISHED",
      },
      data: { stock: { decrement: item.quantity } },
    })
    if (claimed.count !== 1) {
      throw new AppError("INSUFFICIENT_STOCK", {
        internal: { orderId, productId: item.productId, quantity: item.quantity },
      })
    }

    await tx.inventoryReservation.create({
      data: {
        orderId,
        productId: item.productId,
        quantity: item.quantity,
        expiresAt,
      },
    })
    await tx.inventoryMovement.create({
      data: {
        productId: item.productId,
        delta: -item.quantity,
        reason: "RESERVATION_CREATED",
        sourceType: "ORDER",
        sourceId: orderId,
      },
    })
  }
}

export async function finalizeInventoryForOrder(
  tx: Prisma.TransactionClient,
  orderId: string,
  rawItems: InventoryLine[],
) {
  const items = aggregateInventoryLines(rawItems)
  const reservations = await tx.inventoryReservation.findMany({
    where: { orderId },
  })

  // Backward compatibility for pending orders created before reservations were introduced.
  if (reservations.length === 0) {
    for (const item of items) {
      const sold = await tx.product.updateMany({
        where: { id: item.productId, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      })
      if (sold.count !== 1) {
        throw new AppError("INSUFFICIENT_STOCK", {
          internal: { orderId, productId: item.productId, quantity: item.quantity },
        })
      }
      await tx.inventoryMovement.create({
        data: {
          productId: item.productId,
          delta: -item.quantity,
          reason: "LEGACY_SALE",
          sourceType: "ORDER",
          sourceId: orderId,
        },
      })
    }
    return
  }

  const byProduct = new Map(reservations.map((reservation) => [
    reservation.productId,
    reservation,
  ]))
  for (const item of items) {
    const reservation = byProduct.get(item.productId)
    if (!reservation || reservation.quantity !== item.quantity) {
      throw new AppError("INTERNAL_ERROR", {
        internal: {
          reason: "inventory_reservation_mismatch",
          orderId,
          productId: item.productId,
        },
      })
    }

    if (reservation.status === "SOLD") continue
    if (reservation.status === "RESERVED") {
      const finalized = await tx.inventoryReservation.updateMany({
        where: { id: reservation.id, status: "RESERVED" },
        data: { status: "SOLD", finalizedAt: new Date() },
      })
      if (finalized.count === 1) continue
    }

    const reacquired = await tx.product.updateMany({
      where: { id: item.productId, stock: { gte: item.quantity } },
      data: { stock: { decrement: item.quantity } },
    })
    if (reacquired.count !== 1) {
      throw new AppError("INSUFFICIENT_STOCK", {
        internal: {
          reason: "paid_after_reservation_expired",
          orderId,
          productId: item.productId,
          quantity: item.quantity,
        },
      })
    }
    const finalized = await tx.inventoryReservation.updateMany({
      where: {
        id: reservation.id,
        status: { in: ["EXPIRED", "RELEASED"] },
      },
      data: { status: "SOLD", finalizedAt: new Date() },
    })
    if (finalized.count !== 1) {
      throw new AppError("INTERNAL_ERROR", {
        internal: {
          reason: "inventory_reservation_transition_race",
          orderId,
          reservationId: reservation.id,
        },
      })
    }
    await tx.inventoryMovement.create({
      data: {
        productId: item.productId,
        delta: -item.quantity,
        reason: "SALE_AFTER_EXPIRY",
        sourceType: "ORDER",
        sourceId: orderId,
      },
    })
  }
}

export async function releaseExpiredReservations(
  options: { now?: Date; limit?: number } = {},
) {
  const now = options.now ?? new Date()
  const limit = Math.min(Math.max(options.limit ?? 100, 1), 500)
  const candidates = await prisma.inventoryReservation.findMany({
    where: { status: "RESERVED", expiresAt: { lte: now } },
    orderBy: { expiresAt: "asc" },
    take: limit,
    select: { id: true, orderId: true, productId: true, quantity: true },
  })

  let released = 0
  for (const candidate of candidates) {
    const didRelease = await prisma.$transaction(async (tx) => {
      const transitioned = await tx.inventoryReservation.updateMany({
        where: { id: candidate.id, status: "RESERVED", expiresAt: { lte: now } },
        data: { status: "EXPIRED", releasedAt: now },
      })
      if (transitioned.count !== 1) return false

      await tx.product.update({
        where: { id: candidate.productId },
        data: { stock: { increment: candidate.quantity } },
      })
      await tx.inventoryMovement.create({
        data: {
          productId: candidate.productId,
          delta: candidate.quantity,
          reason: "RESERVATION_EXPIRED",
          sourceType: "ORDER",
          sourceId: candidate.orderId,
        },
      })
      return true
    })
    if (didRelease) released += 1
  }

  return { examined: candidates.length, released }
}
