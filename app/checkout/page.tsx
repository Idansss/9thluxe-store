import type { Metadata } from "next"

import { MainLayout } from "@/components/layout/main-layout"

import { CheckoutContent } from "@/components/checkout/checkout-content"



export const metadata: Metadata = {

  title: "Checkout | Fàdè",

  description: "Complete your order securely.",

}



export default function CheckoutPage() {

  return (

    <MainLayout>

      <CheckoutContent items={[]} />

    </MainLayout>

  )

}
