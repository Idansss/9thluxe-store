"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const brands = [
  { name: "Rolex", slug: "rolex", description: "Swiss Excellence", featured: true },
  { name: "Cartier", slug: "cartier", description: "French Luxury", featured: true },
  { name: "Omega", slug: "omega", description: "Precision Time", featured: true },
  { name: "Tom Ford", slug: "tom-ford", description: "Modern Elegance", featured: false },
  { name: "Creed", slug: "creed", description: "Royal Fragrances", featured: false },
  { name: "Dior", slug: "dior", description: "Parisian Chic", featured: false },
  { name: "Gucci", slug: "gucci", description: "Italian Style", featured: false },
  { name: "Ray-Ban", slug: "ray-ban", description: "Iconic Eyewear", featured: false },
]

export function BrandShowcase() {
  const featuredBrands = brands.filter((b) => b.featured)
  const otherBrands = brands.filter((b) => !b.featured)

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="flex items-center justify-between mb-8 lg:mb-12">
        <div>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight mb-2">
            Our Premium Brands
          </h2>
          <p className="text-muted-foreground">Discover luxury from the world's most prestigious brands</p>
        </div>
        <Button variant="ghost" className="hidden lg:flex" asChild>
          <Link href="/brands">
            View All Brands
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Featured Brands */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {featuredBrands.map((brand) => (
          <Card
            key={brand.slug}
            className="group overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg"
          >
            <Link href={`/collections/${brand.slug}`}>
              <CardContent className="p-8 text-center space-y-4">
                <div className="relative h-20 w-full mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-serif text-3xl font-semibold opacity-20 group-hover:opacity-30 transition-opacity">
                      {brand.name}
                    </span>
                  </div>
                </div>
                <h3 className="font-serif text-2xl font-semibold">{brand.name}</h3>
                <p className="text-sm text-muted-foreground">{brand.description}</p>
                <Button variant="ghost" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground">
                  Explore
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {/* Other Brands Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {otherBrands.map((brand) => (
          <Card
            key={brand.slug}
            className="group overflow-hidden border hover:border-primary/50 transition-all duration-300 hover:shadow-md"
          >
            <Link href={`/collections/${brand.slug}`}>
              <CardContent className="p-6 text-center space-y-2">
                <h4 className="font-medium text-sm group-hover:text-primary transition-colors">{brand.name}</h4>
                <p className="text-xs text-muted-foreground">{brand.description}</p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  )
}

