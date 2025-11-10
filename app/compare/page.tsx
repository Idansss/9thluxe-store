"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"
import { formatPrice } from "@/lib/format"

interface CompareProduct {
  id: string
  slug: string
  name: string
  priceNGN: number
  images: string[]
  brand?: string | null
  description: string
  stock: number | null
  ratingAvg: number | null
  ratingCount: number | null
}

export default function ComparePage() {
  const [products, setProducts] = useState<CompareProduct[]>([])

  useEffect(() => {
    // Load compared products from localStorage
    const stored = localStorage.getItem("compare")
    if (stored) {
      try {
        setProducts(JSON.parse(stored))
      } catch (error) {
        console.error("Failed to load compared products:", error)
      }
    }
  }, [])

  const removeProduct = (productId: string) => {
    const updated = products.filter((p) => p.id !== productId)
    setProducts(updated)
    localStorage.setItem("compare", JSON.stringify(updated))
  }

  const clearAll = () => {
    setProducts([])
    localStorage.removeItem("compare")
  }

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <h1 className="mb-4 text-3xl font-semibold">Compare Products</h1>
          <p className="mb-8 text-muted-foreground">Add products to compare their features and prices.</p>
          <Link href="/" className="btn">
            Start Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Compare Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Compare up to 4 products • {products.length} {products.length === 1 ? 'product' : 'products'} selected
          </p>
        </div>
        <button
          onClick={clearAll}
          className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
        >
          Clear All
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card/80 backdrop-blur-sm shadow-xl">
        <table className="w-full border-collapse">
          <thead className="bg-muted/50">
            <tr className="border-b-2 border-border/60">
              <th className="p-4 text-left text-sm font-semibold text-foreground bg-muted/30">Features</th>
              {products.map((product) => (
                <th key={product.id} className="relative min-w-[250px] border-l-2 border-border/60 p-4 text-center bg-muted/20">
                  <button
                    onClick={() => removeProduct(product.id)}
                    className="absolute right-2 top-2 rounded-full p-1.5 transition-colors hover:bg-destructive hover:text-destructive-foreground bg-muted"
                    aria-label="Remove from comparison"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <Link href={`/product/${product.slug}`} className="group block">
                    <div className="relative aspect-square w-full overflow-hidden rounded-2xl border-2 border-border bg-muted">
                      <Image
                        src={product.images[0] || "/placeholder.png"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-foreground">{product.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground font-medium">{product.brand}</p>
                  </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/60 bg-background/40">
              <td className="p-4 text-sm font-semibold text-foreground bg-muted/20">Price</td>
              {products.map((product) => (
                <td key={product.id} className="border-l-2 border-border/60 p-4 text-center text-xl font-bold text-foreground bg-background/40">
                  {formatPrice(product.priceNGN)}
                </td>
              ))}
            </tr>
            <tr className="border-b border-border/60 bg-background/40">
              <td className="p-4 text-sm font-semibold text-foreground bg-muted/20">Rating</td>
              {products.map((product) => (
                <td key={product.id} className="border-l-2 border-border/60 p-4 text-center bg-background/40">
                  {product.ratingAvg ? (
                    <div className="flex items-center justify-center gap-1">
                      <span className="text-yellow-500 text-xl">★</span>
                      <span className="text-base font-semibold text-foreground">{product.ratingAvg.toFixed(1)}</span>
                      <span className="text-xs text-muted-foreground">({product.ratingCount})</span>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">No ratings</span>
                  )}
                </td>
              ))}
            </tr>
            <tr className="border-b border-border/60 bg-background/40">
              <td className="p-4 text-sm font-semibold text-foreground bg-muted/20">Stock</td>
              {products.map((product) => (
                <td key={product.id} className="border-l-2 border-border/60 p-4 text-center bg-background/40">
                  <span className={`text-sm font-semibold ${(product.stock ?? 0) > 0 ? "text-emerald-700 dark:text-emerald-400" : "text-rose-700 dark:text-rose-400"}`}>
                    {(product.stock ?? 0) > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </td>
              ))}
            </tr>
            <tr className="border-b border-border/60 bg-background/40">
              <td className="p-4 text-sm font-semibold text-foreground bg-muted/20">Description</td>
              {products.map((product) => (
                <td key={product.id} className="border-l-2 border-border/60 p-4 text-left text-sm text-foreground/90 bg-background/40 leading-relaxed">
                  {product.description}
                </td>
              ))}
            </tr>
            <tr className="bg-background/40">
              <td className="p-4 text-sm font-semibold text-foreground bg-muted/20">Actions</td>
              {products.map((product) => (
                <td key={product.id} className="border-l-2 border-border/60 p-4 bg-background/40">
                  <Link
                    href={`/product/${product.slug}`}
                    className="btn-outline block w-full text-center"
                  >
                    View Details
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
