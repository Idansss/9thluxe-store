const STRICT_CRITICAL_ENV_KEYS = ["DATABASE_URL", "NEXTAUTH_URL"] as const

const OPTIONAL_ENV_KEYS = [
  "NEXTAUTH_SECRET",
  "APP_URL",
  "NEXT_PUBLIC_SITE_URL",
  "PAYSTACK_PUBLIC_KEY",
  "PAYSTACK_SECRET_KEY",
  "RESEND_API_KEY",
] as const

function hasValue(value: string | undefined): boolean {
  return typeof value === "string" && value.trim().length > 0
}

export function getEnvDiagnostics() {
  const missingCritical: string[] = STRICT_CRITICAL_ENV_KEYS.filter(
    (key) => !hasValue(process.env[key])
  )

  const hasAuthSecret = hasValue(process.env.AUTH_SECRET) || hasValue(process.env.NEXTAUTH_SECRET)
  if (!hasAuthSecret) {
    missingCritical.push("AUTH_SECRET_OR_NEXTAUTH_SECRET")
  }
  const missingOptional = OPTIONAL_ENV_KEYS.filter((key) => !hasValue(process.env[key]))

  return {
    environment: process.env.NODE_ENV || "development",
    missingCritical,
    missingOptional,
  }
}
