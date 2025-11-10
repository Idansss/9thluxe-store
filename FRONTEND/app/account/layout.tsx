import type React from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AccountSidebar } from "@/components/account-sidebar"

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 bg-muted/30">
        <div className="container mx-auto max-w-[1200px] px-6 py-12">
          <h1 className="mb-8 text-3xl font-semibold">My Account</h1>
          <div className="grid gap-8 lg:grid-cols-4">
            <AccountSidebar />
            <div className="lg:col-span-3">{children}</div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
