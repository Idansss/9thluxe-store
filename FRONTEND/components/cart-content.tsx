"use client"

import Image from "next/image"
import Link from "next/link"
import { Trash2, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { formatPrice } from "@/lib/format"
import { useCartStore } from "@/lib/cart-store"
import { useState } from "react"

export function CartContent() {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore()
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setUpdatingId(id)
    updateQuantity(id, newQuantity)
    setTimeout(() => setUpdatingId(null), 300)
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center">
        <h2 className="mb-2 text-xl font-semibold">Your cart is empty</h2>
        <p className="mb-6 text-sm text-muted-foreground">Add some products to get started.</p>
        <Link href="/">
          <Button>Continue shopping</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Cart Items */}
      <div className="space-y-4 lg:col-span-2">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 rounded-xl border border-border bg-card p-4">
            {/* Image */}
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
              <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
            </div>

            {/* Details */}
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{item.brand}</p>
                <h3 className="text-base font-medium">{item.name}</h3>
                <p className="mt-1 text-sm font-semibold">{formatPrice(item.price)}</p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="h-8 w-8"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, Number.parseInt(e.target.value) || 1)}
                    className="h-8 w-16 text-center text-sm"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    className="h-8 w-8"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.id)}
                  className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Subtotal */}
            <div className="text-right">
              <p className="text-base font-semibold">{formatPrice(item.price * item.quantity)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="lg:col-span-1">
        <div className="sticky top-24 space-y-4 rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-semibold">Order Summary</h2>

          <div className="space-y-2 border-t border-border pt-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">{formatPrice(getTotalPrice())}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">Calculated at checkout</span>
            </div>
          </div>

          <div className="flex justify-between border-t border-border pt-4 text-lg font-bold">
            <span>Total</span>
            <span>{formatPrice(getTotalPrice())}</span>
          </div>

          <Link href="/checkout" className="block">
            <Button size="lg" className="w-full rounded-xl">
              Checkout
            </Button>
          </Link>

          <Button variant="outline" onClick={clearCart} className="w-full bg-transparent">
            Clear cart
          </Button>

          <Link href="/" className="block text-center text-sm text-muted-foreground underline hover:text-foreground">
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
