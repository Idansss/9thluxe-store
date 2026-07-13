import { LocalLoading } from "@/components/loading/route-loading"
import { cn } from "@/lib/utils"

interface ProductCardSkeletonProps {
  className?: string
}

/** Minimal local placeholder: no fake bottle, title, or price. */
export function ProductCardSkeleton({ className }: ProductCardSkeletonProps) {
  return (
    <div className={cn("flex flex-col", className)} aria-hidden>
      <div className="aspect-[4/5] bg-muted/35" />
      <div className="mt-3.5 h-px w-16 bg-border/50" />
    </div>
  )
}

export function ProductGridSkeleton({ count = 3 }: { count?: number }) {
  if (count > 4) {
    return <LocalLoading label="Curating the collection" />
  }

  return (
    <div
      className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12 lg:grid-cols-3"
      aria-busy="true"
      aria-label="Loading products"
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
