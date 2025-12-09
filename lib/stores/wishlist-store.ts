"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Product } from "@/components/ui/product-card"

interface WishlistStore {
  items: Product[]
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  toggleItem: (product: Product) => void
  isInWishlist: (productId: string) => boolean
  getCount: () => number
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        set((state) => {
          if (state.items.find((item) => item.id === product.id)) {
            return state // Already in wishlist
          }
          return {
            items: [...state.items, product],
          }
        })
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }))
      },
      toggleItem: (product) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === product.id)
          if (existingItem) {
            return {
              items: state.items.filter((item) => item.id !== product.id),
            }
          }
          return {
            items: [...state.items, product],
          }
        })
      },
      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId)
      },
      getCount: () => {
        return get().items.length
      },
    }),
    {
      name: "fade-wishlist-storage",
    },
  ),
)

