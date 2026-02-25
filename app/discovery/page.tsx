import Link from "next/link"
import { MainLayout } from "@/components/layout/main-layout"
import { ProductGrid } from "@/components/ui/product-grid"
import { Button } from "@/components/ui/button"
import { prisma } from "@/lib/prisma"
import { mapPrismaProductToCard } from "@/lib/queries/products"

export const dynamic = "force-dynamic"

export default async function DiscoveryPage() {
  const [sampleKitProducts, byNotes] = await Promise.all([
    prisma.product.findMany({
      where: { deletedAt: null, isFeatured: true },
      orderBy: [{ ratingAvg: "desc" }],
      take: 6,
    }),
    prisma.product.findMany({
      where: {
        deletedAt: null,
        OR: [
          { notesTop: { contains: "bergamot", mode: "insensitive" } },
          { notesHeart: { contains: "rose", mode: "insensitive" } },
          { notesBase: { contains: "sandalwood", mode: "insensitive" } },
        ],
      },
      orderBy: [{ ratingAvg: "desc" }],
      take: 6,
    }),
  ])

  const sampleKits = sampleKitProducts.map(mapPrismaProductToCard)
  const curatedByNotes = byNotes.map(mapPrismaProductToCard)

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-semibold text-foreground">Discovery & sample kits</h1>
          <p className="mt-2 text-muted-foreground">
            Try before you commit. Curated sets and note-based picks.
          </p>
        </header>

        <section className="mb-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">Featured discovery set</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/shop">View all</Link>
            </Button>
          </div>
          {sampleKits.length > 0 ? (
            <ProductGrid products={sampleKits} columns={3} />
          ) : (
            <p className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center text-muted-foreground">
              Discovery sets are being curated. Check back soon.
            </p>
          )}
        </section>

        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">By your favourite notes</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/shop?note=rose">Rose & more</Link>
            </Button>
          </div>
          {curatedByNotes.length > 0 ? (
            <ProductGrid products={curatedByNotes} columns={3} />
          ) : (
            <p className="rounded-xl border border-dashed border-border bg-muted/30 p-8 text-center text-muted-foreground">
              Use the <Link href="/find-your-fragrance" className="underline">fragrance finder</Link> to get personalised picks.
            </p>
          )}
        </section>

        <div className="mt-12 flex justify-center">
          <Button asChild>
            <Link href="/find-your-fragrance">Find your fragrance</Link>
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}
