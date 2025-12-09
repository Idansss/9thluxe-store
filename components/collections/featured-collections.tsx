"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Clock, SprayCan, Glasses } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Product } from "@/components/ui/product-card"

interface FeaturedCollectionsProps {
  products: Product[]
}

const collections = [
  {
    id: "watches",
    title: "Timepieces",
    subtitle: "Masterful Craftsmanship",
    description: "Discover precision-engineered watches from legendary Swiss and international manufacturers.",
    icon: Clock,
    href: "/category/watches",
    image: "/luxury-watches-collection-display.jpg",
    count: 3,
    gradient: "from-blue-500/10 to-purple-500/10",
  },
  {
    id: "perfumes",
    title: "Fragrances",
    subtitle: "Signature Scents",
    description: "Indulge in exclusive perfumes crafted by master perfumers for the discerning individual.",
    icon: SprayCan,
    href: "/category/perfumes",
    image: "/luxury-perfume-bottles.png",
    count: 3,
    gradient: "from-amber-500/10 to-rose-500/10",
  },
  {
    id: "eyeglasses",
    title: "Eyewear",
    subtitle: "Vision & Style",
    description: "Premium frames that combine cutting-edge design with uncompromising quality.",
    icon: Glasses,
    href: "/category/eyeglasses",
    image: "/luxury-sunglasses-eyeglasses-display.jpg",
    count: 2,
    gradient: "from-emerald-500/10 to-teal-500/10",
  },
]

export function FeaturedCollections({ products }: FeaturedCollectionsProps) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="flex items-center justify-between mb-8 lg:mb-12">
        <div>
          <h2 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight mb-2">
            Featured Collections
          </h2>
          <p className="text-muted-foreground">Explore our curated selections</p>
        </div>
        <Button variant="ghost" className="hidden lg:flex" asChild>
          <Link href="/shop">
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {collections.map((collection) => {
          const collectionProducts = products.filter((p) => p.category === collection.id)
          const featuredProduct = collectionProducts[0]

          return (
            <Card
              key={collection.id}
              className={cn(
                "group overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg",
                `bg-gradient-to-br ${collection.gradient}`,
              )}
            >
              <Link href={collection.href}>
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={collection.image || "/placeholder.svg"}
                    alt={collection.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/90 backdrop-blur-sm text-sm font-medium">
                      <collection.icon className="h-4 w-4" />
                      <span>{collection.count} items</span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-6 space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">
                      {collection.subtitle}
                    </p>
                    <h3 className="font-serif text-2xl font-semibold mb-2">{collection.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{collection.description}</p>
                  </div>
                  <Button variant="ghost" className="w-full group-hover:bg-primary group-hover:text-primary-foreground">
                    Explore Collection
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Link>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

