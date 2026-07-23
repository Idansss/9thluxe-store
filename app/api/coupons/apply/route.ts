// app/api/coupons/apply/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { clientIp, consumeRateLimit } from '@/lib/middleware/limiter'
import { validateCoupon } from '@/lib/pricing'
import { hasTrustedOrigin } from '@/lib/security/origin'

export async function POST(req: NextRequest) {
  try {
    if (!hasTrustedOrigin(req)) {
      return NextResponse.json({ error: 'Request origin could not be verified' }, { status: 403 })
    }
    const limit = await consumeRateLimit(
      `coupon-preview:ip:${clientIp(req)}`,
      20,
      15 * 60 * 1000,
    )
    if (!limit.ok) {
      return NextResponse.json({ error: 'Too many requests. Try again later.' }, { status: 429 })
    }
    const { code, subtotalNGN } = await req.json()
    if (!code || typeof subtotalNGN !== 'number') {
      return NextResponse.json({ error: 'bad_request' }, { status: 400 })
    }
    const result = await validateCoupon(String(code), subtotalNGN)
    if (!result.ok) return NextResponse.json({ ok: false, message: result.message })
    return NextResponse.json({ ok: true, discountNGN: result.discountNGN, couponId: result.couponId })
  } catch (e) {
    console.error('coupon apply error', e)
    return NextResponse.json({ error: 'server_error' }, { status: 500 })
  }
}
