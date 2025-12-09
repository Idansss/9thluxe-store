import { notFound, redirect } from "next/navigation"
import { ProductCategory } from "@prisma/client"

import { ProductForm, type ProductFormInitialValues } from "@/components/admin/product-form"
import { getCollectionsWithCounts } from "@/lib/services/collection-service"
import { getAdminProductById, parseProductFormData, updateProduct, getUniqueBrands } from "@/lib/services/product-service"

export const dynamic = "force-dynamic"

const categoryOptions = [
  { label: "Watches", value: ProductCategory.WATCHES },
  { label: "Perfumes", value: ProductCategory.PERFUMES },
  { label: "Eyeglasses", value: ProductCategory.GLASSES },
]

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  
  const [product, collections, brands] = await Promise.all([
    getAdminProductById(id),
    getCollectionsWithCounts(),
    getUniqueBrands(),
  ])

  if (!product) {
    notFound()
  }

  const images = Array.isArray(product.images) ? (product.images as string[]) : []

  const initialValues: ProductFormInitialValues = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    brand: product.brand,
    category: product.category,
    priceNGN: product.priceNGN,
    oldPriceNGN: product.oldPriceNGN ?? undefined,
    currency: product.currency,
    stock: product.stock,
    ratingAvg: product.ratingAvg,
    ratingCount: product.ratingCount,
    isFeatured: product.isFeatured,
    isBestseller: product.isBestseller,
    isNew: product.isNew,
    isLimited: product.isLimited,
    images,
    collectionId: product.collectionId,
  }

  async function handleUpdate(formData: FormData) {
    "use server"

    const { id: productId } = await params
    const input = parseProductFormData(formData)
    await updateProduct(productId, input)

    redirect("/admin/products?success=updated")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold tracking-tight">Edit product</h1>
          <p className="text-muted-foreground">Update product details for the Fàdè storefront.</p>
        </div>
      </div>

      <ProductForm
        initialValues={initialValues}
        action={handleUpdate}
        categories={categoryOptions}
        collections={collections}
        brands={brands}
        submitLabel="Save changes"
      />
    </div>
  )
}
