import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Perfume background image */}
      <div className="absolute inset-0">
        <Image
          src="/luxury-perfume-bottles.png"
          alt="Luxury perfume bottles"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Soft gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/85 to-background/55 dark:from-background/98 dark:via-background/90 dark:to-background/65" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight mb-6 text-balance">
            Fàdè
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-xl">
            Curated luxury perfumes. Discover timeless elegance crafted for the discerning individual.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" className="h-12 px-8 text-base">
              <Link href="/category/perfumes">
                Shop Perfumes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base bg-transparent">
              <Link href="/collections">Explore Collections</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
