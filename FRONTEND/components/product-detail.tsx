"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Star, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/format"
import { useCartStore } from "@/lib/cart-store"
import { useToast } from "@/hooks/use-toast"

interface Product {
  id: string
  name: string
  brand: string
  price: number
  image: string
  description: string
  rating: number
  reviewCount: number
  stock: number
  images: string[]
}

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const addItem = useCartStore((state) => state.addItem)
  const { toast } = useToast()

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(product.stock, prev + delta)))
  }

  const handleAddToCart = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.image,
      },
      quantity,
    )
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} added to your cart.`,
    })
  }

  return (
    <section className="py-12">
      <div className="container mx-auto max-w-[1200px] px-6">
        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
              <Image
                src={product.images[selectedImage] || "/placeholder.svg"}
                alt={`${product.brand} ${product.name}`}
                fill
                className="object-cover"
                priority
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`relative aspect-square w-20 overflow-hidden rounded-lg border-2 transition-all ${
                      selectedImage === idx ? "border-primary" : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <Image src={img || "/placeholder.svg"} alt={`View ${idx + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground">{product.brand}</p>
              <h1 className="mt-2 text-3xl font-semibold">{product.name}</h1>
              <p className="mt-4 text-3xl font-bold">{formatPrice(product.price)}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 w-fit">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <span className="text-sm font-medium text-amber-900">
                {product.rating} ({product.reviewCount})
              </span>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>

            {/* Stock Badge */}
            {product.stock > 0 ? (
              <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-900">
                In stock: {product.stock}
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-900">
                Out of stock
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="h-9 w-9"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                    className="h-9 w-9"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Button size="lg" className="w-full rounded-xl" disabled={product.stock === 0} onClick={handleAddToCart}>
                Add to cart
              </Button>
            </div>

            {/* Back to Store */}
            <Link href="/" className="inline-block text-sm text-muted-foreground underline hover:text-foreground">
              ← Back to store
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
