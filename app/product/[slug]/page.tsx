import { notFound } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { ProductGallery } from "@/components/product/product-gallery"
import { ProductInfo } from "@/components/product/product-info"
import { ProductTabs } from "@/components/product/product-tabs"
import { RelatedProducts } from "@/components/product/related-products"
import { getProductBySlug, getProducts } from "@/lib/services/product-service"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return { title: "Product Not Found | Fàdè Essence" }
  }

  const images = Array.isArray(product.images) ? product.images : []
  const firstImage = images[0] || ""

  return {
    title: `${product.name} | ${product.brand || "Fàdè"} | Fàdè Essence`,
    description: product.description || `Shop ${product.name} by ${product.brand || "Fàdè"}. Premium quality ${product.category.toLowerCase()} available at Fàdè Essence.`,
    openGraph: {
      title: `${product.name} | Fàdè Essence`,
      description: product.description || `Shop ${product.name} by ${product.brand || "Fàdè"}`,
      images: firstImage ? [firstImage] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  // Get related products from same category
  const relatedProductsRaw = await getProducts({
    category: product.category,
    limit: 5,
  })
  const relatedProducts = relatedProductsRaw
    .filter((p) => p.id !== product.id)
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
        category: product.category.toLowerCase() as "watches" | "perfumes" | "eyeglasses",
      }
    })

  // Convert database product to component format
  const images = Array.isArray(product.images) 
    ? (product.images as string[]).filter((img): img is string => typeof img === "string")
    : []
  const productDetails = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand || "",
    price: product.priceNGN,
    originalPrice: product.oldPriceNGN || undefined,
    image: images[0] || "",
    rating: product.ratingAvg,
    reviewCount: product.ratingCount,
    tags: [
      product.isNew && "new",
      product.isBestseller && "bestseller",
      product.isLimited && "limited",
    ].filter(Boolean) as ("new" | "bestseller" | "limited")[],
    category: product.category.toLowerCase() as "watches" | "perfumes" | "eyeglasses",
    images: images.length > 0 ? images : [images[0] || ""],
    description: product.description || "Experience the epitome of luxury craftsmanship with this exceptional piece.",
    specifications:
      product.category === "WATCHES"
        ? [
            { label: "Material", value: "Stainless Steel" },
            { label: "Water Resistance", value: "100m" },
            { label: "Warranty", value: "2 Years" },
          ]
        : product.category === "PERFUMES"
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
    inStock: product.stock > 0,
    stockCount: product.stock,
  }

  return (
    <MainLayout cartItemCount={3}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <ProductGallery images={productDetails.images} productName={product.name} />
          <ProductInfo product={productDetails} />
        </div>

        {/* Product Details Tabs */}
        <ProductTabs description={productDetails.description} specifications={productDetails.specifications} />

        {/* Related Products */}
        {relatedProducts.length > 0 && <RelatedProducts products={relatedProducts} />}
      </div>
    </MainLayout>
  )
}
