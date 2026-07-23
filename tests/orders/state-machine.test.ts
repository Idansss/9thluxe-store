import { describe, expect, it } from "vitest"

import {
  allowedAdminOrderTransitions,
  canAdminTransitionOrder,
} from "@/lib/orders/state-machine"

describe("admin order state machine", () => {
  it("allows only forward fulfilment transitions", () => {
    expect(allowedAdminOrderTransitions("PAID")).toEqual(["SHIPPED"])
    expect(allowedAdminOrderTransitions("SHIPPED")).toEqual(["DELIVERED"])
  })

  it("allows pending orders to be cancelled but not manually paid", () => {
    expect(canAdminTransitionOrder("PENDING", "CANCELLED")).toBe(true)
    expect(canAdminTransitionOrder("PENDING", "PAID")).toBe(false)
  })

  it("makes terminal and refund-managed states immutable to generic admin updates", () => {
    for (const status of [
      "DELIVERED",
      "CANCELLED",
      "REFUND_PENDING",
      "REFUNDED",
    ] as const) {
      expect(allowedAdminOrderTransitions(status)).toEqual([])
    }
  })

  it("rejects backward and skipped transitions", () => {
    expect(canAdminTransitionOrder("DELIVERED", "PAID")).toBe(false)
    expect(canAdminTransitionOrder("PAID", "DELIVERED")).toBe(false)
    expect(canAdminTransitionOrder("SHIPPED", "PAID")).toBe(false)
  })
})
