import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getEnvDiagnostics } from "@/lib/env-diagnostics"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const env = getEnvDiagnostics()

  let database: "up" | "down" = "up"
  let databaseError: string | null = null

  try {
    await prisma.$queryRaw`SELECT 1`
  } catch (error) {
    database = "down"
    databaseError = error instanceof Error ? error.message : "Unknown database error"
  }

  const ok = database === "up" && env.missingCritical.length === 0
  const status = ok ? 200 : 503

  return NextResponse.json(
    {
      ok,
      timestamp: new Date().toISOString(),
      checks: {
        database,
        env: env.missingCritical.length === 0 ? "up" : "down",
      },
      env,
      ...(databaseError ? { databaseError } : {}),
    },
    { status }
  )
}
