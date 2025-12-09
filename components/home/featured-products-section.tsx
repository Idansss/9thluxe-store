"use client"



import { SectionHeader } from "@/components/ui/section-header"

import { ProductGrid } from "@/components/ui/product-grid"

import type { Product } from "@/components/ui/product-card"



interface FeaturedProductsSectionProps {

  products: Product[]

}



export function FeaturedProductsSection({ products }: FeaturedProductsSectionProps) {

  return (

    <section className="py-16 lg:py-24 bg-card">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeader

          title="Featured Products"

          subtitle="Handpicked selections from our luxury collection"

          viewAllHref="/collections/featured"

        />



        <ProductGrid products={products} columns={4} />

      </div>

    </section>

  )

}
