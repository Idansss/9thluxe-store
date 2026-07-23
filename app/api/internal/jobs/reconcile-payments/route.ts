import { NextResponse } from "next/server"

import { getPayments } from "@/integrations/registry"
import { env } from "@/lib/env"
import { logger } from "@/lib/observability/logger"
import { reconcilePendingPayments } from "@/lib/payments/reconciliation"
import { hasValidBearerSecret } from "@/lib/security/bearer"

export const runtime = "nodejs"
export const maxDuration = 30

export async function POST(req: Request) {
  if (!env.CRON_SECRET) {
    return NextResponse.json(
      { error: "job_not_configured" },
      { status: 503 },
    )
  }
  if (
    !hasValidBearerSecret(
      req.headers.get("authorization"),
      env.CRON_SECRET,
    )
  ) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const provider = getPayments()
  if (provider.name !== "paystack") {
    return NextResponse.json(
      { error: "payment_provider_unavailable" },
      { status: 503 },
    )
  }

  try {
    const result = await reconcilePendingPayments({ provider, limit: 20 })
    logger.info("payment_reconciliation_batch_processed", result)
    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    logger.error("payment_reconciliation_batch_failed", {
      internal: String(error),
    })
    return NextResponse.json({ error: "job_failed" }, { status: 500 })
  }
}
