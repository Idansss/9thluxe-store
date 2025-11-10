import Link from 'next/link'
import { ProductCard } from '@/components/ProductCard'
import { prisma } from '@/lib/prisma'
import { NewsletterSignup } from '@/components/NewsletterSignup'
import { TrustBadges } from '@/components/TrustBadges'

async function getHomepageData() {
  const [freshDrops, watches, perfumes, glasses] = await Promise.all([
    prisma.product.findMany({ orderBy: { createdAt: 'desc' }, take: 6 }),
    prisma.product.findMany({ where: { category: 'WATCHES' }, orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.product.findMany({ where: { category: 'PERFUMES' }, orderBy: { createdAt: 'desc' }, take: 3 }),
    prisma.product.findMany({ where: { category: 'GLASSES' }, orderBy: { createdAt: 'desc' }, take: 3 }),
  ])
  
  return { freshDrops, watches, perfumes, glasses }
}

export default async function HomePage() {
  const { freshDrops, watches, perfumes, glasses } = await getHomepageData()

  return (
    <>
      {/* Hero Section */}
      <section className="border-b border-border bg-background py-16">
        <div className="container mx-auto max-w-[1200px] px-6 text-center">
          <h1 className="mb-4 text-4xl font-semibold tracking-tight sm:text-5xl">Modern Luxury</h1>
          <p className="mx-auto max-w-2xl text-base text-muted-foreground">
            Discover premium watches, perfumes, and eyeglasses. Nigeria-wide delivery to all 36 states and the FCT.
          </p>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="border-b border-border bg-muted/30 py-12">
        <div className="container mx-auto max-w-[1200px] px-6">
          <TrustBadges />
        </div>
      </section>

      {/* Fresh Drops */}
      <section className="py-16">
        <div className="container mx-auto max-w-[1200px] px-6">
          <h2 className="mb-8 text-2xl font-semibold">Fresh drops</h2>
          {freshDrops.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
              <h3 className="text-lg font-semibold">No products yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">Check back soon - our team adds new pieces regularly.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {freshDrops.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Watches Section */}
      {watches.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto max-w-[1200px] px-6">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Watches</h2>
              <Link href="/category/watches" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                View all →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {watches.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Perfumes Section */}
      {perfumes.length > 0 && (
        <section className="border-t border-border bg-muted/30 py-16">
          <div className="container mx-auto max-w-[1200px] px-6">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Perfumes</h2>
              <Link href="/category/perfumes" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                View all →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {perfumes.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Glasses Section */}
      {glasses.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto max-w-[1200px] px-6">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Eye Glasses</h2>
              <Link href="/category/glasses" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                View all →
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {glasses.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="border-t border-border bg-muted/30 py-16">
        <div className="container mx-auto max-w-[1200px] px-6">
          <NewsletterSignup />
        </div>
      </section>
    </>
  )
}

