import Image from "next/image"
import Link from "next/link"
import { formatPrice } from "@/lib/format"

interface RelatedProduct {
  id: string
  name: string
  brand: string
  price: number
  image: string
}

interface RelatedProductsProps {
  products: RelatedProduct[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  return (
    <section className="border-t border-border bg-muted/30 py-12">
      <div className="container mx-auto max-w-[1200px] px-6">
        <h2 className="mb-8 text-xl font-semibold">You may also like</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group block overflow-hidden rounded-xl border border-border bg-card transition-all hover:shadow-lg"
            >
              <div className="relative aspect-square overflow-hidden bg-muted">
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={`${product.brand} ${product.name}`}
                  fill
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <p className="text-xs text-muted-foreground">{product.brand}</p>
                <h3 className="mt-1 text-sm font-medium leading-snug">{product.name}</h3>
                <p className="mt-2 text-base font-semibold">{formatPrice(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
