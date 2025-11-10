"use client"

import Image from "next/image"
import Link from "next/link"
import { formatPrice } from "@/lib/format"

interface Product {
  id: string
  name: string
  brand: string
  price: number
  image: string
  category: string
}

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.id}`}
      className="group block overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={`${product.brand} ${product.name}`}
          fill
          className="object-cover transition-transform duration-200 group-hover:scale-105"
        />
      </div>

      {/* Details */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground">{product.brand}</p>
        <h3 className="mt-1 text-base font-medium leading-snug">{product.name}</h3>
        <p className="mt-2 text-lg font-semibold">{formatPrice(product.price)}</p>
      </div>
    </Link>
  )
}
