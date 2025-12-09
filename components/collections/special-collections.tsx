"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Flame, Sparkles, Crown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ProductGrid } from "@/components/ui/product-grid"
import type { Product } from "@/components/ui/product-card"

interface SpecialCollectionsProps {
  featured: Product[]
  newArrivals: Product[]
  limited: Product[]
}

const specialSections = [
  {
    id: "featured",
    title: "Bestsellers",
    subtitle: "Most Loved",
    description: "Our most popular items, loved by thousands of customers",
    icon: Flame,
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
  },
  {
    id: "new",
    title: "New Arrivals",
    subtitle: "Just In",
    description: "Fresh additions to our collection, discover what's new",
    icon: Sparkles,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
  },
  {
    id: "limited",
    title: "Limited Edition",
    subtitle: "Exclusive",
    description: "Rare and exclusive pieces, available for a limited time only",
    icon: Crown,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "bg-amber-50 dark:bg-amber-950/20",
  },
]

export function SpecialCollections({ featured, newArrivals, limited }: SpecialCollectionsProps) {
  const sections = [
    { ...specialSections[0], products: featured },
    { ...specialSections[1], products: newArrivals },
    { ...specialSections[2], products: limited },
  ]

  return (
    <div className="bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
        {sections.map((section) => {
          if (section.products.length === 0) return null

          return (
            <div key={section.id} className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${section.bgColor}`}>
                    <section.icon className={`h-6 w-6 ${section.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                      {section.subtitle}
                    </p>
                    <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight">
                      {section.title}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
                  </div>
                </div>
                <Button variant="ghost" className="hidden lg:flex" asChild>
                  <Link href={`/collections/${section.id}`}>
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>

              <ProductGrid products={section.products} columns={4} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

