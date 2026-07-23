import { describe, expect, it } from "vitest"

import { hasValidBearerSecret } from "@/lib/security/bearer"

describe("internal job bearer authentication", () => {
  const secret = "a".repeat(32)

  it("accepts the exact bearer secret", () => {
    expect(hasValidBearerSecret(`Bearer ${secret}`, secret)).toBe(true)
  })

  it("rejects missing, malformed, or different credentials", () => {
    expect(hasValidBearerSecret(null, secret)).toBe(false)
    expect(hasValidBearerSecret(secret, secret)).toBe(false)
    expect(hasValidBearerSecret(`Bearer ${"b".repeat(32)}`, secret)).toBe(false)
    expect(hasValidBearerSecret(`Bearer ${secret}`, undefined)).toBe(false)
  })
})
