import type { Metadata } from "next"

import { redirect } from "next/navigation"

import { MainLayout } from "@/components/layout/main-layout"

import { CartContent } from "@/components/cart/cart-content"

import { auth } from "@/lib/auth"

export const metadata: Metadata = {

  title: "Shopping Cart | Fàdè",

  description: "Review your shopping cart and proceed to checkout.",

}

export const dynamic = "force-dynamic"

export default async function CartPage() {

  // Check authentication - cart should be accessible to all users (guest or authenticated)
  // But we'll ensure the cart is user-scoped on the client side
  const session = await auth()

  return (

    <MainLayout>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        <h1 className="font-serif text-3xl md:text-4xl font-semibold tracking-tight mb-8">Shopping Cart</h1>

        <CartContent />

      </div>

    </MainLayout>

  )

}
