import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductGrid } from "@/components/product-grid"

// Mock product data - perfume only
const freshDrops = [
  {
    id: "1",
    name: "Sauvage Elixir",
    brand: "Dior",
    price: 85000,
    image: "/elegant-perfume-bottle-with-metallic-cap-on-light-.jpg",
    category: "perfumes",
  },
  {
    id: "2",
    name: "Bleu de Chanel",
    brand: "Chanel",
    price: 95000,
    image: "/blue-perfume-bottle-elegant-minimal-luxury-backgro.jpg",
    category: "perfumes",
  },
  {
    id: "3",
    name: "Oud Wood",
    brand: "Tom Ford",
    price: 120000,
    image: "/tom-ford-oud-wood-perfume-bottle.jpg",
    category: "perfumes",
  },
  {
    id: "4",
    name: "Aventus",
    brand: "Creed",
    price: 185000,
    image: "/creed-aventus-perfume-bottle.jpg",
    category: "perfumes",
  },
]

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-border bg-background py-16">
          <div className="container mx-auto max-w-[1200px] px-6 text-center">
            <h1 className="mb-4 text-4xl font-semibold tracking-tight sm:text-5xl">Modern Luxury</h1>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground">
              Discover premium perfumes. Nigeria-wide delivery to all 36 states and the FCT.
            </p>
          </div>
        </section>

        {/* Fresh Drops */}
        <section className="py-16">
          <div className="container mx-auto max-w-[1200px] px-6">
            <h2 className="mb-8 text-2xl font-semibold">Fresh drops</h2>
            <ProductGrid products={freshDrops} />
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}
