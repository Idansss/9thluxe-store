import { NextRequest, NextResponse } from "next/server"

import { getPayments } from "@/integrations/registry"
import { reversePointsForOrder } from "@/lib/loyalty/service"
import { logger } from "@/lib/observability/logger"
import { settleSuccessfulPayment } from "@/lib/payments/settlement"
import { prisma } from "@/lib/prisma"
import { recordWebhookOnce } from "@/lib/webhooks/idempotency"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  const raw = await req.text()
  const signature = req.headers.get("x-paystack-signature")
  const provider = getPayments()

  if (provider.name !== "paystack") {
    return NextResponse.json(
      { error: "payment_provider_unavailable" },
      { status: 503 },
    )
  }

  const verified = provider.verifyWebhook(raw, signature)
  if (!verified.valid) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 })
  }

  let rawEvent: Record<string, any>
  try {
    rawEvent = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 })
  }

  const eventId = String(
    rawEvent?.id ??
      rawEvent?.data?.id ??
      verified.reference ??
      verified.orderId ??
      "",
  )

  if (verified.event === "charge.success") {
    const { orderId, reference, amountNGN, currency, status } = verified
    if (
      !orderId ||
      !reference ||
      amountNGN == null ||
      !currency ||
      !status
    ) {
      logger.warn("paystack_webhook_incomplete", { eventId })
      return NextResponse.json({ ok: true, ignored: "incomplete" })
    }

    try {
      const result = await settleSuccessfulPayment({
        orderId,
        reference,
        amountNGN,
        currency,
        providerStatus: status,
        providerTransactionId:
          rawEvent?.data?.id == null ? null : String(rawEvent.data.id),
        receipt: eventId
          ? { provider: "paystack", eventId, topic: verified.event }
          : undefined,
      })

      if (result.outcome === "unknown") {
        logger.warn("paystack_webhook_unknown_attempt", {
          eventId,
          reference,
          orderId,
        })
        return NextResponse.json({ ok: true, ignored: "unknown_attempt" })
      }
      if (result.outcome === "mismatch") {
        logger.error("paystack_webhook_payment_mismatch", {
          eventId,
          reference,
          orderId: result.orderId,
          attemptStatus: result.attemptStatus,
          expectedAmountNGN: result.expectedAmountNGN,
          orderAmountNGN: result.orderAmountNGN,
          receivedAmountNGN: amountNGN,
          expectedCurrency: result.expectedCurrency,
          receivedCurrency: currency,
        })
        return NextResponse.json({ ok: true, ignored: "payment_mismatch" })
      }
      if (result.outcome === "duplicate") {
        if (
          result.paidReference &&
          result.paidReference !== reference
        ) {
          logger.error("duplicate_successful_payment", {
            orderId: result.orderId,
            reference,
          })
        }
        return NextResponse.json({ ok: true, duplicate: true })
      }
    } catch (error) {
      logger.error("paystack_webhook_processing_failed", {
        eventId,
        orderId,
        internal: String(error),
      })
      return NextResponse.json(
        { error: "processing_failed" },
        { status: 500 },
      )
    }
  } else if (
    verified.event === "refund.processed" ||
    verified.event === "charge.refunded"
  ) {
    const reference = verified.reference
    if (eventId) {
      const first = await recordWebhookOnce(
        "paystack",
        eventId,
        verified.event,
      )
      if (!first) {
        return NextResponse.json({ ok: true, duplicate: true })
      }
    }
    if (reference) {
      const attempt = await prisma.paymentAttempt.findUnique({
        where: { providerReference: reference },
        select: {
          id: true,
          order: { select: { id: true, userId: true } },
        },
      })
      if (attempt) {
        await prisma.paymentAttempt.update({
          where: { id: attempt.id },
          data: { status: "REFUNDED" },
        })
        await reversePointsForOrder(
          attempt.order.userId,
          attempt.order.id,
        ).catch((error) => {
          logger.error("refund_loyalty_reversal_failed", {
            orderId: attempt.order.id,
            internal: String(error),
          })
        })
      }
    }
  }

  return NextResponse.json({ ok: true })
}
