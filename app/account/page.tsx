// app/account/page.tsx
import Link from 'next/link'
import { 
  Package, 
  Heart, 
  MapPin, 
  User, 
  Shield, 
  Settings,
  Clock,
  TrendingUp
} from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function AccountPage() {
  const session = await auth()
  const email = session?.user?.email
  if (!email) {
    return (
      <div className="rounded border p-4">
        Please <Link className="underline" href="/auth/signin">sign in</Link>.
      </div>
    )
  }

  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, name: true, email: true } })
  if (!user) {
    return (
      <div className="rounded border p-4">
        Please <Link className="underline" href="/auth/signin">sign in</Link>.
      </div>
    )
  }

  const [ordersCount, wishlistCount, addressesCount, pendingOrders] = await Promise.all([
    prisma.order.count({ where: { userId: user.id } }),
    prisma.wishlist.count({ where: { userId: user.id } }),
    prisma.address.count({ where: { userId: user.id } }),
    prisma.order.count({ where: { userId: user.id, status: 'PENDING' } }),
  ])

  // Recent orders for activity feed
  const recentOrders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 3,
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  })

  const formatTimeAgo = (date: Date) => {
    const diffInMs = Date.now() - date.getTime()
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return '1 day ago'
    if (diffInDays < 7) return `${diffInDays} days ago`
    const weeks = Math.floor(diffInDays / 7)
    if (weeks === 1) return '1 week ago'
    return `${weeks} weeks ago`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'bg-green-100 text-green-700'
      case 'SHIPPED': return 'bg-blue-100 text-blue-700'
      case 'PAID': return 'bg-purple-100 text-purple-700'
      default: return 'bg-yellow-100 text-yellow-700'
    }
  }

  return (
    <section className="space-y-6">
      <header className="rounded-xl border border-border bg-card p-4">
        <div className="text-sm text-muted-foreground">Signed in as</div>
        <div className="font-medium text-foreground">{user.name || 'My Account'}</div>
        <div className="text-sm text-muted-foreground">{user.email}</div>
      </header>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <Package className="h-5 w-5 text-gray-600" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-semibold text-foreground">{ordersCount}</div>
          <div className="text-sm text-muted-foreground">Total Orders</div>
        </div>
        
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <Clock className="h-5 w-5 text-green-700" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-semibold text-foreground">{pendingOrders}</div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
              <Heart className="h-5 w-5 text-red-700" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-semibold text-foreground">{wishlistCount}</div>
          <div className="text-sm text-muted-foreground">Wishlist Items</div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <MapPin className="h-5 w-5 text-blue-700" />
            </div>
          </div>
          <div className="mt-3 text-2xl font-semibold text-foreground">{addressesCount}</div>
          <div className="text-sm text-muted-foreground">Saved Addresses</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/account/orders" className="rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted">
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium text-foreground">Orders</div>
              <div className="text-sm text-muted-foreground">View order history</div>
            </div>
          </div>
        </Link>
        <Link href="/account/wishlist" className="rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted">
          <div className="flex items-center gap-3">
            <Heart className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium text-foreground">Wishlist</div>
              <div className="text-sm text-muted-foreground">Saved items</div>
            </div>
          </div>
        </Link>
        <Link href="/account/addresses" className="rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium text-foreground">Addresses</div>
              <div className="text-sm text-muted-foreground">Manage locations</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Account Settings */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/account/profile" className="rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium text-foreground">Profile</div>
              <div className="text-sm text-muted-foreground">Personal information</div>
            </div>
          </div>
        </Link>
        <Link href="/account/security" className="rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium text-foreground">Security</div>
              <div className="text-sm text-muted-foreground">Password & security</div>
            </div>
          </div>
        </Link>
        <Link href="/account/settings" className="rounded-xl border border-border bg-card p-4 transition-colors hover:bg-muted">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium text-foreground">Settings</div>
              <div className="text-sm text-muted-foreground">Preferences</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Activity */}
      {recentOrders.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="mb-4 font-semibold text-foreground">Recent Activity</h3>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-start gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  order.status === 'DELIVERED' ? 'bg-green-100' :
                  order.status === 'SHIPPED' ? 'bg-blue-100' :
                  'bg-yellow-100'
                }`}>
                  <Package className={`h-4 w-4 ${
                    order.status === 'DELIVERED' ? 'text-green-700' :
                    order.status === 'SHIPPED' ? 'text-blue-700' :
                    'text-yellow-700'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">
                    Order #{order.reference || order.id.slice(0, 8)} {order.status.toLowerCase()}
                  </div>
                  <div className="text-xs text-muted-foreground">{formatTimeAgo(order.createdAt)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Support */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="text-sm font-medium text-muted-foreground">Support</div>
        <div className="mt-2 flex gap-4">
          <Link href="/help" className="text-sm text-foreground hover:text-muted-foreground transition-colors">
            Help Center
          </Link>
          <span className="text-muted-foreground">|</span>
          <Link href="/faq" className="text-sm text-foreground hover:text-muted-foreground transition-colors">
            FAQ
          </Link>
        </div>
      </div>
    </section>
  )
}

