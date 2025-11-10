import { ProductGrid } from "@/components/product-grid"

const wishlistProducts = [
  {
    id: "4",
    name: "Royal Oak Automatic",
    brand: "Audemars Piguet",
    price: 1200000,
    image: "/luxury-silver-watch-with-octagonal-bezel.jpg",
    category: "watches",
  },
  {
    id: "5",
    name: "Bleu de Chanel",
    brand: "Chanel",
    price: 95000,
    image: "/blue-perfume-bottle-elegant-minimal.jpg",
    category: "perfumes",
  },
]

export default function WishlistPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">My Wishlist</h2>
      <ProductGrid products={wishlistProducts} />
    </div>
  )
}
