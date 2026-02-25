import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/ui/product-card'
import { mapPrismaProductToCard } from '@/lib/queries/products'
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

const NOTE_OPTIONS = [
  { value: "", label: "Any scent" },
  { value: "oud", label: "Oud" },
  { value: "rose", label: "Rose" },
  { value: "citrus", label: "Citrus" },
  { value: "vanilla", label: "Vanilla" },
  { value: "woody", label: "Woody" },
  { value: "amber", label: "Amber" },
  { value: "sandalwood", label: "Sandalwood" },
  { value: "bergamot", label: "Bergamot" },
  { value: "patchouli", label: "Patchouli" },
]

type ShopSearchParams = {
  category?: string
  brand?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
  note?: string
  q?: string
}

export const dynamic = 'force-dynamic'

export default async function ShopPage({ searchParams }: { searchParams?: Promise<ShopSearchParams> }) {
  const params = (await searchParams) || {}
  const where: any = {}

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
      where.priceNGN = { ...(where.priceNGN ?? {}), gte: min }
    }
  }

  if (params.maxPrice) {
    const max = Number(params.maxPrice)
    if (!Number.isNaN(max)) {
      where.priceNGN = { ...(where.priceNGN ?? {}), lte: max }
    }
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

  const [products, brandRows] = await Promise.all([
    prisma.product.findMany({
      where: {
        ...where,
        deletedAt: null, // Exclude soft-deleted products
      },
      orderBy: orderBy,
      take: 24,
    }),
    prisma.product.findMany({
      where: {
        deletedAt: null, // Exclude soft-deleted products
      },
      distinct: ['brand'],
      select: { brand: true },
    }),
  ])

  const brands = brandRows.map((row) => row.brand).filter(Boolean) as string[]

  const formParams = new URLSearchParams()
  if (params.category) formParams.set('category', params.category)
  if (params.brand) formParams.set('brand', params.brand)
  if (params.minPrice) formParams.set('minPrice', params.minPrice)
  if (params.maxPrice) formParams.set('maxPrice', params.maxPrice)
  if (params.sort) formParams.set('sort', params.sort)
  if (params.note) formParams.set('note', params.note)
  if (params.q) formParams.set('q', params.q)

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

        <form className="grid gap-6 rounded-[32px] border border-border bg-background/80 p-6 shadow-[0_30px_60px_rgba(2,6,23,0.1)] md:grid-cols-[0.9fr,1.1fr]" method="get">
          {params.q && <input type="hidden" name="q" value={params.q} />}
          <div className="space-y-4">
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Category
            </label>
            <select
              name="category"
              defaultValue={params.category || ''}
              className="input w-full"
            >
              <option value="">All</option>
              <option value="perfumes">Perfumes</option>
            </select>

            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Brand
            </label>
            <select name="brand" defaultValue={params.brand || ''} className="input w-full">
              <option value="">All brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>

            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Scent / Note
            </label>
            <select name="note" defaultValue={params.note || ''} className="input w-full">
              {NOTE_OPTIONS.map((opt) => (
                <option key={opt.value || 'any'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  Min price (₦)
                </label>
                <input
                  name="minPrice"
                  type="number"
                  defaultValue={params.minPrice || ''}
                  className="input w-full"
                  min={0}
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
                  Max price (₦)
                </label>
                <input
                  name="maxPrice"
                  type="number"
                  defaultValue={params.maxPrice || ''}
                  className="input w-full"
                  min={0}
                />
              </div>
            </div>
            <label className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
              Sort
            </label>
            <select name="sort" defaultValue={params.sort || 'newest'} className="input w-full">
              <option value="newest">Newest</option>
              <option value="price_asc">Price low → high</option>
              <option value="price_desc">Price high → low</option>
              <option value="best_selling">Best selling</option>
            </select>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                className="btn px-6 py-3 text-xs font-semibold uppercase tracking-[0.4em]"
              >
                Apply
              </button>
              <Link href="/shop" className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Reset filters
              </Link>
            </div>
          </div>
        </form>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={mapPrismaProductToCard(product)} />
          ))}
        </div>
      </div>
    </section>
  )
}
