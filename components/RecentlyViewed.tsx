"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/format'
import { getRecentlyViewed } from '@/lib/utils'

export function RecentlyViewed() {
  const [products, setProducts] = useState<ReturnType<typeof getRecentlyViewed>>([])

  useEffect(() => {
    const viewed = getRecentlyViewed()
    setProducts(viewed)
  }, [])

  if (products.length === 0) return null

  return (
    <div className="mt-12 rounded-xl border border-border bg-card p-6">
      <h2 className="mb-6 text-xl font-semibold text-foreground">Recently Viewed</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {products.map((product) => {
          const images = Array.isArray(product.images) ? (product.images as string[]) : []
          const coverImage = images[0] || '/placeholder.png'
          
          return (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group block"
            >
              <div className="overflow-hidden rounded-xl border border-border bg-background transition-all hover:shadow-lg">
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <Image
                    src={coverImage}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                </div>
                <div className="p-3">
                  {product.brand && (
                    <p className="truncate text-xs text-muted-foreground">{product.brand}</p>
                  )}
                  <h3 className="mt-1 line-clamp-2 text-sm font-medium">{product.name}</h3>
                  <p className="mt-1 text-sm font-semibold">{formatPrice(product.priceNGN)}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}



