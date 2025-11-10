"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { User, Package, Heart, MapPin, Settings, Shield, LayoutDashboard } from "lucide-react"
import { cn } from "@/lib/utils"

const menuItems = [
  { href: "/account/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/profile", label: "Profile", icon: User },
  { href: "/account/security", label: "Security", icon: Shield },
  { href: "/account/settings", label: "Settings", icon: Settings },
]

export function AccountSidebar() {
  const pathname = usePathname()

  return (
    <aside className="lg:col-span-1">
      <div className="sticky top-24 space-y-4">
        {/* User Card */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">john@example.com</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1 rounded-xl border border-border bg-card p-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
