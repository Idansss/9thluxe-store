import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/ProductCard'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { FilterControls } from '@/components/FilterControls'
import { InfiniteScrollProducts } from '@/components/InfiniteScrollProducts'

const map: Record<string, any> = {
  watches: 'WATCHES',
  perfumes: 'PERFUMES',
  glasses: 'GLASSES',
}

const categoryInfo = {
  watches: { name: 'Watches', emoji: '⌚', description: 'Premium timepieces for every occasion' },
  perfumes: { name: 'Perfumes', emoji: '💐', description: 'Signature scents that define you' },
  glasses: { name: 'Eye Glasses', emoji: '🕶️', description: 'Stylish eyewear for vision and style' },
}

export default async function CategoryPage({ 
  params, 
  searchParams 
}: { 
  params: { slug: string }
  searchParams: { sort?: string; brand?: string }
}) {
  const cat = map[params.slug]
  if (!cat) return notFound()

  const info = categoryInfo[params.slug as keyof typeof categoryInfo]
  
  // Build query
  const where: any = { category: cat }
  if (searchParams.brand) {
    where.brand = { contains: searchParams.brand, mode: 'insensitive' }
  }

  // Build orderBy
  let orderBy: any = { createdAt: 'desc' }
  switch (searchParams.sort) {
    case 'price-low':
      orderBy = { priceNGN: 'asc' }
      break
    case 'price-high':
      orderBy = { priceNGN: 'desc' }
      break
    case 'rating':
      orderBy = { ratingAvg: 'desc' }
      break
    case 'name':
      orderBy = { name: 'asc' }
      break
  }

  const [products, brands] = await Promise.all([
    prisma.product.findMany({ 
      where, 
      orderBy,
      take: 12, // Load first 12 for initial render
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        priceNGN: true,
        images: true,
        brand: true,
        stock: true,
        ratingAvg: true,
        ratingCount: true,
        category: true,
        createdAt: true,
        updatedAt: true,
      }
    }),
    prisma.product.findMany({
      where: { category: cat },
      select: { brand: true },
      distinct: ['brand'],
    })
  ])

  const uniqueBrands = brands
    .map(b => b.brand)
    .filter((brand): brand is string => Boolean(brand))
    .sort()

  return (
    <div className="container mx-auto max-w-[1200px] px-6 py-10">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        <span className="text-foreground">{info.name}</span>
      </nav>

      {/* Category Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-4">
          <div className="text-4xl">{info.emoji}</div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{info.name}</h1>
            <p className="text-muted-foreground">{info.description}</p>
          </div>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="mb-8">
        <FilterControls 
          uniqueBrands={uniqueBrands}
          currentBrand={searchParams.brand}
          currentSort={searchParams.sort}
        />
      </div>

      {/* Products with Infinite Scroll */}
      {products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
          <div className="mb-4 text-4xl">🔍</div>
          <p className="mb-2 text-lg font-semibold text-foreground">No products found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your filters or{' '}
            <Link href="/" className="underline hover:text-foreground">browse all products</Link>
          </p>
        </div>
      ) : (
        <InfiniteScrollProducts
          initialProducts={products}
          category={cat}
          sort={searchParams.sort}
          brand={searchParams.brand}
        />
      )}
    </div>
  )
}
