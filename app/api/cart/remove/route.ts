import { NextResponse } from 'next/server'
import { removeFromCart } from '@/components/cartActions'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const { productId } = await request.json()
  if (!productId) {
    return NextResponse.json({ success: false, error: 'Missing productId' }, { status: 400 })
  }
  await removeFromCart(productId)
  return NextResponse.json({ success: true })
}
