import { notFound } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { ProductGallery } from "@/components/product/product-gallery"
import { ProductInfo } from "@/components/product/product-info"
import { ProductTabs } from "@/components/product/product-tabs"
import { RelatedProducts } from "@/components/product/related-products"
import { getProductBySlug, getProducts } from "@/lib/services/product-service"
import { dummyProducts } from "@/lib/dummy-data"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const dbProduct = await getProductBySlug(slug)
  const fallback = dummyProducts.find((p) => p.slug === slug)

  if (!dbProduct && !fallback) {
    return { title: "Product Not Found | Faded Essence" }
  }

  const name = dbProduct?.name || fallback!.name
  const brand = dbProduct?.brand || fallback!.brand || "Faded"
  const description = dbProduct?.description || `Shop ${name} by ${brand}.`
  const images = dbProduct
    ? (Array.isArray(dbProduct.images) ? dbProduct.images : [])
    : [fallback!.image]
  const firstImage = images[0] || ""

  return {
    title: `${name} | ${brand} | Faded Essence`,
    description,
    openGraph: {
      title: `${name} | Faded Essence`,
      description,
      images: firstImage ? [firstImage] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  const fallback = dummyProducts.find((p) => p.slug === slug)

  if (!product && !fallback) {
    notFound()
  }

  const isFallback = !product && !!fallback
  const category = isFallback
    ? (fallback!.category === "eyeglasses" ? "GLASSES" : fallback!.category.toUpperCase())
    : product!.category

  const relatedProducts = isFallback
    ? dummyProducts
        .filter((p) => p.slug !== slug && p.category === fallback!.category)
        .slice(0, 4)
        .map((p) => ({
          id: p.id,
          slug: p.slug,
          name: p.name,
          brand: p.brand || "",
          price: p.price,
          originalPrice: p.originalPrice,
          image: p.image,
          rating: p.rating,
          reviewCount: p.reviewCount,
          tags: p.tags || [],
          category: p.category,
        }))
    : (await getProducts({ category: product!.category, limit: 5 }))
        .filter((p) => p.id !== product!.id)
        .slice(0, 4)
        .map((p) => {
          const images = Array.isArray(p.images)
            ? (p.images as string[]).filter((img): img is string => typeof img === "string")
            : []

          return {
            id: p.id,
            slug: p.slug,
            name: p.name,
            brand: p.brand || "",
            price: p.priceNGN,
            originalPrice: p.oldPriceNGN || undefined,
            image: images[0] || "",
            rating: p.ratingAvg,
            reviewCount: p.ratingCount,
            tags: [
              p.isNew && "new",
              p.isBestseller && "bestseller",
              p.isLimited && "limited",
            ].filter(Boolean) as ("new" | "bestseller" | "limited")[],
            category: product!.category.toLowerCase() as "watches" | "perfumes" | "eyeglasses",
          }
        })

  const images = isFallback
    ? [fallback!.image]
    : Array.isArray(product!.images)
      ? (product!.images as string[]).filter((img): img is string => typeof img === "string")
      : []

  const productDetails = {
    id: product?.id || fallback!.id,
    slug: product?.slug || fallback!.slug,
    name: product?.name || fallback!.name,
    brand: product?.brand || fallback!.brand || "",
    price: product?.priceNGN || fallback!.price,
    originalPrice: product?.oldPriceNGN || fallback?.originalPrice,
    image: images[0] || "",
    rating: product?.ratingAvg ?? fallback!.rating,
    reviewCount: product?.ratingCount ?? fallback!.reviewCount,
    tags: product
      ? ([
          product.isNew && "new",
          product.isBestseller && "bestseller",
          product.isLimited && "limited",
        ].filter(Boolean) as ("new" | "bestseller" | "limited")[])
      : fallback!.tags || [],
    category: (product ? product.category.toLowerCase() : fallback!.category) as
      | "watches"
      | "perfumes"
      | "eyeglasses",
    images: images.length > 0 ? images : ["/placeholder.svg"],
    description:
      product?.description ||
      "Experience the epitome of luxury craftsmanship with this exceptional piece.",
    specifications:
      category === "WATCHES"
        ? [
            { label: "Material", value: "Stainless Steel" },
            { label: "Water Resistance", value: "100m" },
            { label: "Warranty", value: "2 Years" },
          ]
        : category === "PERFUMES"
          ? [
              { label: "Top Notes", value: "Bergamot, Pink Pepper" },
              { label: "Heart Notes", value: "Rose, Oud Wood" },
              { label: "Base Notes", value: "Amber, Sandalwood" },
              { label: "Longevity", value: "8-10 Hours" },
            ]
          : [
              { label: "Material", value: "Acetate" },
              { label: "Lens Type", value: "Polarized" },
              { label: "Warranty", value: "2 Years" },
            ],
    inStock: product ? product.stock > 0 : true,
    stockCount: product?.stock ?? 10,
  }

  return (
    <MainLayout cartItemCount={3}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <ProductGallery images={productDetails.images} productName={productDetails.name} />
          <ProductInfo product={productDetails} />
        </div>

        <ProductTabs description={productDetails.description} specifications={productDetails.specifications} />

        {relatedProducts.length > 0 && <RelatedProducts products={relatedProducts} />}
      </div>
    </MainLayout>
  )
}
