import Link from "next/link"
import { Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAdminOrders } from "@/lib/services/order-service"
import type { OrderStatus } from "@prisma/client"

export const dynamic = "force-dynamic"

interface AdminOrdersPageProps {
  searchParams?: Promise<{
    q?: string
    status?: string
  }>
}

const statusOptions: { label: string; value: "all" | OrderStatus }[] = [
  { label: "All status", value: "all" },
  { label: "Pending", value: "PENDING" },
  { label: "Paid", value: "PAID" },
  { label: "Shipped", value: "SHIPPED" },
  { label: "Delivered", value: "DELIVERED" },
]

const statusClasses: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  PAID: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  SHIPPED: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
}

export default async function AdminOrdersPage({ searchParams }: AdminOrdersPageProps) {
  const params = await searchParams
  const q = params?.q?.toString() ?? ""
  const statusParam = params?.status?.toString() ?? "all"

  const selectedStatus =
    statusOptions.find((option) => option.value === statusParam)?.value ?? "all"

  const orders = await getAdminOrders({
    search: q || undefined,
    status: selectedStatus,
  })

  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">View and manage customer orders.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
            <CardTitle className="text-lg">All orders</CardTitle>
            <form className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center" method="get">
              <div className="relative w-full sm:min-w-[300px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="q"
                  placeholder="Search by reference or email..."
                  className="h-10 pl-10 pr-3"
                  defaultValue={q}
                />
              </div>
              <select
                name="status"
                defaultValue={String(selectedStatus)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring sm:w-44"
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={String(option.value)}>
                    {option.label}
                  </option>
                ))}
              </select>
              <Button type="submit" variant="outline" size="sm" className="h-10 px-4">
                Filter
              </Button>
            </form>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="py-8 text-center text-sm text-muted-foreground"
                    >
                      No orders found for this filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => {
                    const itemsCount = order.items.reduce((total, item) => total + item.quantity, 0)
                    const statusClass = statusClasses[order.status]

                    return (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.reference || order.id.slice(0, 8)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span>{order.user?.name || order.user?.email || "Guest"}</span>
                            {order.user?.email && (
                              <span className="text-xs text-muted-foreground">
                                {order.user.email}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{itemsCount}</TableCell>
                        <TableCell>{formatPrice(order.totalNGN)}</TableCell>
                        <TableCell>
                          <Badge className={statusClass}>
                            {order.status.toLowerCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {order.createdAt.toLocaleDateString("en-NG", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="outline" size="sm" className="h-8 px-3 text-xs">
                            <Link href={`/admin/orders/${order.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
