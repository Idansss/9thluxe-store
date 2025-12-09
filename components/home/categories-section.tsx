import { CategoryCard } from "@/components/ui/category-card"

import { SectionHeader } from "@/components/ui/section-header"

import { categoryData } from "@/lib/dummy-data"



export function CategoriesSection() {

  return (

    <section className="py-16 lg:py-24">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <SectionHeader

          title="Shop by Category"

          subtitle="Explore our curated selection of luxury accessories"

          align="center"

        />



        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <CategoryCard

            title={categoryData.watches.title}

            subtitle={categoryData.watches.subtitle}

            image={categoryData.watches.image}

            href="/category/watches"

          />

          <CategoryCard

            title={categoryData.perfumes.title}

            subtitle={categoryData.perfumes.subtitle}

            image={categoryData.perfumes.image}

            href="/category/perfumes"

          />

          <CategoryCard

            title={categoryData.eyeglasses.title}

            subtitle={categoryData.eyeglasses.subtitle}

            image={categoryData.eyeglasses.image}

            href="/category/eyeglasses"

          />

        </div>

      </div>

    </section>

  )

}
