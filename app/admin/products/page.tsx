import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'
import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/format'
import { Plus, Edit } from 'lucide-react'
import { DeleteButton } from './delete-button'

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  await requireAdmin()

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      slug: true,
      priceNGN: true,
      category: true,
      stock: true,
      brand: true,
      images: true,
      createdAt: true,
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">Products</h2>
        <Link href="/admin/products/new" className="btn inline-flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground mb-4">No products yet</p>
          <Link href="/admin/products/new" className="btn inline-flex">
            Add Your First Product
          </Link>
        </div>
      ) : (
        <div className="rounded-3xl border border-border bg-card p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Price</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Stock</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.map((product) => {
                  const images = Array.isArray(product.images) ? (product.images as string[]) : []
                  const coverImage = images[0] || '/placeholder.png'

                  return (
                    <tr key={product.id} className="hover:bg-muted/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-muted">
                            <Image src={coverImage} alt={product.name} fill className="object-cover" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">{product.name}</div>
                            {product.brand && <div className="text-xs text-muted-foreground">{product.brand}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground capitalize">{product.category.toLowerCase()}</td>
                      <td className="px-4 py-3 text-sm font-medium text-foreground">{formatPrice(product.priceNGN)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-sm ${product.stock && product.stock < 5 ? 'text-orange-600 font-medium' : 'text-muted-foreground'}`}>
                          {product.stock || 0}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                          <DeleteButton productId={product.id} productName={product.name} />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

