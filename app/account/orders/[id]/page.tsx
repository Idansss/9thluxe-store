import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Package, Truck, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ReviewStatus } from "@/components/orders/review-status"
import { requireUser } from "@/lib/session"
import { prisma } from "@/lib/prisma"
import { formatPrice } from "@/lib/format"

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  PAID: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  SHIPPED: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
}

const statusIcons: Record<string, typeof Package> = {
  PENDING: Clock,
  PAID: Package,
  SHIPPED: Truck,
  DELIVERED: CheckCircle,
}

function getProductImage(images: unknown): string {
  if (Array.isArray(images) && images.length > 0 && typeof images[0] === "string") return images[0]
  return "/placeholder.svg"
}

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const user = await requireUser()
  const { id } = await params

  const order = await prisma.order.findFirst({
    where: { id, userId: user.id },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              slug: true,
              brand: true,
              images: true,
            },
          },
        },
      },
    },
  })

  if (!order) notFound()

  const StatusIcon = statusIcons[order.status] || Package
  const items = order.items.map((oi) => ({
    product: {
      id: oi.product.id,
      name: oi.product.name,
      slug: oi.product.slug,
      brand: oi.product.brand,
      image: getProductImage(oi.product.images),
      price: oi.priceNGN,
    },
    quantity: oi.quantity,
  }))

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
          <p className="text-sm text-muted-foreground mt-1">
            {order.reference ? `Order ${order.reference}` : `Order ${order.id.slice(0, 8)}`}
          </p>
        </div>
      </div>

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
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-NG", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item, index) => (
                <div key={order.items[index].id}>
                  <div className="flex gap-4">
                    <Link href={`/product/${item.product.slug}`} className="shrink-0">
                      <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted">
                        <Image
                          src={item.product.image}
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
                      {item.product.brand && (
                        <p className="text-sm text-muted-foreground">{item.product.brand}</p>
                      )}
                      <p className="text-sm text-muted-foreground mt-1">Quantity: {item.quantity}</p>
                      <p className="font-semibold mt-2">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                  {index < items.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <p className="text-muted-foreground">{order.addressLine1}</p>
                <p className="text-muted-foreground">
                  {order.city}, {order.state}
                </p>
                <p className="text-muted-foreground">{order.phone}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.subtotalNGN)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Discount</span>
                <span>{order.discountNGN > 0 ? `-${formatPrice(order.discountNGN)}` : "—"}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-semibold text-lg">{formatPrice(order.totalNGN)}</span>
              </div>
              {order.reference && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Payment reference</p>
                    <p className="text-sm text-muted-foreground font-mono break-all">{order.reference}</p>
                  </div>
                </>
              )}
              {order.status === "DELIVERED" && (
                <ReviewStatus orderId={order.id} items={items} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
