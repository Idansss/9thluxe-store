import type { PaymentProvider } from "@/integrations/payments/types"
import { logger } from "@/lib/observability/logger"
import { settleSuccessfulPayment } from "@/lib/payments/settlement"
import { prisma } from "@/lib/prisma"

export type ReconciliationOutcome =
  | "settled"
  | "duplicate"
  | "pending"
  | "failed"
  | "abandoned"
  | "review_required"
  | "skipped"

export async function reconcilePaymentAttempt(
  attemptId: string,
  provider: PaymentProvider,
): Promise<ReconciliationOutcome> {
  const attempt = await prisma.paymentAttempt.findFirst({
    where: {
      id: attemptId,
      provider: provider.name,
      status: "PENDING",
      failureCode: null,
    },
    select: {
      id: true,
      orderId: true,
      providerReference: true,
      expectedAmountNGN: true,
      expectedCurrency: true,
    },
  })
  if (!attempt) return "skipped"

  const verified = await provider.verify(attempt.providerReference, {
    amountNGN: attempt.expectedAmountNGN,
    currency: attempt.expectedCurrency,
  })

  if (verified.status === "pending") return "pending"

  if (
    verified.status === "failed" ||
    verified.status === "abandoned"
  ) {
    await prisma.paymentAttempt.updateMany({
      where: { id: attempt.id, status: "PENDING" },
      data: {
        status:
          verified.status === "failed" ? "FAILED" : "ABANDONED",
        failureCode: `RECONCILED_${verified.status.toUpperCase()}`,
        verifiedAt: new Date(),
      },
    })
    return verified.status
  }

  const result = await settleSuccessfulPayment({
    orderId: attempt.orderId,
    reference: verified.reference,
    amountNGN: verified.amountNGN,
    currency: verified.currency,
    providerStatus: verified.status,
  })

  if (result.outcome === "settled" || result.outcome === "duplicate") {
    return result.outcome
  }

  await prisma.paymentAttempt.updateMany({
    where: { id: attempt.id, status: "PENDING" },
    data: {
      failureCode:
        result.outcome === "mismatch"
          ? "RECONCILIATION_MISMATCH"
          : "RECONCILIATION_UNKNOWN_ATTEMPT",
      verifiedAt: new Date(),
    },
  })
  return "review_required"
}

export async function reconcilePendingPayments(options: {
  provider: PaymentProvider
  now?: Date
  minimumAgeMs?: number
  limit?: number
}) {
  const now = options.now ?? new Date()
  const minimumAgeMs = Math.max(options.minimumAgeMs ?? 2 * 60 * 1000, 0)
  const limit = Math.min(Math.max(options.limit ?? 20, 1), 100)
  const candidates = await prisma.paymentAttempt.findMany({
    where: {
      provider: options.provider.name,
      status: "PENDING",
      failureCode: null,
      initializedAt: { lte: new Date(now.getTime() - minimumAgeMs) },
    },
    orderBy: { initializedAt: "asc" },
    take: limit,
    select: { id: true },
  })

  const counts: Record<ReconciliationOutcome | "errors", number> = {
    settled: 0,
    duplicate: 0,
    pending: 0,
    failed: 0,
    abandoned: 0,
    review_required: 0,
    skipped: 0,
    errors: 0,
  }

  for (const candidate of candidates) {
    try {
      const outcome = await reconcilePaymentAttempt(
        candidate.id,
        options.provider,
      )
      counts[outcome] += 1
    } catch (error) {
      counts.errors += 1
      logger.error("payment_reconciliation_attempt_failed", {
        paymentAttemptId: candidate.id,
        internal: String(error),
      })
    }
  }

  return { examined: candidates.length, ...counts }
}
