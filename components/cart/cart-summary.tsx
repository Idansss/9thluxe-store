"use client"



import * as React from "react"

import Link from "next/link"

import { Tag } from "lucide-react"

import { Button } from "@/components/ui/button"

import { Card } from "@/components/ui/card"

import { Input } from "@/components/ui/input"

import { Separator } from "@/components/ui/separator"

import { useCartStore } from "@/lib/stores/cart-store"

import { toast } from "sonner"



interface CartSummaryProps {

  subtotal: number

  itemCount: number

}



export function CartSummary({ subtotal, itemCount }: CartSummaryProps) {

  const couponCode = useCartStore((state) => state.couponCode)

  const discount = useCartStore((state) => state.discount)

  const applyCoupon = useCartStore((state) => state.applyCoupon)

  const removeCoupon = useCartStore((state) => state.removeCoupon)

  const [inputCode, setInputCode] = React.useState("")

  const [couponMessage, setCouponMessage] = React.useState<string | null>(null)



  const formatPrice = (amount: number) => {

    return new Intl.NumberFormat("en-NG", {

      style: "currency",

      currency: "NGN",

      minimumFractionDigits: 0,

      maximumFractionDigits: 0,

    }).format(amount)

  }



  const shipping = subtotal > 500000 ? 0 : 15000

  // Use discount from store, but recalculate if subtotal changed

  const currentDiscount = React.useMemo(() => {

    if (couponCode === "FADE10") {

      return subtotal * 0.1

    }

    return 0

  }, [subtotal, couponCode])

  // Update store discount if it changed

  React.useEffect(() => {

    if (couponCode && currentDiscount !== discount) {

      useCartStore.setState({ discount: currentDiscount })

    }

  }, [currentDiscount, couponCode, discount])

  const total = subtotal - currentDiscount + shipping



  // Update discount when subtotal changes (if coupon is applied)

  React.useEffect(() => {

    if (couponCode === "FADE10") {

      const newDiscount = subtotal * 0.1

      useCartStore.setState({ discount: newDiscount })

    }

  }, [subtotal, couponCode])



  const handleApplyCoupon = (e?: React.FormEvent) => {

    e?.preventDefault()

    const code = inputCode.trim()

    if (!code) {

      setCouponMessage("Please enter a coupon code")

      return

    }

    const success = applyCoupon(code, subtotal)

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



  const handleRemoveCoupon = () => {

    removeCoupon()

    setCouponMessage(null)

    setInputCode("")

    toast.success("Coupon removed")

  }



  return (

    <Card className="p-6 sticky top-24">

      <h2 className="font-serif text-xl font-semibold mb-6">Order Summary</h2>



      <div className="space-y-4">

        {/* Subtotal */}

        <div className="flex justify-between text-sm">

          <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>

          <span>{formatPrice(subtotal)}</span>

        </div>



        {/* Shipping */}

        <div className="flex justify-between text-sm">

          <span className="text-muted-foreground">Shipping</span>

          <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>

        </div>



        {/* Discount */}

        {discount > 0 && couponCode && (

          <div className="flex justify-between text-sm text-primary">

            <div className="flex items-center gap-2">

              <span>Discount ({couponCode})</span>

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



        {/* Coupon */}

        <div className="pt-2">

          {!couponCode ? (

            <form onSubmit={handleApplyCoupon} className="space-y-2">

              <div className="flex gap-2">

                <div className="relative flex-1">

                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                  <Input

                    type="text"

                    placeholder="Coupon code"

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

                  className={`text-xs mt-2 ${

                    couponMessage.includes("applied") || couponMessage.includes("saved")

                      ? "text-primary"

                      : "text-destructive"

                  }`}

                >

                  {couponMessage}

                </p>

              )}

              {!couponMessage && <p className="text-xs text-muted-foreground mt-2">Try "FADE10" for 10% off</p>}

            </form>

          ) : (

            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-primary">Coupon Applied: {couponCode}</p>

                  <p className="text-xs text-muted-foreground">You saved {formatPrice(discount)}</p>

                </div>

                <Button type="button" variant="ghost" size="sm" onClick={handleRemoveCoupon} className="h-8 text-xs">

                  Remove

                </Button>

              </div>

            </div>

          )}

        </div>



        <Separator className="my-4" />



        {/* Total */}

        <div className="flex justify-between">

          <span className="font-semibold">Total</span>

          <span className="font-semibold text-lg">{formatPrice(total)}</span>

        </div>



        {/* Free Shipping Notice */}

        {shipping > 0 && (

          <p className="text-xs text-muted-foreground text-center">

            Add {formatPrice(500000 - subtotal)} more for free shipping

          </p>

        )}

      </div>



      {/* Checkout Button */}

      <Button asChild className="w-full mt-6 h-12 text-base">

        <Link href="/checkout">Proceed to Checkout</Link>

      </Button>



      {/* Continue Shopping */}

      <Button asChild variant="ghost" className="w-full mt-2">

        <Link href="/">Continue Shopping</Link>

      </Button>

    </Card>

  )

}
