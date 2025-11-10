// lib/pricing.ts
import { prisma } from '@/lib/prisma'

export type CouponResult =
  | { ok: true; discountNGN: number; couponId: string }
  | { ok: false; message: string }

export async function validateCoupon(code: string, subtotalNGN: number): Promise<CouponResult> {
  const now = new Date()
  const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } })
  if (!coupon || !coupon.active) return { ok: false, message: 'Invalid code' }
  if (coupon.startsAt > now || coupon.endsAt < now) return { ok: false, message: 'Coupon expired' }
  if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) return { ok: false, message: 'Coupon limit reached' }
  if (coupon.minSubtotal != null && subtotalNGN < coupon.minSubtotal) return { ok: false, message: `Requires minimum ₦${coupon.minSubtotal.toLocaleString()}` }

  let discount = 0
  if (coupon.type === 'PERCENT') {
    discount = Math.floor((subtotalNGN * coupon.value) / 100)
  } else if (coupon.type === 'FIXED') {
    discount = coupon.value
  }
  discount = Math.min(Math.max(discount, 0), subtotalNGN)
  return { ok: true, discountNGN: discount, couponId: coupon.id }
}
