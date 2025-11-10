// components/cartActions.ts
import { cookies } from 'next/headers'

export type CartItem = { productId: string; quantity: number }

const CART_COOKIE = 'cart'
const isProd = process.env.NODE_ENV === 'production'

// Cookie settings: HTTP-only (safer), Lax for normal navigations, Secure in prod
const COOKIE_OPTS: Parameters<ReturnType<typeof cookies>['set']>[2] = {
  path: '/',
  httpOnly: true,
  sameSite: 'lax',
  secure: isProd,
  maxAge: 60 * 60 * 24 * 30, // 30 days
}

/** Internal: parse cookie safely. */
function parse(raw?: string | null): CartItem[] {
  if (!raw) return []
  try {
    const decoded = decodeURIComponent(raw)
    const json = JSON.parse(decoded)
    if (!Array.isArray(json)) return []
    return json
      .map((i: any) => ({
        productId: String(i?.productId || ''),
        quantity: Math.max(1, Number.isFinite(+i?.quantity) ? +i.quantity : 1),
      }))
      .filter((i) => i.productId)
  } catch {
    return []
  }
}

/** Read current cart (server only). */
export async function getCart(): Promise<CartItem[]> {
  const raw = cookies().get(CART_COOKIE)?.value ?? null
  return parse(raw)
}

/** Internal: overwrite cart cookie. */
async function writeCart(items: CartItem[]) {
  const safe = items
    .map((i) => ({
      productId: String(i.productId),
      quantity: Math.max(1, Math.floor(i.quantity || 1)),
    }))
    .filter((i) => i.productId)

  const value = encodeURIComponent(JSON.stringify(safe))
  cookies().set(CART_COOKIE, value, COOKIE_OPTS)
}

/** Replace entire cart. */
export async function setCart(items: CartItem[]) {
  'use server'
  await writeCart(items)
}

/** Add a product (or increase quantity). */
export async function addToCart(productId: string, qty = 1) {
  'use server'
  const cart = await getCart()
  const idx = cart.findIndex((x) => x.productId === productId)
  const addQty = Math.max(1, Math.floor(qty || 1))

  if (idx >= 0) cart[idx].quantity += addQty
  else cart.push({ productId, quantity: addQty })

  await writeCart(cart)
}

/** Update quantity for a product (removes if qty <= 0). */
export async function updateCartItem(productId: string, qty: number) {
  'use server'
  const cart = await getCart()
  const newQty = Math.floor(qty || 0)

  const next =
    newQty <= 0
      ? cart.filter((i) => i.productId !== productId)
      : cart.map((i) =>
          i.productId === productId ? { ...i, quantity: Math.max(1, newQty) } : i
        )

  await writeCart(next)
}

/** Remove a product entirely. */
export async function removeFromCart(productId: string) {
  'use server'
  const cart = await getCart()
  await writeCart(cart.filter((i) => i.productId !== productId))
}

/** Clear everything. */
export async function clearCart() {
  'use server'
  cookies().delete(CART_COOKIE)
}
