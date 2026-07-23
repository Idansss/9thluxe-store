import { resolveLoyaltyTier } from "@/lib/config/commerce"
import { finalizeInventoryForOrder } from "@/lib/inventory/reservations"
import { enqueueOrderPaidEvents } from "@/lib/jobs/outbox"
import { pointsForOrder } from "@/lib/loyalty/points"
import { matchesExpectedPayment } from "@/lib/payments/match"
import { prisma } from "@/lib/prisma"

interface PaymentReceipt {
  provider: string
  eventId: string
  topic: string
}

export interface SettlePaymentInput {
  reference: string
  orderId?: string
  amountNGN: number
  currency: string
  providerStatus: string
  providerTransactionId?: string | null
  receipt?: PaymentReceipt
}

export type SettlePaymentResult =
  | { outcome: "settled"; orderId: string }
  | {
      outcome: "duplicate"
      orderId: string
      paidReference: string | null
    }
  | { outcome: "unknown" }
  | {
      outcome: "mismatch"
      orderId: string
      attemptId: string
      attemptStatus: string
      expectedAmountNGN: number
      orderAmountNGN: number
      expectedCurrency: string
    }

export async function settleSuccessfulPayment(
  input: SettlePaymentInput,
): Promise<SettlePaymentResult> {
  const attempt = await prisma.paymentAttempt.findUnique({
    where: { providerReference: input.reference },
    include: {
      order: {
        select: {
          id: true,
          status: true,
          reference: true,
          totalNGN: true,
          paymentMethod: true,
          couponId: true,
          items: { select: { productId: true, quantity: true } },
        },
      },
    },
  })

  if (!attempt || (input.orderId && attempt.orderId !== input.orderId)) {
    return { outcome: "unknown" }
  }

  const matches = matchesExpectedPayment({
    expectedReference: attempt.providerReference,
    receivedReference: input.reference,
    expectedAmountNGN: attempt.expectedAmountNGN,
    receivedAmountNGN: input.amountNGN,
    expectedCurrency: attempt.expectedCurrency,
    receivedCurrency: input.currency,
    providerStatus: input.providerStatus,
    paymentMethod: attempt.order.paymentMethod,
  })

  if (
    !matches ||
    attempt.expectedAmountNGN !== attempt.order.totalNGN ||
    attempt.status === "FAILED" ||
    attempt.status === "ABANDONED" ||
    attempt.status === "REFUNDED"
  ) {
    return {
      outcome: "mismatch",
      orderId: attempt.orderId,
      attemptId: attempt.id,
      attemptStatus: attempt.status,
      expectedAmountNGN: attempt.expectedAmountNGN,
      orderAmountNGN: attempt.order.totalNGN,
      expectedCurrency: attempt.expectedCurrency,
    }
  }

  try {
    return await prisma.$transaction(async (tx) => {
      if (input.receipt) {
        await tx.webhookReceipt.create({ data: input.receipt })
      }

      await tx.paymentAttempt.updateMany({
        where: {
          id: attempt.id,
          status: { in: ["INITIALIZED", "PENDING"] },
        },
        data: {
          status: "SUCCEEDED",
          providerTransactionId: input.providerTransactionId ?? null,
          verifiedAt: new Date(),
          failureCode: null,
        },
      })

      const transitioned = await tx.order.updateMany({
        where: {
          id: attempt.orderId,
          status: "PENDING",
          paymentMethod: "CARD",
        },
        data: {
          status: "PAID",
          reference: input.reference,
        },
      })
      if (transitioned.count !== 1) {
        const currentOrder = await tx.order.findUnique({
          where: { id: attempt.orderId },
          select: { status: true, reference: true },
        })
        return {
          outcome: "duplicate" as const,
          orderId: attempt.orderId,
          paidReference: currentOrder?.reference ?? null,
        }
      }

      await finalizeInventoryForOrder(
        tx,
        attempt.orderId,
        attempt.order.items,
      )

      if (attempt.order.couponId) {
        await tx.coupon.update({
          where: { id: attempt.order.couponId },
          data: { usedCount: { increment: 1 } },
        })
      }

      const paidOrder = await tx.order.findUniqueOrThrow({
        where: { id: attempt.orderId },
        include: {
          user: true,
          items: { include: { product: true } },
          coupon: true,
        },
      })

      const updatedUser = await tx.user.update({
        where: { id: paidOrder.userId },
        data: { totalLifetimeSpend: { increment: paidOrder.totalNGN } },
        select: { totalLifetimeSpend: true },
      })
      await tx.user.update({
        where: { id: paidOrder.userId },
        data: {
          loyaltyTier: resolveLoyaltyTier(updatedUser.totalLifetimeSpend),
        },
      })

      const points = pointsForOrder(paidOrder.totalNGN)
      if (points > 0) {
        const prior = await tx.loyaltyLedger.aggregate({
          where: { userId: paidOrder.userId },
          _sum: { delta: true },
        })
        await tx.loyaltyLedger.create({
          data: {
            userId: paidOrder.userId,
            delta: points,
            reason: "order_earn",
            balanceAfter: (prior._sum.delta ?? 0) + points,
            orderId: paidOrder.id,
          },
        })
      }

      await enqueueOrderPaidEvents(tx, paidOrder.id)
      return { outcome: "settled" as const, orderId: paidOrder.id }
    })
  } catch (error) {
    if ((error as { code?: string })?.code === "P2002") {
      return {
        outcome: "duplicate",
        orderId: attempt.orderId,
        paidReference: attempt.order.reference,
      }
    }
    throw error
  }
}
