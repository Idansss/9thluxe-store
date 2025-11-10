import Link from "next/link"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/format"
import { addToCart } from "@/components/cartActions"

export const dynamic = "force-dynamic"

export default async function WishlistPage() {
  const session = await auth()
  const email = session?.user?.email

  if (!email) {
    return (
      <div className="rounded-2xl border border-border bg-muted/40 p-6 text-sm text-muted-foreground">
        Please {" "}
        <Link href="/auth/signin" className="font-medium text-foreground underline">
          sign in
        </Link>{" "}
        to view your wishlist.
      </div>
    )
  }

  const wishlistItems = await prisma.wishlist.findMany({
    where: { user: { email } },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          priceNGN: true,
          images: true,
        },
      },
    },
  })

  if (wishlistItems.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-muted/40 p-6 text-sm text-muted-foreground">
        Your wishlist is empty. {" "}
        <Link href="/" className="font-medium text-foreground underline">
          Discover products
        </Link>{" "}
        to add items you love.
      </div>
    )
  }

  async function addItem(productId: string) {
    "use server"
    await addToCart(productId)
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-foreground">Wishlist</h1>
      <ul className="grid gap-4 md:grid-cols-2">
        {wishlistItems.map((item) => {
          const product = item.product
          const gallery = Array.isArray(product.images) ? (product.images as string[]) : []
          const image = gallery[0] || "/placeholder.png"

          return (
            <li key={item.id} className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-4">
              <Link href={`/product/${product.slug}`} className="flex flex-col gap-3">
                <div className="relative h-36 overflow-hidden rounded-xl bg-muted/60">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt={product.name} className="h-full w-full object-cover" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{product.name}</div>
                  <div className="text-xs text-muted-foreground">{formatPrice(product.priceNGN)}</div>
                </div>
              </Link>
              <form action={addItem.bind(null, product.id)}>
                <button className="btn w-full" type="submit">
                  Add to cart
                </button>
              </form>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

