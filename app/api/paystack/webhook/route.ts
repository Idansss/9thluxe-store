// app/api/paystack/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'
import { sendReceipt } from '@/emails/sendReceipt'

function verify(reqBody: string, signature?: string) {
  const secret = process.env.PAYSTACK_SECRET_KEY || ''
  if (!secret || !signature) return false
  const hash = crypto.createHmac('sha512', secret).update(reqBody).digest('hex')
  return hash === signature
}

export async function POST(req: NextRequest) {
  const raw = await req.text()
  const signature = req.headers.get('x-paystack-signature') || undefined
  if (!verify(raw, signature)) return NextResponse.json({ error: 'invalid_signature' }, { status: 401 })

  const evt = JSON.parse(raw)
  if (evt?.event === 'charge.success') {
    const ref = evt?.data?.reference as string | undefined
    const orderId = evt?.data?.metadata?.orderId as string | undefined
    if (orderId) {
      const order = await prisma.order.update({
        where: { id: orderId },
        data: { status: 'PAID', reference: ref ?? null },
        include: { user: true, items: { include: { product: true } }, coupon: true }
      })
      // send receipt (best-effort)
      await sendReceipt(order).catch(() => {})
    }
  }

  return NextResponse.json({ ok: true })
}
