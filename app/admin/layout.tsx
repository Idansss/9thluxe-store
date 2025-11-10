// app/admin/layout.tsx
import Link from 'next/link'
import { requireAdmin } from '@/lib/admin'
import { Package, ShoppingBag, Users, Mail, BarChart3 } from 'lucide-react'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()

  const nav = [
    { href: '/admin', label: 'Dashboard', icon: BarChart3 },
    { href: '/admin/products', label: 'Products', icon: ShoppingBag },
    { href: '/admin/orders', label: 'Orders', icon: Package },
    { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
    { href: '/admin/users', label: 'Users', icon: Users },
  ]

  return (
    <div className="container mx-auto max-w-7xl px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground">Admin Panel</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your store, products, and customers</p>
      </div>
      
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        <aside className="lg:col-span-1">
          <div className="rounded-3xl border border-border bg-card p-6">
            <div className="mb-4">
              <div className="font-semibold text-foreground">Admin</div>
              <div className="text-xs text-muted-foreground">Control panel</div>
            </div>
            <nav className="space-y-1">
              {nav.map((n) => (
                <Link 
                  key={n.href} 
                  href={n.href} 
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-muted text-muted-foreground hover:text-foreground"
                >
                  <n.icon className="h-4 w-4" />
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>
        <div className="lg:col-span-3">{children}</div>
      </section>
    </div>
  )
}
