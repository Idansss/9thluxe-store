import type { Metadata } from "next"

import { MainLayout } from "@/components/layout/main-layout"

import { CheckoutContent } from "@/components/checkout/checkout-content"

import { dummyProducts } from "@/lib/dummy-data"



export const metadata: Metadata = {

  title: "Checkout | Fàdè",

  description: "Complete your order securely.",

}



export default function CheckoutPage() {

  // This will be replaced with cart store data in the client component

  // For now, we'll pass empty array and let CheckoutContent handle it

  return (

    <MainLayout>

      <CheckoutContent items={[]} />

    </MainLayout>

  )

}
