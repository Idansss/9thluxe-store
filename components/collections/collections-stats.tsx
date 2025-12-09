import { Package, Star, Users, Award } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    icon: Package,
    value: "500+",
    label: "Premium Products",
    description: "Curated from world's finest brands",
  },
  {
    icon: Star,
    value: "4.9",
    label: "Average Rating",
    description: "From 10,000+ verified reviews",
  },
  {
    icon: Users,
    value: "50K+",
    label: "Happy Customers",
    description: "Trusted by luxury enthusiasts",
  },
  {
    icon: Award,
    value: "25+",
    label: "Premium Brands",
    description: "Exclusive partnerships",
  },
]

export function CollectionsStats() {
  return (
    <div className="border-b border-border bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 bg-transparent shadow-none">
              <CardContent className="pt-6 text-center space-y-2">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary mb-2">
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="text-3xl lg:text-4xl font-serif font-semibold">{stat.value}</div>
                <div className="text-sm font-medium">{stat.label}</div>
                <div className="text-xs text-muted-foreground">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

