import { prisma } from "@/lib/prisma"

export async function getAdminStats() {
  const [totalRevenue, totalOrders, activeCoupons, subscribers] = await Promise.all([
    prisma.order.aggregate({
      where: {
        status: {
          in: ["PAID", "SHIPPED", "DELIVERED"],
        },
      },
      _sum: {
        totalNGN: true,
      },
    }),
    prisma.order.count(),
    prisma.coupon.count({
      where: {
        active: true,
        endsAt: {
          gte: new Date(),
        },
      },
    }),
    prisma.user.count({
      where: {
        marketingEmails: true,
      },
    }),
  ])

  return {
    totalRevenue: totalRevenue._sum.totalNGN || 0,
    totalOrders,
    activeCoupons,
    subscribers,
  }
}

