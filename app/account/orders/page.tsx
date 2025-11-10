import Link from "next/link"
import { OrderStatus } from "@prisma/client"

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/format"

export const dynamic = "force-dynamic"

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-emerald-100 text-emerald-700",
  SHIPPED: "bg-blue-100 text-blue-700",
  DELIVERED: "bg-gray-200 text-gray-800",
}

export default async function OrdersPage() {
  const session = await auth()
  const email = session?.user?.email

  if (!email) {
    return (
      <div className="rounded-2xl border border-border bg-muted/40 p-6 text-sm text-muted-foreground">
        Please{" "}
        <Link href="/auth/signin" className="font-medium text-foreground underline">
          sign in
        </Link>{" "}
        to view your orders.
      </div>
    )
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      orders: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          reference: true,
          status: true,
          totalNGN: true,
          createdAt: true,
          items: {
            select: {
              quantity: true,
              product: { select: { name: true, slug: true } },
            },
          },
        },
      },
    },
  })

  if (!user) {
    return (
      <div className="rounded-2xl border border-border bg-muted/40 p-6 text-sm text-muted-foreground">
        Account not found.{" "}
        <Link href="/auth/signin" className="font-medium text-foreground underline">
          Sign in
        </Link>{" "}
        again.
      </div>
    )
  }

  const orders = user.orders

  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-muted/40 p-6 text-sm text-muted-foreground">
        You have no orders yet.{" "}
        <Link href="/" className="font-medium text-foreground underline">
          Start shopping
        </Link>{" "}
        to add your first order.
      </div>
    )
  }

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-foreground">Orders</h1>

      <ul className="space-y-4">
        {orders.map((order) => {
          const orderDate = new Date(order.createdAt).toLocaleDateString()
          const orderRef = order.reference || `#${order.id.slice(-6)}`

          return (
            <li key={order.id} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-foreground">{orderRef}</span>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[order.status]}`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">{orderDate}</div>
              </div>

              <div className="mt-2 text-sm text-muted-foreground">
                Total <span className="font-semibold text-foreground">{formatPrice(order.totalNGN)}</span>
              </div>

              {order.items.length > 0 && (
                <ul className="mt-4 space-y-1 rounded-2xl bg-muted/40 p-4 text-sm text-foreground">
                  {order.items.map((item, index) => (
                    <li key={`${order.id}-${index}`}>
                      {item.quantity} ×{" "}
                      <Link className="underline transition-colors hover:text-foreground" href={`/product/${item.product.slug}`}>
                        {item.product.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}

