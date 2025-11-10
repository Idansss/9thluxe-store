"use client"

import { useEffect } from 'react'
import { addToRecentlyViewed } from '@/lib/utils'

interface Product {
  id: string
  slug: string
  name: string
  images: unknown
  priceNGN: number
  brand?: string | null
}

export function RecentlyViewedTracker({ product }: { product: Product }) {
  useEffect(() => {
    addToRecentlyViewed(product.id, product)
  }, [product.id]) // Only re-run if product ID changes

  return null
}



