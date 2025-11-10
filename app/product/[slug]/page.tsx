import Image from "next/image"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft, Star, ChevronRight } from "lucide-react"
import type { Category } from "@prisma/client"

import { prisma } from "@/lib/prisma"
import { addToCart } from "@/components/cartActions"
import { formatPrice } from "@/lib/format"
import { RecentlyViewedTracker } from "@/components/RecentlyViewedTracker"
import { RecentlyViewed } from "@/components/RecentlyViewed"
import { ImageLightbox } from "@/components/ImageLightbox"
import { ProductReviews } from "@/components/ProductReviews"

export const runtime = "nodejs"

type PageProps = {
  params: { slug: string }
  searchParams: { productId?: string }
}

// Helper function to get category slug
function getCategorySlug(category: Category): string {
  const map: Record<Category, string> = {
    WATCHES: 'watches',
    PERFUMES: 'perfumes',
    GLASSES: 'glasses',
  }
  return map[category] || 'watches'
}

// Helper function to get category name
function getCategoryName(category: Category): string {
  const map: Record<Category, string> = {
    WATCHES: 'Watches',
    PERFUMES: 'Perfumes',
    GLASSES: 'Eye Glasses',
  }
  return map[category] || 'Products'
}

async function fetchProduct(slug: string, fallbackId?: string) {
  const baseSelect = {
    id: true,
    slug: true,
    name: true,
    description: true,
    priceNGN: true,
    images: true,
    brand: true,
    stock: true,
    category: true,
    ratingAvg: true,
    ratingCount: true,
    createdAt: true,
  }

  const bySlug = await prisma.product.findUnique({ where: { slug }, select: baseSelect })
  if (bySlug) return bySlug

  if (fallbackId) {
    return prisma.product.findUnique({ where: { id: fallbackId }, select: baseSelect })
  }

  return null
}

async function fetchRelated(productId: string, category: Category, brand?: string | null, limit = 5) {
  const baseSelect = {
    id: true,
    slug: true,
    name: true,
    priceNGN: true,
    images: true,
    brand: true,
  }

  let entries = await prisma.product.findMany({
    where: {
      id: { not: productId },
      category,
      ...(brand ? { brand } : {}),
    },
    orderBy: [{ ratingAvg: "desc" }, { createdAt: "desc" }],
    take: limit,
    select: baseSelect,
  })

  if (entries.length < limit) {
    const extra = await prisma.product.findMany({
      where: {
        id: { notIn: [productId, ...entries.map((item) => item.id)] },
        category,
      },
      orderBy: [{ ratingAvg: "desc" }, { createdAt: "desc" }],
      take: limit - entries.length,
      select: baseSelect,
    })

    entries = [...entries, ...extra]
  }

  return entries
}

function RatingBadge({ average, count }: { average: number; count: number }) {
  if (!average || count === 0) return null

  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      <span>
        {average.toFixed(1)} <span className="text-muted-foreground">({count})</span>
      </span>
    </div>
  )
}

export default async function ProductPage({ params, searchParams }: PageProps) {
  const product = await fetchProduct(params.slug, searchParams.productId)
  if (!product) notFound()

  const images = Array.isArray(product.images) ? (product.images as string[]) : []
  const heroImage = images[0] || "/placeholder.png"
  const stockCount = product.stock ?? 0
  const inStock = stockCount > 0

  async function addToCartAction(formData: FormData) {
    "use server"
    const productId = String(formData.get("productId") || "")
    const quantity = Math.max(1, Number(formData.get("quantity") || 1))
    if (!productId) throw new Error("Missing product ID")

    await addToCart(productId, quantity)
    redirect("/cart")
  }

  const related = await fetchRelated(product.id, product.category as Category, product.brand)

  // Fetch reviews for this product
  const reviews = await prisma.review.findMany({
    where: { productId: product.id, approved: true },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      user: {
        select: { name: true },
      },
    },
  })

  return (
    <div className="bg-muted/30">
      {/* Track recently viewed */}
      <RecentlyViewedTracker product={product} />
      
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-10 px-4 py-10 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link 
            href={`/category/${getCategorySlug(product.category)}`} 
            className="hover:text-foreground transition-colors"
          >
            {getCategoryName(product.category)}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div>
          <Link
            href={`/category/${getCategorySlug(product.category)}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to {getCategoryName(product.category)}
          </Link>
        </div>

        <div className="grid gap-10 rounded-3xl border border-border bg-background p-6 shadow-sm lg:grid-cols-[1.1fr,0.9fr] lg:p-10">
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-3xl bg-black/5">
              <ImageLightbox 
                src={heroImage} 
                alt={product.name} 
                width={800} 
                height={800}
                className="mx-auto h-full w-full object-contain"
              />
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.slice(0, 4).map((img, index) => (
                  <div key={`${img}-${index}`} className="relative overflow-hidden rounded-2xl border border-border bg-white/60">
                    <ImageLightbox
                      src={img}
                      alt={`${product.name} preview ${index + 1}`}
                      width={180}
                      height={180}
                      className="h-full w-full object-contain p-2"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                {product.brand || product.category}
              </p>
              <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">{product.name}</h1>
              <RatingBadge average={product.ratingAvg || 0} count={product.ratingCount || 0} />
            </div>

            <p className="text-3xl font-bold text-foreground">{formatPrice(product.priceNGN)}</p>

            <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>

            <div>
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                  inStock ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                }`}
              >
                {inStock ? "In stock" : "Out of stock"}
                {inStock && stockCount > 0 ? ` - ${stockCount} available` : ""}
              </span>
            </div>

            <form action={addToCartAction} className="flex flex-wrap gap-3 rounded-2xl border border-border bg-card p-4">
              <input type="hidden" name="productId" value={product.id} />
              <label className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
                Quantity
                <input
                  name="quantity"
                  type="number"
                  min={1}
                  max={Math.max(1, stockCount)}
                  defaultValue={1}
                  className="h-11 w-20 rounded-xl border border-border bg-background text-center text-foreground focus:border-foreground focus:outline-none"
                  disabled={!inStock}
                />
              </label>
              <button
                type="submit"
                disabled={!inStock}
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                {inStock ? "Add to cart" : "Unavailable"}
              </button>
            </form>
          </div>
        </div>

        {/* You might also like section */}
        {related.length > 0 && (
          <div className="rounded-3xl border border-border bg-background p-8">
            <h2 className="mb-6 text-2xl font-semibold">You might also like</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.slice(0, 4).map((item) => {
                const itemImages = Array.isArray(item.images) ? (item.images as string[]) : []
                const itemCoverImage = itemImages[0] || "/placeholder.png"
                return (
                  <Link key={item.id} href={`/product/${item.slug}`} className="group block">
                    <article className="overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg">
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        <Image
                          src={itemCoverImage}
                          alt={item.name}
                          fill
                          className="object-cover transition-transform duration-200 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        {item.brand && <p className="text-xs text-muted-foreground">{item.brand}</p>}
                        <h3 className="mt-1 text-base font-medium leading-snug">{item.name}</h3>
                        <p className="mt-2 text-lg font-semibold">{formatPrice(item.priceNGN)}</p>
                      </div>
                    </article>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Product Reviews */}
        <ProductReviews
          productId={product.id}
          reviews={reviews}
          averageRating={product.ratingAvg || 0}
          ratingCount={product.ratingCount || 0}
        />
        
        {/* Recently Viewed */}
        <RecentlyViewed />
      </div>
    </div>
  )
}

