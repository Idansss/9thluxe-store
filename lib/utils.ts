import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Store recently viewed products in localStorage
 */
export function addToRecentlyViewed(productId: string, productData: {
  id: string
  slug: string
  name: string
  images: unknown
  priceNGN: number
  brand?: string | null
}) {
  if (typeof window === 'undefined') return
  
  const viewed = getRecentlyViewed()
  const filtered = viewed.filter(item => item.id !== productId)
  filtered.unshift(productData)
  
  const limited = filtered.slice(0, 5) // Keep only last 5
  localStorage.setItem('recently-viewed', JSON.stringify(limited))
}

/**
 * Get recently viewed products from localStorage
 */
export function getRecentlyViewed(): Array<{
  id: string
  slug: string
  name: string
  images: unknown
  priceNGN: number
  brand?: string | null
}> {
  if (typeof window === 'undefined') return []
  
  try {
    const data = localStorage.getItem('recently-viewed')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

