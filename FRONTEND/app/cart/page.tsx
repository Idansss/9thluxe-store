import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartContent } from "@/components/cart-content"

export default function CartPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto max-w-[1200px] px-6 py-12">
          <h1 className="mb-8 text-3xl font-semibold">Shopping Cart</h1>
          <CartContent />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
