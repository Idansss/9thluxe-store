import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductDetail } from "@/components/product-detail"
import { RelatedProducts } from "@/components/related-products"
import { notFound } from "next/navigation"

// Mock product data - perfume only
const products = [
  {
    id: "1",
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
    id: "2",
    name: "Bleu de Chanel",
    brand: "Chanel",
    price: 95000,
    image: "/blue-perfume-bottle-elegant-minimal-luxury-backgro.jpg",
    description:
      "A fresh, versatile fragrance with citrus and woody notes. A timeless scent for the modern individual.",
    rating: 4.8,
    reviewCount: 312,
    stock: 18,
    category: "perfumes",
    images: ["/blue-perfume-bottle-elegant-minimal-luxury-backgro.jpg"],
  },
  {
    id: "3",
    name: "Oud Wood",
    brand: "Tom Ford",
    price: 120000,
    image: "/tom-ford-oud-wood-perfume-bottle.jpg",
    description:
      "Rare oud, exotic spices, and warm woods. A bold, long-lasting signature scent.",
    rating: 4.9,
    reviewCount: 156,
    stock: 12,
    category: "perfumes",
    images: ["/tom-ford-oud-wood-perfume-bottle.jpg"],
  },
]

const relatedProducts = [
  {
    id: "4",
    name: "Aventus",
    brand: "Creed",
    price: 185000,
    image: "/creed-aventus-perfume-bottle.jpg",
  },
  {
    id: "5",
    name: "Noir Extreme",
    brand: "Tom Ford",
    price: 110000,
    image: "/elegant-perfume-bottle-with-metallic-cap-on-light-.jpg",
  },
  {
    id: "6",
    name: "La Nuit de L'Homme",
    brand: "YSL",
    price: 75000,
    image: "/blue-perfume-bottle-elegant-minimal.jpg",
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
        <div className="container mx-auto max-w-[1200px] px-6 pb-16">
          <RelatedProducts products={relatedProducts} />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
