"use client"

import type { Product } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import { AlertCircle, Heart, GitCompare } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { formatPrice } from '@/lib/format'

export function ProductCard({ product }: { product: Product }) {
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [compareCount, setCompareCount] = useState(0)
  const router = useRouter()
  const images = Array.isArray(product.images) ? (product.images as string[]) : []
  const coverImage = images[0] || '/placeholder.png'
  const outOfStock = (product.stock ?? 0) <= 0
  const lowStock = (product.stock ?? 0) < 5 && (product.stock ?? 0) > 0

  // Update compare count on mount
  useEffect(() => {
    const stored = localStorage.getItem("compare")
    const compareList = stored ? JSON.parse(stored) : []
    setCompareCount(compareList.length)
  }, [])

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    // TODO: Add actual wishlist API call here
  }

      const addToCompare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const compareData = {
      id: product.id,
      slug: product.slug,
      name: product.name,
      priceNGN: product.priceNGN,
      images: images,
      brand: product.brand,
      description: product.description,
      stock: product.stock,
      ratingAvg: product.ratingAvg,
      ratingCount: product.ratingCount,
    }

    const existing = localStorage.getItem("compare")
    const compareList = existing ? JSON.parse(existing) : []
    
    // Check if already in compare list
    if (compareList.some((p: any) => p.id === product.id)) {
      alert("Product is already in your compare list")
      return
    }

    // Limit to 4 products
    if (compareList.length >= 4) {
      alert("You can compare up to 4 products at a time. Please remove a product first.")
      return
    }

    compareList.push(compareData)
    localStorage.setItem("compare", JSON.stringify(compareList))
    setCompareCount(compareList.length)
    router.push("/compare")
  }

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <article className="overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={coverImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
            className="object-cover transition-transform duration-200 group-hover:scale-105"
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
          />
          
          {/* Low Stock Badge */}
          {lowStock && (
            <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-orange-100 px-2.5 py-1 text-[10px] font-semibold text-orange-700 shadow-sm">
              <AlertCircle className="h-3 w-3" />
              <span>Low Stock</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute bottom-3 right-3 flex gap-2">
            {/* Compare Button */}
            <button
              onClick={addToCompare}
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition-all hover:bg-white hover:shadow-md"
              aria-label="Compare product"
            >
              <GitCompare className="h-5 w-5 text-gray-600" />
              {compareCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {compareCount}
                </span>
              )}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={toggleWishlist}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm transition-all hover:bg-white hover:shadow-md"
              aria-label="Add to wishlist"
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>

        <div className="p-4">
          {product.brand && <p className="text-xs text-muted-foreground">{product.brand}</p>}
          <h3 className="mt-1 text-base font-medium leading-snug">{product.name}</h3>
          <p className="mt-2 text-lg font-semibold">{formatPrice(product.priceNGN)}</p>
        </div>
      </article>
    </Link>
  )
}


