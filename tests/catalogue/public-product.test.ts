import { describe, expect, it } from "vitest"

import {
  PUBLIC_PRODUCT_FILTER,
  publicProductWhere,
} from "@/lib/catalogue/public-product"

describe("public product visibility", () => {
  it("requires products to be both published and not soft-deleted", () => {
    expect(PUBLIC_PRODUCT_FILTER).toEqual({
      deletedAt: null,
      publishStatus: "PUBLISHED",
    })
  })

  it("combines visibility with caller-owned query conditions", () => {
    expect(publicProductWhere({ brand: "Fádé", stock: { gt: 0 } })).toEqual({
      AND: [
        PUBLIC_PRODUCT_FILTER,
        { brand: "Fádé", stock: { gt: 0 } },
      ],
    })
  })
})
