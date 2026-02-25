"use client"

import { useEffect } from "react"
import { useCartStore } from "@/lib/stores/cart-store"

/** Hydrates cart store from server cookie (GET /api/cart/summary). Single source of truth. */
export function CartHydrator() {
  const syncFromServer = useCartStore((s) => s.syncFromServer)
  useEffect(() => {
    syncFromServer()
  }, [syncFromServer])
  return null
}
