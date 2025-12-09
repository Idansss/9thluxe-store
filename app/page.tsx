import { MainLayout } from "@/components/layout/main-layout"

import { HeroSection } from "@/components/home/hero-section"

import { CategoriesSection } from "@/components/home/categories-section"

import { FeaturedProductsSection } from "@/components/home/featured-products-section"

import { BrandStorySection } from "@/components/home/brand-story-section"

import { NewsletterSection } from "@/components/home/newsletter-section"

import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  // Fetch featured products from database
  const dbProducts = await prisma.product.findMany({
    where: {
      deletedAt: null, // Exclude soft-deleted products
      OR: [
        { isBestseller: true },
        { isNew: true },
        { isLimited: true },
        { isFeatured: true },
      ],
    },
    orderBy: [
      { isFeatured: "desc" },
      { isBestseller: "desc" },
      { ratingAvg: "desc" },
      { createdAt: "desc" },
    ],
    take: 8,
  })

  // Transform database products to match ProductCard format
  const featuredProducts = dbProducts.map((product) => {
    const images = Array.isArray(product.images) ? (product.images as string[]) : []
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      brand: product.brand || "",
      price: product.priceNGN,
      oldPrice: product.oldPriceNGN || undefined,
      image: images[0] || "/placeholder.svg",
      images: images,
      category: product.category.toLowerCase() as "watches" | "perfumes" | "eyeglasses",
      rating: product.ratingAvg,
      reviewCount: product.ratingCount,
      tags: [
        product.isBestseller && "bestseller",
        product.isNew && "new",
        product.isLimited && "limited",
      ].filter(Boolean) as ("new" | "bestseller" | "limited")[],
    }
  })

  return (

    <MainLayout cartItemCount={3}>

      <HeroSection />

      <CategoriesSection />

      <FeaturedProductsSection products={featuredProducts} />

      <BrandStorySection />

      <NewsletterSection />

    </MainLayout>

  )

}
