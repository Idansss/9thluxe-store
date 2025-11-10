import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/admin'
import Link from 'next/link'
import { Package, Users, TrendingUp, DollarSign } from 'lucide-react'
import { formatPrice } from '@/lib/format'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  await requireAdmin()

  // Fetch statistics
  const [totalOrders, totalProducts, totalUsers, recentOrders] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.user.count(),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        user: { select: { email: true } },
      },
    }),
  ])

  const totalRevenue = await prisma.order.aggregate({
    _sum: { totalNGN: true },
  })

  const stats = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: Package,
      color: 'bg-blue-100 text-blue-600',
      change: '+12%',
    },
    {
      title: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'bg-emerald-100 text-emerald-600',
      change: '+5%',
    },
    {
      title: 'Total Users',
      value: totalUsers,
      icon: Users,
      color: 'bg-purple-100 text-purple-600',
      change: '+8%',
    },
    {
      title: 'Revenue',
      value: formatPrice(totalRevenue._sum.totalNGN || 0),
      icon: DollarSign,
      color: 'bg-orange-100 text-orange-600',
      change: '+15%',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.title} className="rounded-3xl border border-border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">{stat.value}</p>
                <p className="mt-1 text-xs text-emerald-600">{stat.change}</p>
              </div>
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-muted-foreground">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Amount</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm text-foreground">{order.reference}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{order.user.email}</td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{formatPrice(order.totalNGN)}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' :
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}



