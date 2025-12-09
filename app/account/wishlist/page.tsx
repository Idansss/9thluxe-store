import { Card, CardContent } from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import { Heart } from "lucide-react"

import Link from "next/link"

import { ProductGrid } from "@/components/ui/product-grid"

import { dummyProducts } from "@/lib/dummy-data"



const wishlistItems = dummyProducts.slice(0, 4)



export default function WishlistPage() {

  if (wishlistItems.length === 0) {

    return (

      <Card>

        <CardContent className="py-16 text-center">

          <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />

          <h2 className="text-lg font-semibold mb-2">Your wishlist is empty</h2>

          <p className="text-muted-foreground mb-4">Save items you love to your wishlist for later.</p>

          <Button asChild>

            <Link href="/">Explore Products</Link>

          </Button>

        </CardContent>

      </Card>

    )

  }



  return (

    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <h2 className="text-lg font-semibold">My Wishlist</h2>

        <p className="text-sm text-muted-foreground">{wishlistItems.length} items</p>

      </div>

      <ProductGrid products={wishlistItems} columns={3} />

    </div>

  )

}
