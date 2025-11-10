"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatPrice } from "@/lib/format"
import { useCartStore } from "@/lib/cart-store"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function CheckoutForm() {
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [isProcessing, setIsProcessing] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    addressLine: "",
    city: "",
    state: "",
    phone: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Clear cart and redirect to success page
    clearCart()
    router.push("/checkout/success")
  }

  if (items.length === 0) {
    router.push("/cart")
    return null
  }

  const total = getTotalPrice()

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-3">
      {/* Left: Order Summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4 rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">Order Summary</h2>

          <div className="space-y-3 border-t border-border pt-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <div className="flex-1">
                  <p className="font-medium">
                    {item.name} × {item.quantity}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.brand}</p>
                </div>
                <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2 border-t border-border pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">Free</span>
            </div>
          </div>

          <div className="flex justify-between border-t border-border pt-4 text-lg font-bold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>

      {/* Right: Checkout Form */}
      <div className="space-y-6 lg:col-span-2">
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-6 text-xl font-semibold">Delivery Information</h2>

          <div className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="rounded-lg"
              />
            </div>

            {/* Address Line */}
            <div className="space-y-2">
              <Label htmlFor="addressLine">Address Line</Label>
              <Input
                id="addressLine"
                name="addressLine"
                type="text"
                placeholder="123 Main Street"
                value={formData.addressLine}
                onChange={handleInputChange}
                required
                className="rounded-lg"
              />
            </div>

            {/* City & State */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  type="text"
                  placeholder="Lagos"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  className="rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  type="text"
                  placeholder="Lagos State"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  className="rounded-lg"
                />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+234 800 000 0000"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-sm text-amber-900">
            This is a demo checkout. In production, this would integrate with Paystack for secure payment processing.
          </AlertDescription>
        </Alert>

        {/* Submit Button */}
        <Button type="submit" size="lg" className="w-full rounded-xl" disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Continue (Demo)"}
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          By placing your order, you agree to our terms and conditions. We ship to all 36 states and the FCT.
        </p>
      </div>
    </form>
  )
}
