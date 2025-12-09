/**
 * Maps brand slugs to brand names used in product data.
 * This ensures we can convert URL-friendly slugs to the exact brand names
 * stored in the product data.
 */
export const brandSlugMap: Record<string, string> = {
  "rolex": "Rolex",
  "cartier": "Cartier",
  "omega": "Omega",
  "tom-ford": "Tom Ford",
  "creed": "Creed",
  "dior": "Dior",
  "gucci": "Gucci",
  "ray-ban": "Ray-Ban",
  "patek-philippe": "Patek Philippe",
  "chanel": "Chanel",
  "prada": "Prada",
}

/**
 * Gets the brand name from a slug.
 * Returns undefined if the slug doesn't match any known brand.
 */
export function getBrandNameFromSlug(slug: string): string | undefined {
  return brandSlugMap[slug.toLowerCase()]
}

/**
 * Gets all valid brand slugs.
 */
export function getAllBrandSlugs(): string[] {
  return Object.keys(brandSlugMap)
}

