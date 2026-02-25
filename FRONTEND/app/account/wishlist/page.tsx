import { ProductGrid } from "@/components/product-grid"

const wishlistProducts = [
  {
    id: "4",
    name: "Aventus",
    brand: "Creed",
    price: 185000,
    image: "/creed-aventus-perfume-bottle.jpg",
    category: "perfumes",
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
