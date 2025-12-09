import { prisma } from "@/lib/prisma"
import { OrderStatus, Prisma } from "@prisma/client"

export type AdminOrder = Prisma.OrderGetPayload<{
  include: {
    user: {
      select: {
        id: true
        name: true
        email: true
      }
    }
    items: {
      include: {
        product: {
          select: {
            id: true
            name: true
            slug: true
            images: true
            priceNGN: true
          }
        }
      }
    }
    coupon: {
      select: {
        code: true
      }
    }
  }
}>

export async function getAdminOrders(params: {
  search?: string
  status?: OrderStatus | "all"
} = {}): Promise<AdminOrder[]> {
  const { search, status } = params

  const where: Prisma.OrderWhereInput = {
    AND: [
      status && status !== "all" ? { status } : {},
      search
        ? {
            OR: [
              { reference: { contains: search } },
              { user: { email: { contains: search } } },
            ],
          }
        : {},
    ],
  }

  return prisma.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      items: {
        include: {
          product: {
            select: { id: true, name: true, slug: true, images: true, priceNGN: true },
          },
        },
      },
      coupon: {
        select: { code: true },
      },
    },
  })
}

export async function getAdminOrderById(id: string): Promise<AdminOrder | null> {
  if (!id) {
    return null
  }

  return prisma.order.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      items: {
        include: {
          product: {
            select: { id: true, name: true, slug: true, images: true, priceNGN: true },
          },
        },
      },
      coupon: {
        select: { code: true },
      },
    },
  })
}

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const order = await prisma.order.update({
    where: { id },
    data: { status },
    include: {
      user: {
        select: { email: true, name: true },
      },
      items: {
        include: {
          product: {
            select: { name: true, priceNGN: true },
          },
        },
      },
    },
  })

  // Send email notification (best-effort, don't fail if email fails)
  try {
    const { sendOrderStatusUpdate } = await import("@/emails/sendOrderStatusUpdate")
    await sendOrderStatusUpdate(order, status)
  } catch (error) {
    console.error("Failed to send order status update email:", error)
  }

  // Create admin notification for status changes
  try {
    await prisma.notification.create({
      data: {
        type: `ORDER_${status}`,
        title: `Order ${status.toLowerCase()}`,
        message: `Order #${order.reference || order.id.slice(0, 8)} is now ${status.toLowerCase()}`,
        orderId: order.id,
      },
    })
  } catch (error) {
    console.error("Failed to create notification:", error)
  }

  return order
}
