"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { useCheckoutStore } from "@/lib/stores/checkout-store"

interface PaymentFormProps {
  onBack: () => void
  onComplete: () => void
  total: number
}

export function PaymentForm({ onBack, onComplete, total }: PaymentFormProps) {
  const router = useRouter()
  const { formData } = useCheckoutStore()
  const [isProcessing, setIsProcessing] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate email is provided
    if (!formData.email) {
      toast.error("Email required", {
        description: "Please provide your email address in the shipping information.",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Initialize Paystack payment
      const response = await fetch("/api/paystack/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          amountNGN: total,
          metadata: {
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

      const data = await response.json()

      if (!response.ok || !data.authorization_url) {
        throw new Error(data.error || "Failed to initialize payment")
      }

      // Redirect to Paystack payment page
      window.location.href = data.authorization_url
    } catch (error: any) {
      setIsProcessing(false)
      toast.error("Payment initialization failed", {
        description: error.message || "Please try again later.",
      })
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
              <Lock className="h-4 w-4 mr-2 animate-spin" />
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

