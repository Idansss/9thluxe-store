import { env } from "@/lib/env"

/**
 * Protect cookie-authenticated JSON mutations from cross-site requests.
 * Production fails closed when Origin is absent; development permits tooling
 * that does not emulate a browser Origin header.
 */
export function hasTrustedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin")
  if (!origin) return process.env.NODE_ENV !== "production"

  try {
    const configured = new URL(env.APP_URL).origin
    const requestOrigin = new URL(request.url).origin
    return origin === configured || origin === requestOrigin
  } catch {
    return false
  }
}
