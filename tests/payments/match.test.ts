import { describe, expect, it } from "vitest"

import { matchesExpectedPayment } from "@/lib/payments/match"

const valid = {
  expectedReference: "fade_order_123",
  receivedReference: "fade_order_123",
  expectedAmountNGN: 125_000,
  receivedAmountNGN: 125_000,
  expectedCurrency: "NGN",
  receivedCurrency: "ngn",
  providerStatus: "success",
  paymentMethod: "CARD",
}

describe("payment matching invariant", () => {
  it("accepts only a successful payment matching the stored order", () => {
    expect(matchesExpectedPayment(valid)).toBe(true)
  })

  it.each([
    ["reference", { receivedReference: "another_order" }],
    ["amount", { receivedAmountNGN: 100 }],
    ["currency", { receivedCurrency: "USD" }],
    ["status", { providerStatus: "pending" }],
    ["method", { paymentMethod: "BANK_TRANSFER" }],
  ])("rejects a mismatched %s", (_field, override) => {
    expect(matchesExpectedPayment({ ...valid, ...override })).toBe(false)
  })
})
