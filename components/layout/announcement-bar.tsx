"use client"

import Link from "next/link"

export function AnnouncementBar() {
  return (
    <div
      className="w-full border-b border-border bg-muted/50 text-center text-xs font-medium text-muted-foreground"
      role="complementary"
      aria-label="Promotion"
    >
      <div className="container mx-auto px-4 py-2">
        <Link
          href="/shop"
          className="hover:text-foreground transition-colors underline underline-offset-2"
        >
          Free shipping on orders over ₦500,000
        </Link>
      </div>
    </div>
  )
}
