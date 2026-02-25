"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useCheckoutStore } from "@/lib/stores/checkout-store"

export interface OrderPayload {
  items: { productId: string; quantity: number; priceNGN: number }[]
  subtotalNGN: number
  discountNGN: number
  shippingNGN: number
  totalNGN: number
  couponId?: string | null
  isGift?: boolean
  giftMessage?: string
  giftWrapping?: boolean
}

interface PaymentFormProps {
  onBack: () => void
  onComplete: () => void
  total: number
  orderPayload: OrderPayload
}

export function PaymentForm({ onBack, onComplete, total, orderPayload }: PaymentFormProps) {
  const { formData } = useCheckoutStore()
  const [isProcessing, setIsProcessing] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email) {
      toast.error("Email required", {
        description: "Please provide your email address in the shipping information.",
      })
      return
    }

    setIsProcessing(true)

    try {
      const addressLine1 = [formData.address, formData.address2].filter(Boolean).join(", ").trim() || formData.address
      if (!addressLine1 || !formData.city || !formData.state || !formData.phone) {
        toast.error("Shipping required", { description: "Please complete shipping address and phone." })
        setIsProcessing(false)
        return
      }

      // 1) Create order (PENDING) and get orderId
      const createRes = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressLine1,
          city: formData.city,
          state: formData.state,
          phone: formData.phone,
          items: orderPayload.items,
          subtotalNGN: orderPayload.subtotalNGN,
          discountNGN: orderPayload.discountNGN,
          shippingNGN: orderPayload.shippingNGN,
          totalNGN: orderPayload.totalNGN,
          couponId: orderPayload.couponId ?? null,
        }),
      })

      const createData = await createRes.json()
      if (!createRes.ok) {
        throw new Error(createData.error || "Failed to create order")
      }
      const orderId = createData.orderId as string
      if (!orderId) {
        throw new Error("No order ID returned")
      }

      // 2) Initialize Paystack with orderId in metadata (webhook will mark order PAID)
      const payRes = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          amountNGN: total,
          metadata: {
            orderId,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
          },
        }),
      })

      const payData = await payRes.json()
      if (!payRes.ok || !payData.authorization_url) {
        throw new Error(payData.error || "Failed to initialize payment")
      }

      window.location.href = payData.authorization_url
    } catch (error: unknown) {
      setIsProcessing(false)
      const message = error instanceof Error ? error.message : "Please try again later."
      toast.error("Payment initialization failed", { description: message })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" data-payment-form>
      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border p-4 bg-muted/30">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium">Pay with Paystack</p>
                <p className="text-sm text-muted-foreground">
                  You will be redirected to Paystack to securely enter your card details and complete the payment.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1" disabled={isProcessing}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button type="submit" className="flex-1" disabled={isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Redirecting to Paystack...
            </>
          ) : (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Pay with Paystack
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

