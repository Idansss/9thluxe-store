import type { Metadata } from "next"
import Link from "next/link"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { SprayCan, Truck, Award, Heart } from "lucide-react"

export const metadata: Metadata = {
  title: "About Fàdè",
  description:
    "Fàdè is a fashion and beauty brand specializing in luxury perfumes. High-quality, trendy, and luxurious fragrances for everyday elegance.",
}

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 lg:mb-16">
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-4">
              About Fàdè
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Curating luxury fragrances for the discerning individual
            </p>
          </div>

          {/* Main Content */}
          <div className="space-y-8 lg:space-y-12">
            {/* Brand Story */}
            <Card>
              <CardContent className="pt-6">
                <p className="text-lg leading-relaxed text-foreground mb-6">
                  <strong className="font-semibold">Fàdè</strong> is a fashion and beauty brand that specializes in{" "}
                  <strong className="font-semibold">luxury perfumes</strong>. We focus on providing
                  customers with high-quality, trendy, and luxurious fragrances that enhance personal style and everyday elegance.
                </p>
              </CardContent>
            </Card>

            {/* Product Categories */}
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-semibold tracking-tight mb-6 text-center">
                Our Collection
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-1 max-w-md mx-auto gap-6">
                <Card className="group hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <div className="rounded-full bg-primary/10 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <SprayCan className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Premium Perfumes</h3>
                    <p className="text-sm text-muted-foreground">
                      Crafted for long-lasting presence and unforgettable moments
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Delivery & Service */}
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-full bg-primary/20 p-3 shrink-0">
                    <Truck className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">Nationwide Delivery</h3>
                    <p className="text-muted-foreground mb-4">
                      We deliver across all 36 states and the FCT. Your luxury fragrances are just a click away, no matter where you are in Nigeria.
                    </p>
                    <Button variant="outline" asChild>
                      <Link href="/help/shipping">Learn More About Shipping</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Values */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-3 shrink-0">
                      <Award className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Quality First</h3>
                      <p className="text-sm text-muted-foreground">
                        We curate only the finest luxury perfumes from trusted brands, ensuring every fragrance meets our high standards of excellence.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-full bg-primary/10 p-3 shrink-0">
                      <Heart className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Customer Focused</h3>
                      <p className="text-sm text-muted-foreground">
                        Your satisfaction is our priority. We're committed to providing exceptional service and a seamless shopping experience.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CTA */}
            <div className="text-center pt-8">
              <Button size="lg" asChild>
                <Link href="/collections">Explore Our Collections</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
