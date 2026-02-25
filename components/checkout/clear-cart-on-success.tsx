"use client"

import { useEffect, useRef } from "react"
import { useCartStore } from "@/lib/stores/cart-store"

/** Clears server cart and store when mounted (e.g. on checkout success page). */
export function ClearCartOnSuccess() {
  const done = useRef(false)
  useEffect(() => {
    if (done.current) return
    done.current = true
    const clear = async () => {
      try {
        await fetch("/api/cart/clear", { method: "POST", credentials: "include" })
        useCartStore.getState().syncFromServer()
      } catch {
        useCartStore.getState().clearCart()
      }
    }
    clear()
  }, [])
  return null
}
