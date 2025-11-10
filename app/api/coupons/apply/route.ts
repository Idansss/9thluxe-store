// app/api/coupons/apply/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { validateCoupon } from '@/lib/pricing'

export async function POST(req: NextRequest) {
  try {
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
