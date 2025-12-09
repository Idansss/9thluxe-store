"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  slug: string
  name: string
  brand: string
  price: number
  image: string
  quantity: number
}

interface CartStore {
  items: CartItem[]
  couponCode: string | null
  discount: number
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number, maxStock?: number) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number, maxStock?: number) => void
  clearCart: () => void
  applyCoupon: (code: string, subtotal: number) => boolean
  removeCoupon: () => void
  getTotalPrice: () => number
  getTotalItems: () => number
  getUniqueItemsCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      discount: 0,
      addItem: (item, quantity = 1, maxStock) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.id === item.id)
          const newQuantity = existingItem ? existingItem.quantity + quantity : quantity
          
          // Check stock limit
          if (maxStock !== undefined && newQuantity > maxStock) {
            // Don't add if exceeds stock
            return state
          }
          
          if (existingItem) {
            return {
              items: state.items.map((i) => 
                i.id === item.id 
                  ? { ...i, quantity: Math.min(newQuantity, maxStock || newQuantity) } 
                  : i
              ),
            }
          }
          return {
            items: [...state.items, { ...item, quantity: Math.min(quantity, maxStock || quantity) }],
          }
        })
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }))
      },
      updateQuantity: (id, quantity, maxStock) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set((state) => ({
          items: state.items.map((item) => 
            item.id === id 
              ? { ...item, quantity: maxStock !== undefined ? Math.min(quantity, maxStock) : quantity } 
              : item
          ),
        }))
      },
      clearCart: () => {
        set({ items: [], couponCode: null, discount: 0 })
      },
      applyCoupon: (code, subtotal) => {
        const upperCode = code.trim().toUpperCase()
        if (upperCode === "FADE10") {
          const newDiscount = subtotal * 0.1
          set({ couponCode: upperCode, discount: newDiscount })
          return true
        }
        return false
      },
      removeCoupon: () => {
        set({ couponCode: null, discount: 0 })
      },
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
      },
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },
      getUniqueItemsCount: () => {
        return get().items.length
      },
    }),
    {
      name: "fade-cart-storage",
    },
  ),
)

