import { notFound } from "next/navigation"

import { MainLayout } from "@/components/layout/main-layout"

import { CategoryHeader } from "@/components/category/category-header"

import { CategoryFilters } from "@/components/category/category-filters"

import { ProductGrid } from "@/components/ui/product-grid"

import { dummyProducts, categoryData, brands } from "@/lib/dummy-data"



interface CategoryPageProps {

  params: Promise<{ slug: string }>

}



export async function generateMetadata({ params }: CategoryPageProps) {

  const { slug } = await params

  const category = categoryData[slug as keyof typeof categoryData]



  if (!category) {

    return { title: "Category Not Found | Fàdè" }

  }



  return {

    title: `${category.title} | Fàdè`,

    description: category.description,

  }

}



export default async function CategoryPage({ params }: CategoryPageProps) {

  const { slug } = await params

  const category = categoryData[slug as keyof typeof categoryData]



  if (!category) {

    notFound()

  }



  const filteredProducts = dummyProducts.filter((p) => p.category === slug)



  return (

    <MainLayout cartItemCount={3}>

      <CategoryHeader title={category.title} subtitle={category.subtitle} description={category.description} />



      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar Filters (Desktop) */}

          <aside className="hidden lg:block w-64 shrink-0">

            <CategoryFilters brands={brands} />

          </aside>



          {/* Main Content */}

          <div className="flex-1">

            {/* Mobile Filters & Sort */}

            <div className="lg:hidden mb-6">

              <CategoryFilters brands={brands} mobile />

            </div>



            {/* Results Count & Sort (Desktop) */}

            <div className="hidden lg:flex items-center justify-between mb-6">

              <p className="text-sm text-muted-foreground">{filteredProducts.length} products</p>

              <CategoryFilters sortOnly />

            </div>



            {/* Product Grid */}

            {filteredProducts.length > 0 ? (

              <ProductGrid products={filteredProducts} columns={3} />

            ) : (

              <div className="text-center py-16">

                <p className="text-muted-foreground">No products found in this category.</p>

              </div>

            )}

          </div>

        </div>

      </div>

    </MainLayout>

  )

}
