import crypto from "crypto"

export interface CheckoutFingerprintInput {
  addressLine1: string
  city: string
  state: string
  phone: string
  items: Array<{ productId: string; quantity: number }>
  couponCode?: string | null
  deliveryMethod: "standard" | "express"
  isGift: boolean
  giftMessage?: string | null
  giftWrapping: boolean
  paymentMethod: "CARD" | "BANK_TRANSFER"
}

export function isValidIdempotencyKey(value: string | null): value is string {
  return Boolean(value && /^[A-Za-z0-9_-]{16,128}$/.test(value))
}

/** Hash only fields that affect the resulting order; browser-supplied display totals are excluded. */
export function checkoutRequestHash(input: CheckoutFingerprintInput): string {
  const canonical = {
    addressLine1: input.addressLine1.trim(),
    city: input.city.trim(),
    state: input.state.trim(),
    phone: input.phone.trim(),
    items: input.items
      .map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }))
      .sort((a, b) => a.productId.localeCompare(b.productId)),
    couponCode: input.couponCode?.trim().toUpperCase() || null,
    deliveryMethod: input.deliveryMethod,
    isGift: input.isGift,
    giftMessage: input.giftMessage?.trim() || null,
    giftWrapping: input.giftWrapping,
    paymentMethod: input.paymentMethod,
  }
  return crypto.createHash("sha256").update(JSON.stringify(canonical)).digest("hex")
}
