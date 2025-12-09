import type React from "react"

import { Header } from "./header"

import { Footer } from "./footer"



interface MainLayoutProps {

  children: React.ReactNode

  cartItemCount?: number

}



export function MainLayout({ children, cartItemCount }: MainLayoutProps) {

  return (

    <div className="flex min-h-screen flex-col">

      <Header cartItemCount={cartItemCount} />

      <main className="flex-1">{children}</main>

      <Footer />

    </div>

  )

}
