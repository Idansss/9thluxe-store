import type { OrderStatus } from "@prisma/client"

const ADMIN_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  PENDING: ["CANCELLED"],
  PAID: ["SHIPPED"],
  SHIPPED: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
  REFUND_PENDING: [],
  REFUNDED: [],
}

export function allowedAdminOrderTransitions(
  current: OrderStatus,
): readonly OrderStatus[] {
  return ADMIN_TRANSITIONS[current]
}

export function canAdminTransitionOrder(
  current: OrderStatus,
  next: OrderStatus,
): boolean {
  return ADMIN_TRANSITIONS[current].includes(next)
}
