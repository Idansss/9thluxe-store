"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function CollectionsHero() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = React.useState("")

  const runSearch = () => {
    const q = searchQuery.trim()
    if (q) {
      router.push(`/shop?q=${encodeURIComponent(q)}`)
    } else {
      router.push("/shop")
    }
  }

  return (
    <div className="relative bg-gradient-to-br from-background via-background to-muted/30 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Heading */}
          <div className="space-y-4">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight">
              Discover Our
              <br />
              <span className="text-accent">Exquisite Collections</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore handpicked selections of the world's finest luxury goods. Each piece tells a story of
              craftsmanship, elegance, and timeless sophistication.
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search collections, brands, or products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), runSearch())}
                className="h-14 pl-12 pr-32 text-base rounded-xl border-2 focus:border-primary"
              />
              <Button
                type="button"
                size="lg"
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 px-6"
                onClick={runSearch}
              >
                Search
              </Button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <span className="text-sm text-muted-foreground">Quick filters:</span>
            {["Bestsellers", "New Arrivals", "Limited Edition", "Under ₦1M", "Premium"].map((filter) => (
              <Button
                key={filter}
                variant="outline"
                size="sm"
                className="bg-transparent hover:bg-accent/10 hover:border-accent"
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

