import { describe, expect, it } from "vitest"

import {
  checkoutRequestHash,
  isValidIdempotencyKey,
} from "@/lib/checkout/idempotency"

const checkout = {
  addressLine1: "1 Example Road",
  city: "Lagos",
  state: "Lagos",
  phone: "+2348000000000",
  items: [
    { productId: "product-b", quantity: 1 },
    { productId: "product-a", quantity: 2 },
  ],
  couponCode: " fade10 ",
  deliveryMethod: "standard" as const,
  isGift: false,
  giftMessage: null,
  giftWrapping: false,
  paymentMethod: "CARD" as const,
}

describe("checkout idempotency", () => {
  it("accepts opaque browser-generated keys and rejects weak keys", () => {
    expect(isValidIdempotencyKey("d6a7ca3f-184c-4c40-b73e-a5e2a6df3501")).toBe(true)
    expect(isValidIdempotencyKey("short")).toBe(false)
    expect(isValidIdempotencyKey(null)).toBe(false)
  })

  it("produces the same hash regardless of item order and coupon casing", () => {
    const reordered = {
      ...checkout,
      couponCode: "FADE10",
      items: [...checkout.items].reverse(),
    }
    expect(checkoutRequestHash(reordered)).toBe(checkoutRequestHash(checkout))
  })

  it("changes when an order-affecting field changes", () => {
    expect(
      checkoutRequestHash({ ...checkout, deliveryMethod: "express" }),
    ).not.toBe(checkoutRequestHash(checkout))
  })
})
