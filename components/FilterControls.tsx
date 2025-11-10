'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Filter, SlidersHorizontal } from 'lucide-react'
import { useState } from 'react'

interface FilterControlsProps {
  uniqueBrands: string[]
  currentBrand?: string
  currentSort?: string
}

export function FilterControls({ uniqueBrands, currentBrand, currentSort }: FilterControlsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isBrandOpen, setIsBrandOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)

  const handleBrandChange = (brand: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (brand) {
      params.set('brand', brand)
    } else {
      params.delete('brand')
    }
    router.push(`?${params.toString()}`)
    setIsBrandOpen(false)
  }

  const handleSortChange = (sort: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (sort === 'newest') {
      params.delete('sort')
    } else {
      params.set('sort', sort)
    }
    router.push(`?${params.toString()}`)
    setIsSortOpen(false)
  }

  const getSortLabel = () => {
    switch (currentSort) {
      case 'price-low': return 'Price: Low to High'
      case 'price-high': return 'Price: High to Low'
      case 'rating': return 'Highest Rated'
      case 'name': return 'Name A-Z'
      default: return 'Newest'
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Brand Filter - Custom Dropdown */}
      <div className="relative">
        <button
          onClick={() => {
            setIsBrandOpen(!isBrandOpen)
            setIsSortOpen(false)
          }}
          className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium transition-all hover:bg-muted hover:shadow-sm"
        >
          <Filter className="h-4 w-4" />
          <span>{currentBrand || 'All Brands'}</span>
          <svg
            className={`h-4 w-4 transition-transform ${isBrandOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isBrandOpen && (
          <div className="absolute top-full z-10 mt-2 w-56 rounded-2xl border border-border bg-background shadow-lg">
            <div className="p-2">
              <button
                onClick={() => handleBrandChange('')}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  !currentBrand
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                All Brands
              </button>
              {uniqueBrands.map(brand => (
                <button
                  key={brand}
                  onClick={() => handleBrandChange(brand)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    currentBrand === brand
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sort - Custom Dropdown */}
      <div className="relative">
        <button
          onClick={() => {
            setIsSortOpen(!isSortOpen)
            setIsBrandOpen(false)
          }}
          className="flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium transition-all hover:bg-muted hover:shadow-sm"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>{getSortLabel()}</span>
          <svg
            className={`h-4 w-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isSortOpen && (
          <div className="absolute right-0 top-full z-10 mt-2 w-56 rounded-2xl border border-border bg-background shadow-lg">
            <div className="p-2">
              <button
                onClick={() => handleSortChange('newest')}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  !currentSort || currentSort === 'newest'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                Newest
              </button>
              <button
                onClick={() => handleSortChange('price-low')}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  currentSort === 'price-low'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                Price: Low to High
              </button>
              <button
                onClick={() => handleSortChange('price-high')}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  currentSort === 'price-high'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                Price: High to Low
              </button>
              <button
                onClick={() => handleSortChange('rating')}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  currentSort === 'rating'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                Highest Rated
              </button>
              <button
                onClick={() => handleSortChange('name')}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  currentSort === 'name'
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }`}
              >
                Name A-Z
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Click outside to close */}
      {(isBrandOpen || isSortOpen) && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => {
            setIsBrandOpen(false)
            setIsSortOpen(false)
          }}
        />
      )}
    </div>
  )
}
