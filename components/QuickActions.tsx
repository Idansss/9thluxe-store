"use client"

import { Heart, ShoppingBag, Eye } from 'lucide-react'

interface QuickActionsProps {
  productId: string
  inWishlist?: boolean
  onWishlistToggle?: () => void
  onQuickView?: () => void
}

export function QuickActions({ productId, inWishlist, onWishlistToggle, onQuickView }: QuickActionsProps) {
  return (
    <div className="absolute top-3 left-3 flex flex-col gap-2 opacity-0 transition-opacity group-hover:opacity-100">
      <button
        onClick={onWishlistToggle}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-lg transition-transform hover:scale-110"
        aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={`h-5 w-5 ${inWishlist ? 'fill-rose-500 text-rose-500' : 'text-gray-700'}`} />
      </button>
      <button
        onClick={onQuickView}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-lg transition-transform hover:scale-110"
        aria-label="Quick view"
      >
        <Eye className="h-5 w-5 text-gray-700" />
      </button>
    </div>
  )
}



