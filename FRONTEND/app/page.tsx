import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ProductGrid } from "@/components/product-grid"

// Mock product data - will be replaced with real data later
const freshDrops = [
  {
    id: "1",
    name: "Chronograph Elite",
    brand: "Rolex",
    price: 450000,
    image: "/luxury-black-chronograph-watch-on-white-background.jpg",
    category: "watches",
  },
  {
    id: "2",
    name: "Sauvage Elixir",
    brand: "Dior",
    price: 85000,
    image: "/elegant-perfume-bottle-with-metallic-cap-on-light-.jpg",
    category: "perfumes",
  },
  {
    id: "3",
    name: "Aviator Sunglasses",
    brand: "Ray-Ban",
    price: 65000,
    image: "/luxury-sunglasses-on-soft-white-background-minimal.jpg",
    category: "eyeglasses",
  },
  {
    id: "4",
    name: "Royal Oak Automatic",
    brand: "Audemars Piguet",
    price: 1200000,
    image: "/luxury-silver-watch-with-octagonal-bezel-on-white.jpg",
    category: "watches",
  },
  {
    id: "5",
    name: "Bleu de Chanel",
    brand: "Chanel",
    price: 95000,
    image: "/blue-perfume-bottle-elegant-minimal-luxury-backgro.jpg",
    category: "perfumes",
  },
  {
    id: "6",
    name: "Wayfarer Classic",
    brand: "Ray-Ban",
    price: 55000,
    image: "/black-wayfarer-sunglasses-on-white-seamless-backgr.jpg",
    category: "eyeglasses",
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
              Discover premium watches, perfumes, and eyeglasses. Nigeria-wide delivery to all 36 states and the FCT.
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
