import { afterEach, describe, expect, it } from "vitest"

import { hasTrustedOrigin } from "@/lib/security/origin"

const previousNodeEnv = process.env.NODE_ENV
const mutableEnv = process.env as Record<string, string | undefined>

afterEach(() => {
  if (previousNodeEnv === undefined) delete mutableEnv.NODE_ENV
  else mutableEnv.NODE_ENV = previousNodeEnv
})

describe("state-changing request origin", () => {
  it("accepts the request host", () => {
    const request = new Request("http://localhost:3000/api/checkout", {
      headers: { origin: "http://localhost:3000" },
    })
    expect(hasTrustedOrigin(request)).toBe(true)
  })

  it("rejects a cross-site origin", () => {
    const request = new Request("http://localhost:3000/api/checkout", {
      headers: { origin: "https://attacker.example" },
    })
    expect(hasTrustedOrigin(request)).toBe(false)
  })

  it("fails closed without Origin in production", () => {
    mutableEnv.NODE_ENV = "production"
    expect(
      hasTrustedOrigin(new Request("https://shop.example/api/checkout")),
    ).toBe(false)
  })
})
