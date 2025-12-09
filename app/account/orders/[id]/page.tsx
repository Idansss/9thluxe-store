import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Package, Truck, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ReviewStatus } from "@/components/orders/review-status"
import { dummyProducts } from "@/lib/dummy-data"

const orders: Record<string, any> = {
  "ORD-001": {
    id: "ORD-001",
    date: "2024-01-15",
    status: "delivered",
    total: 16000000,
    shipping: 0,
    subtotal: 16000000,
    items: [{ product: dummyProducts[0], quantity: 1 }],
    shippingAddress: {
      name: "John Doe",
      address: "123 Victoria Island",
      city: "Lagos",
      state: "Lagos",
      postalCode: "100001",
          phone: "+234 8160591348",
    },
    trackingNumber: "TRK123456789",
    estimatedDelivery: "2024-01-20",
    deliveredDate: "2024-01-18",
  },
  "ORD-002": {
    id: "ORD-002",
    date: "2024-01-20",
    status: "processing",
    total: 970000,
    shipping: 15000,
    subtotal: 955000,
    items: [
      { product: dummyProducts[1], quantity: 1 },
      { product: dummyProducts[4], quantity: 1 },
    ],
    shippingAddress: {
      name: "John Doe",
      address: "456 Wuse Zone 5",
      city: "Abuja",
      state: "FCT",
      postalCode: "900001",
          phone: "+234 8160591348",
    },
    trackingNumber: "TRK987654321",
    estimatedDelivery: "2024-01-25",
  },
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  processing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  shipped: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  delivered: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}

const statusIcons: Record<string, any> = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: Package,
}

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params
  const order = orders[id]

  if (!order) {
    notFound()
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const StatusIcon = statusIcons[order.status] || Package

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/account/orders">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <div>
          <h1 className="font-serif text-2xl font-semibold">Order Details</h1>
          <p className="text-sm text-muted-foreground mt-1">Order {order.id}</p>
        </div>
      </div>

      {/* Order Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary/10">
              <StatusIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="font-semibold">Status</span>
                <Badge className={statusColors[order.status]}>{order.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Placed on {new Date(order.date).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}
              </p>
              {order.deliveredDate && (
                <p className="text-sm text-muted-foreground">
                  Delivered on {new Date(order.deliveredDate).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.items.map((item: any, index: number) => (
                <div key={index}>
                  <div className="flex gap-4">
                    <Link href={`/product/${item.product.slug}`} className="shrink-0">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/product/${item.product.slug}`}>
                        <h3 className="font-medium hover:text-accent transition-colors">{item.product.name}</h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">{item.product.brand}</p>
                      <p className="text-sm text-muted-foreground mt-1">Quantity: {item.quantity}</p>
                      <p className="font-semibold mt-2">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                  {index < order.items.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p className="text-muted-foreground">{order.shippingAddress.address}</p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
                <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-semibold text-lg">{formatPrice(order.total)}</span>
              </div>
              {order.trackingNumber && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Tracking Number</p>
                    <p className="text-sm text-muted-foreground font-mono">{order.trackingNumber}</p>
                    {order.estimatedDelivery && (
                      <p className="text-xs text-muted-foreground">
                        Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
                      </p>
                    )}
                  </div>
                </>
              )}
              {order.status === "delivered" && (
                <ReviewStatus orderId={order.id} items={order.items} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

