import type React from "react"

import { AnnouncementBar } from "./announcement-bar"

import { Header } from "./header"

import { Footer } from "./footer"



interface MainLayoutProps {
  children: React.ReactNode
  /** Hide the marketing footer (e.g. for focused, app-like pages such as the Concierge). */
  hideFooter?: boolean
}

export function MainLayout({ children, hideFooter = false }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header />
      <main className="flex-1">{children}</main>
      {!hideFooter && <Footer />}
    </div>
  )
}
