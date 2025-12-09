"use client"



import * as React from "react"

import { useRouter } from "next/navigation"

import { ShippingForm } from "./shipping-form"

import { PaymentForm } from "./payment-form"

import { OrderSummary } from "./order-summary"

import { CheckoutSteps } from "./checkout-steps"

import { useCartStore } from "@/lib/stores/cart-store"

import { useCheckoutStore } from "@/lib/stores/checkout-store"

import { dummyProducts } from "@/lib/dummy-data"

import type { Product } from "@/components/ui/product-card"



interface OrderItem {

  product: Product

  quantity: number

}



interface CheckoutContentProps {

  items: OrderItem[]

}



export function CheckoutContent({ items: propItems }: CheckoutContentProps) {

  const router = useRouter()

  const cartItems = useCartStore((state) => state.items)

  const [currentStep, setCurrentStep] = React.useState(1)

  const couponCode = useCartStore((state) => state.couponCode)

  const discount = useCartStore((state) => state.discount)

  const applyCoupon = useCartStore((state) => state.applyCoupon)

  const removeCoupon = useCartStore((state) => state.removeCoupon)

  const { formData } = useCheckoutStore()

  const deliveryMethod = formData.deliveryMethod



  // Convert cart items to display format with product details

  const items = React.useMemo(() => {

    if (propItems.length > 0) {

      return propItems

    }

    return cartItems.map((cartItem) => {

      // Find product details from dummy data (in real app, this would come from API)

      const product = dummyProducts.find((p) => p.id === cartItem.id)

      if (!product) {

        return null

      }

      return {

        product: {

          ...product,

          image: cartItem.image || product.image,

        },

        quantity: cartItem.quantity,

      }

    }).filter(Boolean) as OrderItem[]

  }, [cartItems, propItems])



  // Redirect to cart if no items

  React.useEffect(() => {

    if (items.length === 0) {

      router.push("/cart")

    }

  }, [items.length, router])



  if (items.length === 0) {

    return null

  }



  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  // Calculate shipping based on delivery method

  const shipping = deliveryMethod === "express" ? 35000 : 15000

  // Recalculate discount if coupon is applied and subtotal changed

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



  return (

    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

      <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight mb-8">Checkout</h1>



      {/* Steps */}

      <CheckoutSteps currentStep={currentStep} />



      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 mt-8">

        {/* Form */}

        <div className="lg:col-span-2">

          {currentStep === 1 && (

            <ShippingForm

              onNext={() => setCurrentStep(2)}

              deliveryMethod={deliveryMethod}

              onDeliveryMethodChange={(method) => {

                useCheckoutStore.getState().updateFormData({ deliveryMethod: method as "standard" | "express" })

              }}

            />

          )}

          {currentStep === 2 && (

            <PaymentForm

              onBack={() => setCurrentStep(1)}

              onComplete={() => setCurrentStep(3)}

              total={total}

            />

          )}

        </div>



        {/* Order Summary */}

        <div className="lg:col-span-1">

          <OrderSummary

            items={items}

            subtotal={subtotal}

            shipping={shipping}

            total={total}

            currentStep={currentStep}

            discount={currentDiscount}

            couponCode={couponCode}

            applyCoupon={applyCoupon}

            removeCoupon={removeCoupon}

            onPaymentClick={() => {

              // Trigger form submission in payment form

              const form = document.querySelector('form[data-payment-form]') as HTMLFormElement

              if (form) {

                form.requestSubmit()

              }

            }}

          />

        </div>

      </div>

    </div>

  )

}
