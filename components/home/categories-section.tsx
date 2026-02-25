import { CategoryCard } from "@/components/ui/category-card"

import { SectionHeader } from "@/components/ui/section-header"

import { categoryData } from "@/lib/category-data"



export function CategoriesSection() {

  return (

    <section className="py-16 lg:py-24">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeader

          title="Shop by Category"

          subtitle="Explore our curated selection of luxury perfumes"

          align="center"

        />



        <div className="grid grid-cols-1 md:grid-cols-1 max-w-md mx-auto gap-6">
          <CategoryCard
            title={categoryData.perfumes.title}
            subtitle={categoryData.perfumes.subtitle}
            image={categoryData.perfumes.image}
            href="/category/perfumes"
          />
        </div>

      </div>

    </section>

  )

}
