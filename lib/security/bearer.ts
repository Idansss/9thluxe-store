import crypto from "crypto"

export function hasValidBearerSecret(
  authorization: string | null,
  expectedSecret: string | undefined,
): boolean {
  if (!authorization?.startsWith("Bearer ") || !expectedSecret) return false
  const received = authorization.slice("Bearer ".length)
  const expected = Buffer.from(expectedSecret)
  const actual = Buffer.from(received)
  return expected.length === actual.length && crypto.timingSafeEqual(expected, actual)
}
