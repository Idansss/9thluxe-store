import { describe, expect, it } from "vitest"

import {
  aggregateInventoryLines,
  BANK_TRANSFER_RESERVATION_HOURS,
  CARD_RESERVATION_MINUTES,
  reservationExpiry,
} from "@/lib/inventory/reservations"

describe("inventory reservation policy", () => {
  it("aggregates duplicate product lines before checking or reserving stock", () => {
    expect(aggregateInventoryLines([
      { productId: "b", quantity: 1 },
      { productId: "a", quantity: 2 },
      { productId: "a", quantity: 3 },
    ])).toEqual([
      { productId: "a", quantity: 5 },
      { productId: "b", quantity: 1 },
    ])
  })

  it("uses a short card reservation window", () => {
    const now = new Date("2026-07-23T12:00:00.000Z")
    expect(reservationExpiry("CARD", now).getTime() - now.getTime()).toBe(
      CARD_RESERVATION_MINUTES * 60 * 1000,
    )
  })

  it("allows a longer manual bank-transfer reservation window", () => {
    const now = new Date("2026-07-23T12:00:00.000Z")
    expect(reservationExpiry("BANK_TRANSFER", now).getTime() - now.getTime()).toBe(
      BANK_TRANSFER_RESERVATION_HOURS * 60 * 60 * 1000,
    )
  })
})
