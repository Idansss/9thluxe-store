import { NextResponse } from 'next/server'
import { updateCartItem, removeFromCart } from '@/components/cartActions'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const { productId, quantity } = await request.json()
  if (!productId) {
    return NextResponse.json({ success: false, error: 'Missing productId' }, { status: 400 })
  }
  const qty = Number(quantity)
  if (qty <= 0) {
    await removeFromCart(productId)
  } else {
    await updateCartItem(productId, qty)
  }
  return NextResponse.json({ success: true })
}
