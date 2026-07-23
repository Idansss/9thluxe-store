import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getEnvDiagnostics } from "@/lib/env-diagnostics"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  const env = getEnvDiagnostics()

  let database: "up" | "down" = "up"
  try {
    await prisma.$queryRaw`SELECT 1`
  } catch {
    database = "down"
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
    },
    { status }
  )
}
