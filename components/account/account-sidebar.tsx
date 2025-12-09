"use client"



import Link from "next/link"

import { usePathname } from "next/navigation"

import { User, Package, MapPin, Heart, Settings, Shield, LogOut } from "lucide-react"

import { cn } from "@/lib/utils"

import { Card } from "@/components/ui/card"

import { SignOutButton } from "@/components/auth/sign-out-button"



const navItems = [

  { name: "Overview", href: "/account", icon: User },

  { name: "Orders", href: "/account/orders", icon: Package },

  { name: "Addresses", href: "/account/addresses", icon: MapPin },

  { name: "Wishlist", href: "/account/wishlist", icon: Heart },

  { name: "Settings", href: "/account/settings", icon: Settings },

  { name: "Security", href: "/account/security", icon: Shield },

]



export function AccountSidebar() {

  const pathname = usePathname()



  return (

    <Card className="p-2 lg:w-64 shrink-0 h-fit lg:sticky lg:top-24">

      <nav className="flex lg:flex-col gap-1">

        {navItems.map((item) => {

          const isActive = pathname === item.href

          return (

            <Link

              key={item.name}

              href={item.href}

              className={cn(

                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",

                isActive

                  ? "bg-primary text-primary-foreground"

                  : "text-muted-foreground hover:text-foreground hover:bg-muted",

              )}

            >

              <item.icon className="h-4 w-4" />

              <span className="hidden lg:inline">{item.name}</span>

            </Link>

          )

        })}

        <SignOutButton

          variant="ghost"

          className="justify-start gap-3 px-3 py-2 text-muted-foreground hover:text-destructive w-full"

        >

          <LogOut className="h-4 w-4" />

          <span className="hidden lg:inline">Sign Out</span>

        </SignOutButton>

      </nav>

    </Card>

  )

}
