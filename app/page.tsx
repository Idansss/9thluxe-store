import { MainLayout } from "@/components/layout/main-layout"

import { HeroSection } from "@/components/home/hero/hero-section"

import { HeroOrbitSection } from "@/components/home/hero/orbit/hero-orbit-section"

import { FeaturedProductsSection } from "@/components/home/featured-products-section"

import { FragranceFamilies } from "@/components/home/fragrance-families"

import { BrandStorySection } from "@/components/home/brand-story-section"

import { ConciergeInvitation } from "@/components/home/concierge-invitation"

import { prisma } from "@/lib/prisma"
import { selectHeroFeaturedProduct } from "@/lib/hero/select"
import { selectHeroOrbit } from "@/lib/hero/orbit"
import { isFeatureEnabled } from "@/lib/config/feature-flags"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  // Stage 2 orbital showcase: only behind the hero_orbit flag AND with >=2 approved slides.
  // Anything less falls straight back to the approved Stage 1 hero below.
  const orbitData = isFeatureEnabled("hero_orbit") ? await selectHeroOrbit() : null

  // Merchant-approved hero fragrance (published + featured + owned image), or null for the neutral
  // placeholder. Never fabricates a bottle or perfume information.
  const heroData = orbitData ? null : await selectHeroFeaturedProduct()

  // Fetch featured products from database (best-effort; allow the page to render even if DB isn't ready).
  let dbProducts: Awaited<ReturnType<typeof prisma.product.findMany>> = []
  try {
    dbProducts = await prisma.product.findMany({
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

    // No flagged products yet, fall back to the latest additions so the
    // homepage edit never renders empty.
    if (dbProducts.length === 0) {
      dbProducts = await prisma.product.findMany({
        where: { deletedAt: null },
        orderBy: [{ ratingAvg: "desc" }, { createdAt: "desc" }],
        take: 8,
      })
    }
  } catch (err) {
    console.error("HomePage: failed to load featured products", err)
    dbProducts = []
  }

  // Transform database products to match ProductCard format
  const featuredProducts = dbProducts.map((product) => {
    const images = Array.isArray(product.images) ? (product.images as string[]) : []
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      brand: product.brand || "",
      price: product.priceNGN,
      originalPrice: product.oldPriceNGN || undefined,
      image: images[0] || "/placeholder-flacon.svg",
      images: images,
      category: "perfumes" as const,
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

    <MainLayout>

      {orbitData ? <HeroOrbitSection orbit={orbitData} /> : <HeroSection heroData={heroData} />}

      <FeaturedProductsSection products={featuredProducts} />

      <FragranceFamilies />

      <BrandStorySection />

      <ConciergeInvitation />

    </MainLayout>

  )

}
