interface ProductJsonLdProps {
  name: string
  description: string
  image: string | string[]
  price: number
  currency?: string
  brand?: string
  availability?: "InStock" | "OutOfStock"
  rating?: number
  reviewCount?: number
  baseUrl?: string
}

function toAbsoluteUrl(path: string, baseUrl: string): string {
  if (path.startsWith("http")) return path
  const base = baseUrl.replace(/\/$/, "")
  const p = path.startsWith("/") ? path : `/${path}`
  return `${base}${p}`
}

export function ProductJsonLd({
  name,
  description,
  image,
  price,
  currency = "NGN",
  brand,
  availability = "InStock",
  rating,
  reviewCount,
  baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.APP_URL || "http://localhost:3000",
}: ProductJsonLdProps) {
  const images = Array.isArray(image) ? image : [image]
  const imageUrls = images
    .filter(Boolean)
    .map((img) => toAbsoluteUrl(img, baseUrl))

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    ...(imageUrls.length > 0 && { image: imageUrls }),
    brand: brand
      ? { "@type": "Brand", name: brand }
      : undefined,
    offers: {
      "@type": "Offer",
      price,
      priceCurrency: currency,
      availability: `https://schema.org/${availability}`,
    },
    ...(rating != null &&
      reviewCount != null &&
      reviewCount > 0 && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: rating,
          reviewCount,
        },
      }),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
