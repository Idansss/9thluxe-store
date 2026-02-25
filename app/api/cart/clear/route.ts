import { NextResponse } from 'next/server'
import { clearCart } from '@/components/cartActions'

export const runtime = 'nodejs'

export async function POST() {
  await clearCart()
  return NextResponse.json({ success: true })
}
