"use client"

import * as React from "react"

import Image from "next/image"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Separator } from "@/components/ui/separator"

import { Input } from "@/components/ui/input"

import { Button } from "@/components/ui/button"

import { Tag, Lock } from "lucide-react"

import { toast } from "sonner"

import type { Product } from "@/components/ui/product-card"



interface OrderItem {

  product: Product

  quantity: number

}



interface OrderSummaryProps {

  items: OrderItem[]

  subtotal: number

  shipping: number

  total: number

  currentStep?: number

  onPaymentClick?: () => void

  discount?: number

  couponCode?: string | null

  applyCoupon?: (code: string, subtotal: number) => boolean

  removeCoupon?: () => void

}



export function OrderSummary({

  items,

  subtotal,

  shipping,

  total,

  currentStep,

  onPaymentClick,

  discount = 0,

  couponCode: propCouponCode = null,

  applyCoupon: propApplyCoupon,

  removeCoupon: propRemoveCoupon,

}: OrderSummaryProps) {

  const [inputCode, setInputCode] = React.useState("")

  const [couponMessage, setCouponMessage] = React.useState<string | null>(null)

  const appliedCoupon = propCouponCode



  const formatPrice = (amount: number) => {

    return new Intl.NumberFormat("en-NG", {

      style: "currency",

      currency: "NGN",

      minimumFractionDigits: 0,

      maximumFractionDigits: 0,

    }).format(amount)

  }



  const handleApplyCoupon = (e?: React.FormEvent) => {

    e?.preventDefault()

    const code = inputCode.trim()

    if (!code) {

      setCouponMessage("Please enter a coupon code")

      return

    }

    if (propApplyCoupon) {

      const success = propApplyCoupon(code, subtotal)

      if (success) {

        const newDiscount = subtotal * 0.1

        setCouponMessage(`Coupon applied! You saved ${formatPrice(newDiscount)}`)

        setInputCode("")

        toast.success("Coupon applied", {

          description: `You saved ${formatPrice(newDiscount)}`,

        })

      } else {

        setCouponMessage("Invalid coupon code. Please try again.")

        toast.error("Invalid coupon code")

      }

    }

  }



  const handleRemoveCoupon = () => {

    propRemoveCoupon?.()

    setCouponMessage(null)

    setInputCode("")

    toast.success("Coupon removed")

  }



  return (

    <Card className="sticky top-24">

      <CardHeader>

        <CardTitle className="text-lg">Order Summary</CardTitle>

      </CardHeader>

      <CardContent className="space-y-4">

        {/* Items */}

        <div className="space-y-4">

          {items.map((item) => (

            <div key={item.product.id} className="flex gap-3">

              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">

                <Image

                  src={item.product.image || "/placeholder.svg"}

                  alt={item.product.name}

                  fill

                  className="object-cover"

                  sizes="64px"

                />

                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center">

                  {item.quantity}

                </span>

              </div>

              <div className="flex-1 min-w-0">

                <p className="text-xs text-muted-foreground">{item.product.brand}</p>

                <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>

                <p className="text-sm">{formatPrice(item.product.price * item.quantity)}</p>

              </div>

            </div>

          ))}

        </div>



        <Separator />



        {/* Discount Display */}

        {discount > 0 && appliedCoupon && (

          <div className="flex justify-between text-sm text-primary">

            <div className="flex items-center gap-2">

              <span>Discount ({appliedCoupon})</span>

              <button

                onClick={handleRemoveCoupon}

                className="text-xs text-muted-foreground hover:text-foreground underline"

                type="button"

              >

                Remove

              </button>

            </div>

            <span>-{formatPrice(discount)}</span>

          </div>

        )}



        {/* Coupon Input */}

        {!appliedCoupon && (

          <form onSubmit={handleApplyCoupon} className="space-y-2">

            <div className="flex gap-2">

              <div className="relative flex-1">

                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                <Input

                  type="text"

                  placeholder="Discount code"

                  value={inputCode}

                  onChange={(e) => {

                    setInputCode(e.target.value)

                    setCouponMessage(null)

                  }}

                  className="pl-9"

                />

              </div>

              <Button type="submit" variant="outline" className="bg-transparent">

                Apply

              </Button>

            </div>

            {couponMessage && (

              <p

                className={`text-xs ${

                  couponMessage.includes("applied") || couponMessage.includes("saved")

                    ? "text-primary"

                    : "text-destructive"

                }`}

              >

                {couponMessage}

              </p>

            )}

            {!couponMessage && <p className="text-xs text-muted-foreground">Try "FADE10" for 10% off</p>}

          </form>

        )}



        <Separator />



        {/* Totals */}

        <div className="space-y-2">

          <div className="flex justify-between text-sm">

            <span className="text-muted-foreground">Subtotal</span>

            <span>{formatPrice(subtotal)}</span>

          </div>

          {discount > 0 && (

            <div className="flex justify-between text-sm text-primary">

              <span>Discount</span>

              <span>-{formatPrice(discount)}</span>

            </div>

          )}

          <div className="flex justify-between text-sm">

            <span className="text-muted-foreground">Shipping</span>

            <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>

          </div>

          <Separator className="my-2" />

          <div className="flex justify-between">

            <span className="font-semibold">Total</span>

            <span className="font-semibold text-lg">{formatPrice(total)}</span>

          </div>

        </div>



        {/* Payment Button - Show on payment step or as placeholder */}

        {currentStep === 2 ? (

          <div className="pt-4">

            <Button className="w-full h-12 text-base" onClick={onPaymentClick} type="button">

              <Lock className="h-4 w-4 mr-2" />

              Pay with Paystack

            </Button>

            <p className="text-xs text-center text-muted-foreground mt-3">

              Your payment information is secure and encrypted.

            </p>

          </div>

        ) : currentStep === 1 ? (

          <div className="pt-4">

            <Button className="w-full h-12 text-base" disabled>

              <Lock className="h-4 w-4 mr-2" />

              Pay with Paystack

            </Button>

            <p className="text-xs text-center text-muted-foreground mt-3">

              Complete shipping information to proceed.

            </p>

          </div>

        ) : null}

      </CardContent>

    </Card>

  )

}
