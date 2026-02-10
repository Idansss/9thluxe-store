import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] })

function resolveSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.APP_URL ||
    "http://localhost:3000"

  try {
    return new URL(raw)
  } catch {
    try {
      return new URL(`https://${raw}`)
    } catch {
      return new URL("http://localhost:3000")
    }
  }
}

const siteUrl = resolveSiteUrl()

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Fàdè Essence | Luxury Watches, Perfumes & Eyeglasses",
    template: "%s | Fàdè Essence",
  },
  description: "Discover premium luxury watches, exquisite perfumes, and designer eyeglasses at Fàdè Essence. Curated collection of timeless elegance and sophistication.",
  keywords: ["luxury watches", "perfumes", "eyeglasses", "Fàdè", "premium fashion", "Nigeria"],
  authors: [{ name: "Fàdè Essence" }],
  creator: "Fàdè Essence",
  publisher: "Fàdè Essence",
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: siteUrl.toString(),
    siteName: "Fàdè Essence",
    title: "Fàdè Essence | Luxury Watches, Perfumes & Eyeglasses",
    description: "Discover premium luxury watches, exquisite perfumes, and designer eyeglasses at Fàdè Essence.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Fàdè Essence",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fàdè Essence | Luxury Watches, Perfumes & Eyeglasses",
    description: "Discover premium luxury watches, exquisite perfumes, and designer eyeglasses at Fàdè Essence.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification codes here when available
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster position="top-center" />
        <Analytics />
      </body>
    </html>
  )
}
