// app/checkout/page.tsx
import { prisma } from '@/lib/prisma'
import { getCart } from '@/components/cartActions'
import { redirect } from 'next/navigation'
import { validateCoupon } from '@/lib/pricing'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/format'

export const runtime = 'nodejs'

type CartItem = { productId: string; quantity: number }

async function getCartSummary() {
  const cart = (await getCart()) as CartItem[]
  if (!cart.length) return { items: [], subtotalNGN: 0 }

  const ids = cart.map((c) => c.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    select: { id: true, name: true, priceNGN: true, images: true, brand: true },
  })

  const map = new Map(products.map((p) => [p.id, p]))
  const items = cart
    .filter((c) => map.has(c.productId))
    .map((c) => {
      const p = map.get(c.productId)!
      return {
        id: p.id,
        name: p.name,
        brand: p.brand,
        images: Array.isArray(p.images) ? p.images : [],
        unit: p.priceNGN,
        qty: c.quantity,
        line: p.priceNGN * c.quantity,
      }
    })

  const subtotalNGN = items.reduce((s, i) => s + i.line, 0)
  return { items, subtotalNGN }
}

async function payWithPaystack(formData: FormData, items: any[], subtotalNGN: number) {
  'use server'
  if (!items.length) {
    throw new Error('Your cart is empty.')
  }

  const email = String(formData.get('email') || '').trim()
  const addressLine1 = String(formData.get('addressLine1') || '').trim()
  const city = String(formData.get('city') || '').trim()
  const state = String(formData.get('state') || '').trim()
  const phone = String(formData.get('phone') || '').trim()
  const couponCode = String(formData.get('coupon') || '').trim()

  if (!email || !addressLine1 || !city || !state || !phone) {
    throw new Error('Please fill in all required fields.')
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new Error('Please enter a valid email address.')
  }

  const phoneRegex = /^(\+234|234|0)?[789][01]\d{8}$/
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    throw new Error('Please enter a valid Nigerian phone number.')
  }

  let discountNGN = 0
  let couponId: string | undefined
  if (couponCode) {
    const res = await validateCoupon(couponCode, subtotalNGN)
    if (!res.ok) throw new Error(res.message)
    discountNGN = res.discountNGN
    couponId = res.couponId
  }

  const totalNGN = Math.max(subtotalNGN - discountNGN, 0)

  const orderData: any = {
    status: 'PENDING',
    subtotalNGN,
    discountNGN,
    totalNGN,
    addressLine1,
    city,
    state,
    phone,
    user: {
      connectOrCreate: {
        where: { email },
        create: { email, passwordHash: '' },
      },
    },
    items: {
      create: items.map((i) => ({
        product: { connect: { id: i.id } },
        quantity: i.qty,
        priceNGN: i.unit,
      })),
    },
  }
  if (couponId) orderData.couponId = couponId

  const order = await prisma.order.create({ data: orderData, select: { id: true } })

  if (!process.env.PAYSTACK_SECRET_KEY) {
    redirect(`/checkout/success?mock=1&order=${order.id}`)
  }

  const appUrl = process.env.APP_URL || 'http://localhost:3000'
  const res = await fetch(`${appUrl}/api/paystack/initialize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify({
      email,
      amountNGN: totalNGN,
      metadata: { orderId: order.id, addressLine1, city, state, phone },
    }),
  })
  let data: any = {}
  try {
    data = await res.json()
  } catch {}
  if (!res.ok || !data?.authorization_url) {
    throw new Error(data?.error || data?.message || 'Payment initialization failed. Please try again.')
  }
  redirect(data.authorization_url)
}

export default async function CheckoutPage() {
  const { items, subtotalNGN } = await getCartSummary()
  const hasKeys = !!(process.env.PAYSTACK_PUBLIC_KEY && process.env.PAYSTACK_SECRET_KEY)

  async function handleCheckout(formData: FormData) {
    'use server'
    return payWithPaystack(formData, items, subtotalNGN)
  }

  return (
    <div className="container mx-auto max-w-6xl px-6 py-10">
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <Link href="/cart" className="hover:text-foreground transition-colors">Cart</Link>
        <span>/</span>
        <span className="text-foreground">Checkout</span>
      </nav>

      <h1 className="mb-8 text-3xl font-semibold">Checkout</h1>

      {!items.length ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
          <h2 className="mb-2 text-xl font-semibold text-foreground">Your cart is empty</h2>
          <p className="mb-6 text-sm text-muted-foreground">Add some items to your cart before proceeding to checkout.</p>
          <Link className="btn inline-flex" href="/">Start Shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary (left) */}
          <div className="lg:order-1">
            <div className="sticky top-4 rounded-3xl border border-border bg-card p-6">
              <h2 className="mb-6 text-xl font-semibold text-foreground">Order Summary</h2>
              <div className="mb-6 space-y-4">
                {items.map((item) => {
                  const imgs = Array.isArray(item.images) ? (item.images as string[]) : []
                  const cover = imgs[0] || '/placeholder.png'
                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="relative h-12 w-12 overflow-hidden rounded bg-muted">
                        <Image src={cover} alt={item.name} fill className="object-contain" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-foreground">{item.name}</div>
                        {item.brand && <div className="text-xs text-muted-foreground">{item.brand}</div>}
                        <div className="text-xs text-muted-foreground">{formatPrice(item.unit)} x {item.qty}</div>
                      </div>
                      <div className="text-sm font-semibold text-foreground">{formatPrice(item.line)}</div>
                    </div>
                  )
                })}
              </div>
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-sm text-muted-foreground"><span>Subtotal</span><span>{formatPrice(subtotalNGN)}</span></div>
                <div className="flex justify-between text-sm text-muted-foreground"><span>Shipping</span><span className="font-medium text-emerald-600">Free</span></div>
                <div className="flex justify-between border-t border-border pt-3 text-lg font-semibold text-foreground"><span>Total</span><span>{formatPrice(subtotalNGN)}</span></div>
              </div>
            </div>
          </div>

          {/* Checkout Form (right) */}
          <div className="lg:order-2">
            {!hasKeys && (
              <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="text-amber-600">!</div>
                  <div>
                    <h3 className="font-medium text-amber-800">Demo Mode</h3>
                    <p className="mt-1 text-sm text-amber-700">
                      Paystack keys not configured. This is a demo checkout that will redirect to a success page. Add
                      <code className="rounded bg-amber-100 px-1"> PAYSTACK_PUBLIC_KEY </code> and
                      <code className="rounded bg-amber-100 px-1"> PAYSTACK_SECRET_KEY </code> in your environment to enable real payments.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form action={handleCheckout} className="space-y-6">
              <div className="rounded-3xl border border-border bg-card p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Contact Information</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="mb-1 block text-sm font-medium text-foreground">Email Address *</label>
                    <input id="email" name="email" type="email" required className="input w-full" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="mb-1 block text-sm font-medium text-foreground">Phone Number *</label>
                    <input id="phone" name="phone" type="tel" required className="input w-full" placeholder="08012345678" />
                    <p className="mt-1 text-xs text-muted-foreground">Nigerian phone number format (e.g., 08012345678)</p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-card p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Shipping Address</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="addressLine1" className="mb-1 block text-sm font-medium text-foreground">Address *</label>
                    <input id="addressLine1" name="addressLine1" type="text" required className="input w-full" placeholder="Street address, building, apartment" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="city" className="mb-1 block text-sm font-medium text-foreground">City *</label>
                      <input id="city" name="city" type="text" required className="input w-full" placeholder="Lagos" />
                    </div>
                    <div>
                      <label htmlFor="state" className="mb-1 block text-sm font-medium text-foreground">State *</label>
                      <input id="state" name="state" type="text" required className="input w-full" placeholder="Lagos" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-card p-6">
                <h3 className="mb-4 text-lg font-semibold text-foreground">Coupon Code</h3>
                <div>
                  <label htmlFor="coupon" className="mb-1 block text-sm font-medium text-foreground">Coupon Code (Optional)</label>
                  <input id="coupon" name="coupon" type="text" className="input w-full" placeholder="Enter coupon code" />
                  <p className="mt-1 text-xs text-muted-foreground">Enter a valid coupon code to get a discount on your order</p>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <button className="btn w-full py-3 text-lg" type="submit">{hasKeys ? 'Pay with Paystack' : 'Complete Order (Demo)'}</button>
                <Link href="/cart" className="btn-outline w-full text-center">Back to Cart</Link>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

