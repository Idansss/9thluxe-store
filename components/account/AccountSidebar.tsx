'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { User2 } from 'lucide-react'

type NavItem = {
  href: string
  label: string
  icon: React.ReactNode
}

type AccountSidebarProps = {
  name?: string | null
  email: string
  navItems: NavItem[]
}

export function AccountSidebar({ name, email, navItems }: AccountSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="space-y-6">
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-foreground">
            <User2 className="h-6 w-6" />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">{name || 'My Account'}</div>
            <div className="text-xs text-muted-foreground">{email}</div>
          </div>
        </div>
      </div>

      <nav className="rounded-3xl border border-border bg-card p-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

