export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="relative aspect-square bg-muted animate-pulse" />
      <div className="space-y-3 p-4">
        <div className="h-3 w-16 rounded-full bg-muted animate-pulse" />
        <div className="h-4 w-full rounded-full bg-muted animate-pulse" />
        <div className="h-5 w-24 rounded-full bg-muted animate-pulse" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  )
}
