import type { ReactNode } from 'react'
import Link from 'next/link'
import { requireUser } from '@/lib/session'
import {
  Settings2,
  Heart,
  MapPin,
  Package,
  ShieldCheck,
  User2,
  LayoutDashboard,
} from 'lucide-react'

import { AccountSidebar } from '@/components/account/AccountSidebar'

export const dynamic = "force-dynamic"

type AccountLayoutProps = {
  children: ReactNode
}

export default async function AccountLayout({ children }: AccountLayoutProps) {
  const user = await requireUser()

  const navItems = [
    { href: '/account', label: 'Overview', icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: '/account/orders', label: 'Orders', icon: <Package className="h-4 w-4" /> },
    { href: '/account/wishlist', label: 'Wishlist', icon: <Heart className="h-4 w-4" /> },
    { href: '/account/addresses', label: 'Addresses', icon: <MapPin className="h-4 w-4" /> },
    { href: '/account/profile', label: 'Profile', icon: <User2 className="h-4 w-4" /> },
    { href: '/account/security', label: 'Security', icon: <ShieldCheck className="h-4 w-4" /> },
    { href: '/account/settings', label: 'Settings', icon: <Settings2 className="h-4 w-4" /> },
  ]

  return (
    <div className="space-y-8 px-4 lg:px-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold text-foreground">My Account</h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile, orders, and communication preferences in one place.
        </p>
      </header>

      <section className="grid gap-8 lg:grid-cols-[260px,1fr]">
        <AccountSidebar name={user.name} email={user.email} navItems={navItems} />

        <div className="space-y-8">
          <div className="rounded-3xl border border-border bg-card p-6 lg:p-8">{children}</div>

          <footer className="text-xs text-muted-foreground">
            Need assistance?{' '}
            <Link href="/help" className="font-medium text-foreground hover:underline">
              Visit the help center
            </Link>
            .
          </footer>
        </div>
      </section>
    </div>
  )
}
