import type { ProviderRefundStatus } from "@/integrations/payments/types"
import { resolveLoyaltyTier } from "@/lib/config/commerce"
import { prisma } from "@/lib/prisma"

interface RefundReceipt {
  provider: string
  eventId: string
  topic: string
}

export type SettleRefundResult =
  | { outcome: "updated"; refundId: string; status: string }
  | { outcome: "duplicate"; refundId?: string; status?: string }
  | { outcome: "unknown" }
  | { outcome: "mismatch"; refundId: string }

function databaseStatus(status: ProviderRefundStatus) {
  switch (status) {
    case "processing":
      return "PROCESSING" as const
    case "needs_attention":
      return "NEEDS_ATTENTION" as const
    case "processed":
      return "PROCESSED" as const
    case "failed":
      return "FAILED" as const
    default:
      return "PENDING" as const
  }
}

export async function settleRefundStatus(input: {
  providerRefundId?: string | null
  paymentReference?: string | null
  status: ProviderRefundStatus
  amountNGN: number
  currency: string
  receipt?: RefundReceipt
}): Promise<SettleRefundResult> {
  const result = await prisma.$transaction(async (tx) => {
    if (input.receipt) {
      const receipt = await tx.webhookReceipt.createMany({
        data: [{ ...input.receipt, processedAt: new Date() }],
        skipDuplicates: true,
      })
      if (receipt.count === 0) {
        return { outcome: "duplicate" as const }
      }
    }

    const refund = await tx.refund.findFirst({
      where: {
        OR: [
          ...(input.providerRefundId
            ? [{ providerRefundId: input.providerRefundId }]
            : []),
          ...(input.paymentReference
            ? [
                {
                  paymentAttempt: {
                    providerReference: input.paymentReference,
                  },
                },
              ]
            : []),
        ],
      },
      include: {
        order: { select: { id: true, userId: true, status: true } },
      },
    })
    if (!refund) return { outcome: "unknown" as const }

    if (
      refund.amountNGN !== input.amountNGN ||
      refund.currency !== input.currency
    ) {
      await tx.refund.update({
        where: { id: refund.id },
        data: {
          status: "NEEDS_ATTENTION",
          failureCode: "REFUND_STATUS_MISMATCH",
        },
      })
      return { outcome: "mismatch" as const, refundId: refund.id }
    }

    if (refund.status === "PROCESSED") {
      return {
        outcome: "duplicate" as const,
        refundId: refund.id,
        status: refund.status,
      }
    }

    const nextStatus = databaseStatus(input.status)
    const refundUpdate = {
      providerRefundId: input.providerRefundId ?? refund.providerRefundId,
      status: nextStatus,
      failureCode:
        nextStatus === "FAILED"
          ? "PROVIDER_REFUND_FAILED"
          : nextStatus === "NEEDS_ATTENTION"
            ? "PROVIDER_NEEDS_ATTENTION"
            : null,
      processedAt: nextStatus === "PROCESSED" ? new Date() : null,
    }
    if (nextStatus === "PROCESSED") {
      const claimed = await tx.refund.updateMany({
        where: { id: refund.id, status: { not: "PROCESSED" } },
        data: refundUpdate,
      })
      if (claimed.count !== 1) {
        return {
          outcome: "duplicate" as const,
          refundId: refund.id,
          status: "PROCESSED",
        }
      }
    } else {
      await tx.refund.update({
        where: { id: refund.id },
        data: refundUpdate,
      })
    }

    if (nextStatus === "FAILED") {
      await tx.order.updateMany({
        where: { id: refund.orderId, status: "REFUND_PENDING" },
        data: { status: refund.previousOrderStatus },
      })
    } else if (nextStatus === "PROCESSED") {
      await tx.order.updateMany({
        where: { id: refund.orderId, status: "REFUND_PENDING" },
        data: { status: "REFUNDED" },
      })
      await tx.paymentAttempt.update({
        where: { id: refund.paymentAttemptId },
        data: { status: "REFUNDED" },
      })
      const updatedUser = await tx.user.update({
        where: { id: refund.order.userId },
        data: {
          totalLifetimeSpend: { decrement: refund.amountNGN },
        },
        select: { totalLifetimeSpend: true },
      })
      const totalLifetimeSpend = Math.max(0, updatedUser.totalLifetimeSpend)
      await tx.user.update({
        where: { id: refund.order.userId },
        data: {
          totalLifetimeSpend,
          loyaltyTier: resolveLoyaltyTier(totalLifetimeSpend),
        },
      })
      const existingReversal = await tx.loyaltyLedger.findFirst({
        where: {
          userId: refund.order.userId,
          orderId: refund.order.id,
          reason: "order_reversal",
        },
      })
      if (!existingReversal) {
        const earned = await tx.loyaltyLedger.aggregate({
          where: {
            userId: refund.order.userId,
            orderId: refund.order.id,
            reason: "order_earn",
          },
          _sum: { delta: true },
        })
        const earnedPoints = earned._sum.delta ?? 0
        if (earnedPoints > 0) {
          const balance = await tx.loyaltyLedger.aggregate({
            where: { userId: refund.order.userId },
            _sum: { delta: true },
          })
          const currentBalance = Math.max(0, balance._sum.delta ?? 0)
          const reversal = Math.min(earnedPoints, currentBalance)
          await tx.loyaltyLedger.create({
            data: {
              userId: refund.order.userId,
              orderId: refund.order.id,
              delta: -reversal,
              balanceAfter: currentBalance - reversal,
              reason: "order_reversal",
            },
          })
        }
      }
    }

    return {
      outcome: "updated" as const,
      refundId: refund.id,
      status: nextStatus,
    }
  })
  return result
}
