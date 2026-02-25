import Image from "next/image"

import Link from "next/link"

import { Button } from "@/components/ui/button"

import { ArrowRight } from "lucide-react"



export function BrandStorySection() {

  return (

    <section className="py-16 lg:py-24">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Image */}

          <div className="relative aspect-[4/3] lg:aspect-square rounded-xl overflow-hidden">

            <Image

              src="/fade-brand-story-atelier.jpg"

              alt="The Fàdè story"

              fill

              className="object-cover"

              sizes="(max-width: 1024px) 100vw, 50vw"

            />

          </div>



          {/* Content */}

          <div className="max-w-lg">

            <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight mb-6">The Fàdè Story</h2>

            <div className="space-y-4 text-muted-foreground leading-relaxed">

              <p>

                Founded on the principle that true luxury lies in the details, Fàdè curates an exceptional collection of

                perfumes from the world's most prestigious houses.

              </p>

              <p>

                Our name, meaning "to bring" in Yoruba, reflects our mission: to bring the finest in craftsmanship,

                heritage, and design to those who appreciate the extraordinary.

              </p>

              <p>

                Every piece in our collection tells a story of artistry and dedication, carefully selected to meet our

                uncompromising standards of excellence.

              </p>

            </div>

            <Button asChild variant="outline" className="mt-8 bg-transparent">

              <Link href="/about">

                Learn More About Us

                <ArrowRight className="ml-2 h-4 w-4" />

              </Link>

            </Button>

          </div>

        </div>

      </div>

    </section>

  )

}
