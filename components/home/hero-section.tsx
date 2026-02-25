import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Clear gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/30 dark:to-muted/20" />
      {/* Subtle dot pattern for depth */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] bg-[radial-gradient(circle_at_1px_1px,currentColor_1px,transparent_0)] bg-[length:40px_40px]"
        aria-hidden
      />
      {/* Soft glow accent */}
      <div className="absolute top-1/4 right-0 w-1/2 h-1/2 bg-gradient-to-l from-primary/5 to-transparent dark:from-primary/10 pointer-events-none" />



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
