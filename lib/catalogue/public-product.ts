import type { Prisma } from "@prisma/client"

/**
 * The minimum visibility boundary for every customer-facing product query.
 *
 * Keep this separate from availability: published products may remain visible
 * while out of stock, but drafts, archived products, and soft-deleted products
 * must never appear on public surfaces or enter a transactional cart.
 */
export const PUBLIC_PRODUCT_FILTER = {
  deletedAt: null,
  publishStatus: "PUBLISHED",
} satisfies Prisma.ProductWhereInput

export function publicProductWhere(
  conditions: Prisma.ProductWhereInput = {},
): Prisma.ProductWhereInput {
  return {
    AND: [PUBLIC_PRODUCT_FILTER, conditions],
  }
}
