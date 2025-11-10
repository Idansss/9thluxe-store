import { formatPrice } from "@/lib/format"
import { Badge } from "@/components/ui/badge"

const orders = [
  {
    id: "9TL-2024-001",
    date: "2024-01-15",
    status: "delivered",
    total: 450000,
    items: 2,
  },
  {
    id: "9TL-2024-002",
    date: "2024-01-20",
    status: "shipped",
    total: 85000,
    items: 1,
  },
  {
    id: "9TL-2024-003",
    date: "2024-01-25",
    status: "processing",
    total: 120000,
    items: 3,
  },
]

const statusColors = {
  delivered: "bg-emerald-100 text-emerald-900 hover:bg-emerald-100",
  shipped: "bg-blue-100 text-blue-900 hover:bg-blue-100",
  processing: "bg-amber-100 text-amber-900 hover:bg-amber-100",
  cancelled: "bg-red-100 text-red-900 hover:bg-red-100",
}

export default function OrdersPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Order History</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl border border-border bg-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-semibold">Order #{order.id}</p>
                <p className="text-sm text-muted-foreground">
                  Placed on {new Date(order.date).toLocaleDateString("en-NG", { dateStyle: "long" })}
                </p>
              </div>
              <Badge className={statusColors[order.status as keyof typeof statusColors]}>{order.status}</Badge>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4">
              <div className="flex gap-6 text-sm">
                <div>
                  <p className="text-muted-foreground">Items</p>
                  <p className="font-medium">{order.items}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="font-medium">{formatPrice(order.total)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
