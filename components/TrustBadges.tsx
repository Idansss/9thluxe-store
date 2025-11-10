import { Shield, Truck, RotateCcw, CreditCard } from 'lucide-react'

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center">
        <Shield className="h-8 w-8 text-primary" />
        <div className="text-sm font-semibold">Secure Payment</div>
        <div className="text-xs text-muted-foreground">Your data is safe</div>
      </div>
      <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center">
        <Truck className="h-8 w-8 text-primary" />
        <div className="text-sm font-semibold">Free Shipping</div>
        <div className="text-xs text-muted-foreground">On orders over ₦50,000</div>
      </div>
      <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center">
        <RotateCcw className="h-8 w-8 text-primary" />
        <div className="text-sm font-semibold">Easy Returns</div>
        <div className="text-xs text-muted-foreground">7-day return policy</div>
      </div>
      <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center">
        <CreditCard className="h-8 w-8 text-primary" />
        <div className="text-sm font-semibold">Easy Payments</div>
        <div className="text-xs text-muted-foreground">Paystack & Bank Transfer</div>
      </div>
    </div>
  )
}



