import Image from 'next/image'
import Link from 'next/link'

import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/format'

type Props = {
  productId: string
  category: 'PERFUMES'
  brand?: string | null
  limit?: number
}

export default async function RelatedProducts({ productId, category, brand, limit = 4 }: Props) {
  let related = await prisma.product.findMany({
    where: {
      id: { not: productId },
      category,
      ...(brand ? { brand } : {}),
    },
    orderBy: [{ ratingAvg: 'desc' }, { createdAt: 'desc' }],
    take: limit,
    select: { id: true, name: true, slug: true, priceNGN: true, images: true, brand: true },
  })

  if (related.length < limit) {
    const additional = await prisma.product.findMany({
      where: {
        id: { notIn: [productId, ...related.map((item) => item.id)] },
        category,
      },
      orderBy: [{ ratingAvg: 'desc' }, { createdAt: 'desc' }],
      take: limit - related.length,
      select: { id: true, name: true, slug: true, priceNGN: true, images: true, brand: true },
    })

    related = [...related, ...additional]
  }

  if (related.length === 0) return null

  return (
    <section className="mt-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">You may also like</h2>
        <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
          See all products
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {related.map((product) => {
          const images = Array.isArray(product.images) ? (product.images as string[]) : []
          const cover = images[0] || '/placeholder.png'

          return (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group overflow-hidden rounded-2xl border border-border bg-card transition-transform hover:-translate-y-0.5"
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Image
                  src={cover}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              <div className="space-y-1.5 p-4">
                {product.brand && (
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{product.brand}</p>
                )}
                <p className="line-clamp-1 text-sm font-semibold text-foreground transition-colors group-hover:text-muted-foreground">
                  {product.name}
                </p>
                <p className="text-sm font-medium text-foreground">{formatPrice(product.priceNGN)}</p>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
