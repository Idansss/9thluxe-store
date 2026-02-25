import { formatPrice } from '@/lib/format'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { OrderStatus } from '@prisma/client'
import { ClearCartOnSuccess } from '@/components/checkout/clear-cart-on-success'

export const runtime = 'nodejs'

type PageProps = {
  searchParams: {
    mock?: string
    reference?: string
  }
}

async function verifyPaystack(reference: string) {
  const secret = process.env.PAYSTACK_SECRET_KEY?.trim()
  if (!secret) {
    return { ok: false, message: 'PAYSTACK_SECRET_KEY missing', data: null }
  }
  try {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` },
      cache: 'no-store',
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok || !data?.status) {
      return { ok: false, message: data?.message || 'Verification failed', data: null }
    }
    return { ok: true, message: 'Verified', data: data.data }
  } catch (e: any) {
    return { ok: false, message: e?.message || 'Verification error', data: null }
  }
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const isMock = !!searchParams.mock
  const reference = searchParams.reference?.trim()

  let statusLine = ''
  let amountNGN: number | null = null

  if (isMock) {
    statusLine = 'Mock success (no real charge).'
    // Cart is managed by Zustand store, no need to clear cookie
  } else if (reference) {
    // try to verify with Paystack
    const res = await verifyPaystack(reference)
    if (res.ok && res.data?.status === 'success') {
      // amount is in kobo from Paystack; convert to NGN
      amountNGN = Math.round(Number(res.data.amount || 0) / 100)
      statusLine = 'Payment verified.'

      // Cart is cleared by Zustand store after successful checkout
      // No need to clear cookie here

      // if you stored orders with a reference, mark it PAID
      const order = await prisma.order.findFirst({ where: { reference } })
      if (order && order.status !== OrderStatus.PAID) {
        const updatedOrder = await prisma.order.update({
          where: { id: order.id },
          data: { status: OrderStatus.PAID, totalNGN: order.totalNGN || amountNGN || order.totalNGN },
        })
        
        // Create notification for admin
        try {
          await prisma.notification.create({
            data: {
              type: 'ORDER_PAID',
              title: 'New Order Payment',
              message: `Order #${updatedOrder.reference || updatedOrder.id.slice(0, 8)} has been paid. Total: ₦${updatedOrder.totalNGN.toLocaleString()}`,
              orderId: updatedOrder.id,
            }
          })
        } catch {
          // Don't fail if notification creation fails
        }
      }
    } else {
      statusLine = `Payment not verified: ${res.message || 'unknown error'}`
    }
  } else {
    statusLine = 'No payment reference provided.'
  }

  return (
    <section className="mx-auto max-w-xl p-6">
      {(reference || isMock) && <ClearCartOnSuccess />}
      <h1 className="mb-2 text-2xl font-semibold">Payment status</h1>

      <div className="rounded border p-4">
        <p className="text-gray-800 dark:text-neutral-200">
          {isMock
            ? 'This was a mock success (no real charge). Add Paystack keys in .env to enable live payments.'
            : statusLine}
        </p>

        {reference && (
          <p className="mt-2 text-sm text-gray-600 dark:text-neutral-400">
            Reference: <span className="font-mono">{reference}</span>
          </p>
        )}

        {typeof amountNGN === 'number' && amountNGN > 0 && (
          <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
            Amount: {formatPrice(amountNGN)}
          </p>
        )}
      </div>

      <div className="mt-6 flex gap-3">
        <Link href="/" className="btn">
          Continue shopping
        </Link>
        <Link href="/account/orders" className="btn-outline">
          View my orders
        </Link>
      </div>

      {!isMock && !reference && (
        <p className="mt-4 text-sm text-amber-700 dark:text-amber-400">
          Tip: configure your Paystack <code>callback_url</code> to point here with a{" "}
          <code>?reference=...</code> so we can auto-verify and update your order.
        </p>
      )}
    </section>
  )
}


