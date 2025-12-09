import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import { Package, Heart, MapPin, ArrowRight } from "lucide-react"

import Link from "next/link"

import { requireUser } from "@/lib/session"

import { prisma } from "@/lib/prisma"



export const dynamic = "force-dynamic"



export default async function AccountOverviewPage() {

  // Get authenticated user

  const user = await requireUser()



  // Fetch user's actual data from database

  const userData = await prisma.user.findUnique({

    where: { id: user.id },

    select: {

      name: true,

      email: true,

      createdAt: true,

    },

  })



  // Format member since date

  const memberSince = userData?.createdAt

    ? new Date(userData.createdAt).toLocaleDateString("en-US", {

        month: "long",

        year: "numeric",

      })

    : "Recently"



  // Get actual stats from database

  const [orderCount, wishlistCount, addressCount] = await Promise.all([

    prisma.order.count({ where: { userId: user.id } }),

    prisma.wishlist.count({ where: { userId: user.id } }),

    prisma.address.count({ where: { userId: user.id } }),

  ])



  const stats = [

    { label: "Orders", value: orderCount.toString(), icon: Package, href: "/account/orders" },

    { label: "Wishlist", value: wishlistCount.toString(), icon: Heart, href: "/account/wishlist" },

    { label: "Addresses", value: addressCount.toString(), icon: MapPin, href: "/account/addresses" },

  ]



  const displayName = userData?.name || user.name || "User"

  const displayEmail = userData?.email || user.email



  // Fetch recent orders

  const recentOrders = await prisma.order.findMany({

    where: { userId: user.id },

    take: 3,

    orderBy: { createdAt: "desc" },

    include: {

      items: {

        include: {

          product: true,

        },

      },

    },

  })

  return (

    <div className="space-y-6">

      {/* Welcome Card */}

      <Card>

        <CardContent className="pt-6">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">

              <span className="text-2xl font-serif font-semibold text-primary">

                {displayName

                  .split(" ")

                  .map((n) => n[0])

                  .join("")

                  .toUpperCase()

                  .slice(0, 2)}

              </span>

            </div>

            <div>

              <h2 className="text-xl font-semibold">Welcome back, {displayName.split(" ")[0]}!</h2>

              <p className="text-sm text-muted-foreground">{displayEmail}</p>

              <p className="text-xs text-muted-foreground mt-1">Member since {memberSince}</p>

            </div>

          </div>

        </CardContent>

      </Card>



      {/* Quick Stats */}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {stats.map((stat) => (

          <Card key={stat.label} className="hover:shadow-md transition-shadow">

            <Link href={stat.href}>

              <CardContent className="pt-6">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm text-muted-foreground">{stat.label}</p>

                    <p className="text-3xl font-semibold mt-1">{stat.value}</p>

                  </div>

                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">

                    <stat.icon className="h-6 w-6 text-muted-foreground" />

                  </div>

                </div>

              </CardContent>

            </Link>

          </Card>

        ))}

      </div>



      {/* Recent Orders */}

      <Card>

        <CardHeader className="flex flex-row items-center justify-between">

          <CardTitle className="text-lg">Recent Orders</CardTitle>

          {orderCount > 0 && (

            <Button variant="ghost" size="sm" asChild>

              <Link href="/account/orders">

                View all

                <ArrowRight className="ml-1 h-4 w-4" />

              </Link>

            </Button>

          )}

        </CardHeader>

        <CardContent>

          {orderCount > 0 ? (

            <div className="space-y-4">

              {/* Show up to 3 most recent orders */}

              {recentOrders.map((order) => (

                <Link

                  key={order.id}

                  href={`/account/orders/${order.id}`}

                  className="block p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"

                >

                  <div className="flex items-center justify-between">

                    <div>

                      <p className="font-medium">Order {order.id.slice(0, 8)}</p>

                      <p className="text-sm text-muted-foreground">

                        {new Date(order.createdAt).toLocaleDateString("en-US", {

                          month: "short",

                          day: "numeric",

                          year: "numeric",

                        })}

                      </p>

                    </div>

                    <div className="text-right">

                      <p className="font-semibold">

                        ₦{order.totalNGN.toLocaleString()}

                      </p>

                      <p className="text-xs text-muted-foreground capitalize">{order.status.toLowerCase()}</p>

                    </div>

                  </div>

                </Link>

              ))}

            </div>

          ) : (

            <div className="text-center py-8 text-muted-foreground">

              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />

              <p>No orders yet</p>

              <Button asChild variant="outline" className="mt-4 bg-transparent">

                <Link href="/">Start Shopping</Link>

              </Button>

            </div>

          )}

        </CardContent>

      </Card>

    </div>

  )

}
