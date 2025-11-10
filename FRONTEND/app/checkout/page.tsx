import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CheckoutForm } from "@/components/checkout-form"

export default function CheckoutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto max-w-[1200px] px-6 py-12">
          <h1 className="mb-8 text-3xl font-semibold">Checkout</h1>
          <CheckoutForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
