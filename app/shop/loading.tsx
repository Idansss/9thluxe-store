import { ProductCardSkeleton } from "@/components/ui/product-card-skeleton"

export default function ShopLoading() {
  return (
    <section className="py-16">
      <div className="container mx-auto max-w-[1200px] px-6 space-y-10">
        <header className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-10 w-64 animate-pulse rounded bg-muted" />
          <div className="h-5 w-96 max-w-full animate-pulse rounded bg-muted" />
        </header>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
