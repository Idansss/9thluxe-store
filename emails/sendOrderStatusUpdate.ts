import { Resend } from "resend"
import { OrderStatus } from "@prisma/client"

const resend = new Resend(process.env.RESEND_API_KEY)

type OrderLike = {
  id: string
  reference: string | null
  status: OrderStatus
  totalNGN: number
  user: { email: string; name: string | null }
  items: Array<{
    quantity: number
    product: { name: string; priceNGN: number }
  }>
}

export async function sendOrderStatusUpdate(order: OrderLike, newStatus: OrderStatus) {
  if (!process.env.RESEND_API_KEY) {
    console.log("[EMAIL] Order status update (no API key):", {
      to: order.user.email,
      status: newStatus,
      orderId: order.reference || order.id,
    })
    return
  }

  const statusMessages: Record<OrderStatus, { subject: string; message: string }> = {
    PENDING: {
      subject: "Order Received",
      message: "We've received your order and are processing it.",
    },
    PAID: {
      subject: "Payment Confirmed",
      message: "Your payment has been confirmed. We're preparing your order for shipment.",
    },
    SHIPPED: {
      subject: "Order Shipped",
      message: "Great news! Your order has been shipped and is on its way to you.",
    },
    DELIVERED: {
      subject: "Order Delivered",
      message: "Your order has been delivered. Thank you for shopping with Fàdè!",
    },
  }

  const statusInfo = statusMessages[newStatus]
  const orderRef = order.reference || order.id.slice(0, 8)

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #2f3e33; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-family: serif;">Fàdè Essence</h1>
        </div>
        <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #2f3e33; margin-top: 0;">${statusInfo.subject}</h2>
          <p>Hello ${order.user.name || "Customer"},</p>
          <p>${statusInfo.message}</p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>Order Reference:</strong> ${orderRef}</p>
            <p style="margin: 0 0 10px 0;"><strong>Status:</strong> ${newStatus}</p>
            <p style="margin: 0 0 10px 0;"><strong>Total:</strong> ₦${order.totalNGN.toLocaleString()}</p>
          </div>

          <p>You can track your order status in your account dashboard.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
            <p>Thank you for shopping with Fàdè Essence</p>
            <p>If you have any questions, contact us at fadeessencee@gmail.com</p>
          </div>
        </div>
      </body>
    </html>
  `

  try {
    await resend.emails.send({
      from: process.env.NEWSLETTER_FROM_EMAIL || "Fàdè Essence <onboarding@resend.dev>",
      to: order.user.email,
      subject: `${statusInfo.subject} - Order #${orderRef}`,
      html,
    })
    console.log("[EMAIL] Order status update sent:", order.user.email, newStatus)
  } catch (error) {
    console.error("[EMAIL] Failed to send order status update:", error)
    throw error
  }
}

