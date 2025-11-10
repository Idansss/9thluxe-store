import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Plus, Minus } from 'lucide-react'

import { getCart, updateCartItem, clearCart, removeFromCart } from '@/components/cartActions'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/format'

export const runtime = 'nodejs'

type CartItem = { productId: string; quantity: number }

async function getCartWithProducts() {
  const cart = (await getCart()) as CartItem[]
  if (cart.length === 0) return { cart, products: [], total: 0 }

  const productIds = cart.map((item) => item.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: {
      id: true,
      name: true,
      slug: true,
      priceNGN: true,
      images: true,
      brand: true,
      stock: true,
    },
  })

  const priceMap = new Map(products.map((product) => [product.id, product.priceNGN]))
  const total = cart.reduce((sum, item) => sum + (priceMap.get(item.productId) ?? 0) * item.quantity, 0)

  return { cart, products, total }
}

export default async function CartPage() {
  const { cart, products, total } = await getCartWithProducts()

  async function updateQuantity(formData: FormData) {
    'use server'
    const productId = String(formData.get('productId') || '')
    const nextQuantity = Number(formData.get('quantity') || 1)
    await updateCartItem(productId, nextQuantity)
    redirect('/cart')
  }

  async function removeItem(formData: FormData) {
    'use server'
    const productId = String(formData.get('productId') || '')
    await removeFromCart(productId)
    redirect('/cart')
  }

  async function clearAll() {
    'use server'
    await clearCart()
    redirect('/cart')
  }

  async function goToCheckout() {
    'use server'
    redirect('/checkout')
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <header className="mb-10 space-y-3">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-foreground">Your cart</h1>
          <p className="text-sm text-muted-foreground">
            {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <span aria-hidden="true">&larr;</span>
          <span>Back to home</span>
        </Link>
      </header>
      {cart.length === 0 ? (
        <section className="rounded-2xl border border-border bg-muted/40 p-12 text-center">
          <div className="mb-4 text-sm font-medium uppercase tracking-wide text-muted-foreground">Cart</div>
          <h2 className="mb-2 text-xl font-semibold text-foreground">Your cart is empty</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Looks like you haven&apos;t added any products yet. Discover something you love and come back.
          </p>
          <Link href="/" className="btn inline-flex">
            Start Shopping
          </Link>
        </section>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            {cart.map((item) => {
              const product = products.find((candidate) => candidate.id === item.productId)
              if (!product) return null

              const gallery = Array.isArray(product.images) ? (product.images as string[]) : []
              const primaryImage = gallery[0] || '/placeholder.png'
              const outOfStock = (product.stock ?? 0) <= 0
              const lineTotal = product.priceNGN * item.quantity

              return (
                <div key={item.productId} className="card flex flex-wrap items-center gap-4">
                  <Link href={`/product/${product.slug}`} className="relative h-20 w-20 overflow-hidden rounded-xl bg-muted/60">
                    <Image src={primaryImage} alt={product.name} fill className="object-contain" />
                  </Link>

                  <div className="min-w-[12rem] flex-1 space-y-1">
                    <Link href={`/product/${product.slug}`} className="group inline-flex">
                      <h3 className="text-sm font-semibold text-foreground transition-colors group-hover:text-muted-foreground">
                        {product.name}
                      </h3>
                    </Link>
                    {product.brand && <p className="text-xs text-muted-foreground">{product.brand}</p>}
                    <p className="text-sm font-semibold text-foreground">{formatPrice(product.priceNGN)}</p>
                    {outOfStock && <p className="text-xs text-red-600">Out of stock</p>}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    {/* Quantity Controls */}
                    <form action={updateQuantity} className="flex items-center gap-2">
                      <input type="hidden" name="productId" value={item.productId} />
                      <div className="flex items-center rounded-lg border border-border">
                        <button
                          type="submit"
                          formAction={async (formData) => {
                            'use server'
                            const productId = String(formData.get('productId') || '')
                            const currentQty = cart.find(c => c.productId === productId)?.quantity || 1
                            await updateCartItem(productId, Math.max(1, currentQty - 1))
                            redirect('/cart')
                          }}
                          className="flex h-9 w-9 items-center justify-center transition-colors hover:bg-muted disabled:opacity-50"
                          disabled={item.quantity <= 1 || outOfStock}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          type="submit"
                          formAction={async (formData) => {
                            'use server'
                            const productId = String(formData.get('productId') || '')
                            const currentQty = cart.find(c => c.productId === productId)?.quantity || 1
                            await updateCartItem(productId, Math.min((product.stock || 999), currentQty + 1))
                            redirect('/cart')
                          }}
                          className="flex h-9 w-9 items-center justify-center transition-colors hover:bg-muted disabled:opacity-50"
                          disabled={item.quantity >= (product.stock || 999) || outOfStock}
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                        <input type="hidden" name="productId" value={item.productId} />
                      </div>
                    </form>

                    <form action={removeItem}>
                      <input type="hidden" name="productId" value={item.productId} />
                      <button className="text-xs text-red-600 hover:underline" type="submit">
                        Remove
                      </button>
                    </form>
                  </div>

                  <div className="ml-auto text-sm font-semibold text-foreground sm:text-base">
                    {formatPrice(lineTotal)}
                  </div>
                </div>
              )
            })}
          </div>

          <aside className="lg:col-span-1">
            <div className="card sticky top-4 space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-foreground">Order summary</h3>
                <p className="text-xs text-muted-foreground">
                  Shipping and taxes are calculated at checkout. Lagos orders qualify for same-day dispatch before noon.
                </p>
              </div>

              {/* Promo Code Section */}
              <div className="space-y-2 border-y border-border py-4">
                <p className="text-sm font-medium text-foreground">Have a promo code?</p>
                <form className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Apply
                  </button>
                </form>
              </div>

              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium text-emerald-600">Free</span>
                </div>
                <div className="flex justify-between border-t pt-3 text-base font-semibold text-foreground">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <form action={goToCheckout}>
                  <button className="btn w-full" type="submit">
                    Proceed to checkout
                  </button>
                </form>
                <form action={clearAll}>
                  <button className="btn-outline w-full" type="submit">
                    Clear cart
                  </button>
                </form>
                <Link href="/" className="btn-outline w-full text-center">
                  Continue shopping
                </Link>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  )
}
