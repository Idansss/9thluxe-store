import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductDetail } from "@/components/product-detail"
import { RelatedProducts } from "@/components/related-products"
import { notFound } from "next/navigation"

// Mock product data
const products = [
  {
    id: "1",
    name: "Chronograph Elite",
    brand: "Rolex",
    price: 450000,
    image: "/luxury-black-chronograph-watch-on-white-background.jpg",
    description:
      "A masterpiece of precision and elegance. This chronograph features a sophisticated movement with impeccable craftsmanship.",
    rating: 4.8,
    reviewCount: 125,
    stock: 12,
    category: "watches",
    images: ["/luxury-black-chronograph-watch-on-white-background.jpg", "/luxury-watch-side-view-on-white.jpg", "/luxury-watch-back-view-on-white.jpg"],
  },
  {
    id: "2",
    name: "Sauvage Elixir",
    brand: "Dior",
    price: 85000,
    image: "/elegant-perfume-bottle-with-metallic-cap-on-light-.jpg",
    description:
      "An intensely fresh and woody fragrance. A powerful concentration that amplifies the iconic freshness of Sauvage.",
    rating: 4.6,
    reviewCount: 89,
    stock: 24,
    category: "perfumes",
    images: ["/elegant-perfume-bottle-with-metallic-cap-on-light-.jpg", "/perfume-bottle-side-angle-luxury.jpg"],
  },
  {
    id: "3",
    name: "Aviator Sunglasses",
    brand: "Ray-Ban",
    price: 65000,
    image: "/luxury-sunglasses-on-soft-white-background-minimal.jpg",
    description:
      "Iconic aviator design with premium lenses. Timeless style meets modern UV protection for everyday elegance.",
    rating: 4.7,
    reviewCount: 203,
    stock: 8,
    category: "eyeglasses",
    images: ["/luxury-sunglasses-on-soft-white-background-minimal.jpg", "/aviator-sunglasses-folded-view.jpg"],
  },
]

const relatedProducts = [
  {
    id: "4",
    name: "Royal Oak Automatic",
    brand: "Audemars Piguet",
    price: 1200000,
    image: "/luxury-silver-watch-with-octagonal-bezel.jpg",
  },
  {
    id: "5",
    name: "Bleu de Chanel",
    brand: "Chanel",
    price: 95000,
    image: "/blue-perfume-bottle-elegant-minimal.jpg",
  },
  {
    id: "6",
    name: "Wayfarer Classic",
    brand: "Ray-Ban",
    price: 55000,
    image: "/black-wayfarer-sunglasses-on-white.jpg",
  },
  {
    id: "7",
    name: "Submariner Date",
    brand: "Rolex",
    price: 850000,
    image: "/luxury-dive-watch-black-dial.jpg",
  },
]

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id)

  if (!product) {
    notFound()
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <ProductDetail product={product} />
        <RelatedProducts products={relatedProducts} />
      </main>
      <SiteFooter />
    </div>
  )
}
