import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/ui/product-card'
import { mapPrismaProductToCard } from '@/lib/queries/products'
import { ShopFiltersForm } from '@/components/shop/shop-filters-form'
import type { Product } from '@prisma/client'

const CATEGORY_MAP: Record<string, Product['category']> = {
  perfumes: 'PERFUMES',
}

const SORT_MAP: Record<string, { [key: string]: 'asc' | 'desc' }> = {
  price_asc: { priceNGN: 'asc' },
  price_desc: { priceNGN: 'desc' },
  best_selling: { ratingCount: 'desc' },
  newest: { createdAt: 'desc' },
}

type ShopSearchParams = {
  category?: string
  brand?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
  note?: string
  q?: string
  family?: string
}

export const dynamic = 'force-dynamic'

export default async function ShopPage({ searchParams }: { searchParams?: Promise<ShopSearchParams> }) {
  const params = (await searchParams) || {}
  const where: Record<string, unknown> = {}

  if (params.category) {
    const mapped = CATEGORY_MAP[params.category.toLowerCase()]
    if (mapped) where.category = mapped
  }

  if (params.brand) {
    where.brand = params.brand
  }

  if (params.minPrice) {
    const min = Number(params.minPrice)
    if (!Number.isNaN(min)) {
      where.priceNGN = { ...((where.priceNGN as object) ?? {}), gte: min }
    }
  }

  if (params.maxPrice) {
    const max = Number(params.maxPrice)
    if (!Number.isNaN(max)) {
      where.priceNGN = { ...((where.priceNGN as object) ?? {}), lte: max }
    }
  }

  if (params.family && params.family.trim()) {
    where.fragranceFamily = params.family.trim().toUpperCase()
  }

  if (params.note && params.note.trim()) {
    const term = params.note.trim().toLowerCase()
    where.OR = [
      { notesTop: { contains: term, mode: 'insensitive' } },
      { notesHeart: { contains: term, mode: 'insensitive' } },
      { notesBase: { contains: term, mode: 'insensitive' } },
    ]
  }

  if (params.q && params.q.trim()) {
    const q = params.q.trim()
    const qClause = {
      OR: [
        { name: { contains: q, mode: 'insensitive' as const } },
        { brand: { contains: q, mode: 'insensitive' as const } },
        { notesTop: { contains: q, mode: 'insensitive' as const } },
        { notesHeart: { contains: q, mode: 'insensitive' as const } },
        { notesBase: { contains: q, mode: 'insensitive' as const } },
      ],
    }
    where.AND = [...(Array.isArray(where.AND) ? where.AND : []), qClause]
  }

  const orderBy = SORT_MAP[params.sort || 'newest'] || SORT_MAP.newest

  let products: Awaited<ReturnType<typeof prisma.product.findMany>>
  let brands: string[]
  let fetchError: Error | null = null

  try {
    const [productsResult, brandRows] = await Promise.all([
      prisma.product.findMany({
        where: {
          ...where,
          deletedAt: null,
        },
        orderBy: orderBy,
        take: 24,
      }),
      prisma.product.findMany({
        where: { deletedAt: null },
        distinct: ['brand'],
        select: { brand: true },
      }),
    ])
    products = productsResult
    brands = brandRows.map((row) => row.brand).filter(Boolean) as string[]
  } catch (err) {
    console.error('Shop page data fetch failed:', err)
    fetchError = err instanceof Error ? err : new Error(String(err))
    products = []
    brands = []
  }

  if (fetchError) {
    return (
      <section className="py-16">
        <div className="container mx-auto max-w-[1200px] px-6">
          <div className="rounded-2xl border border-border bg-muted/30 p-8 text-center">
            <h1 className="text-xl font-semibold text-foreground">Couldn’t load the shop</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Something went wrong while loading products. Please try again or browse without filters.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/shop"
                className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Back to shop
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-xl border border-border px-5 py-3 text-sm font-medium hover:bg-muted"
              >
                Go to homepage
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16">
      <div className="container mx-auto max-w-[1200px] px-6 space-y-10">
        <header className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-muted-foreground">Fàdè Shop</p>
          <h1 className="text-4xl font-semibold text-foreground">
            {params.q ? `Search: “${params.q}”` : 'Browse the collections'}
          </h1>
          <p className="text-muted-foreground">
            {params.q ? (
              <>
                {products.length} result{products.length !== 1 ? 's' : ''}.{' '}
                <Link href="/shop" className="text-primary hover:underline">Clear search</Link>
              </>
            ) : (
              'Filter by category, brand, price, and sort to find your next calm luxury piece.'
            )}
          </p>
        </header>

        <ShopFiltersForm params={params} brands={brands} />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={mapPrismaProductToCard(product)} />
          ))}
        </div>
      </div>
    </section>
  )
}
