import { readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

describe("route loading system", () => {
  it("route loading.tsx files use the premium RouteLoading mark", () => {
    const root = process.cwd()
    const loaders = [
      "app/loading.tsx",
      "app/shop/loading.tsx",
      "app/cart/loading.tsx",
      "app/checkout/loading.tsx",
      "app/product/[slug]/loading.tsx",
      "app/collections/loading.tsx",
      "app/account/loading.tsx",
      "components/shop/shop-page-loading.tsx",
    ]

    for (const file of loaders) {
      const source = readFileSync(path.join(root, file), "utf8")
      expect(source, file).toMatch(/RouteLoading/)
      expect(source, file).not.toMatch(/ProductCardSkeleton|ProductGridSkeleton|Flacon|pedestal-light/)
    }
  })

  it("product card skeleton no longer uses bottle silhouettes", () => {
    const source = readFileSync(
      path.join(process.cwd(), "components/ui/product-card-skeleton.tsx"),
      "utf8",
    )
    expect(source).not.toMatch(/Flacon|pedestal-light|skeleton-shimmer/)
  })

  it("keeps navigation progress and route loading modules", () => {
    const progress = readFileSync(
      path.join(process.cwd(), "components/loading/navigation-progress.tsx"),
      "utf8",
    )
    const route = readFileSync(
      path.join(process.cwd(), "components/loading/route-loading.tsx"),
      "utf8",
    )
    expect(progress).toMatch(/data-navigation-progress/)
    expect(route).toMatch(/LogoMark/)
    expect(route).toMatch(/sr-only/)
  })
})
