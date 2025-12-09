import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CheckoutFormData {
  // Contact Information
  firstName: string
  lastName: string
  email: string
  phone: string

  // Shipping Address
  address: string
  address2: string
  city: string
  state: string
  postalCode: string

  // Delivery Method
  deliveryMethod: "standard" | "express"
}

interface CheckoutStore {
  formData: CheckoutFormData
  updateFormData: (data: Partial<CheckoutFormData>) => void
  clearFormData: () => void
}

const defaultFormData: CheckoutFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  address2: "",
  city: "",
  state: "",
  postalCode: "",
  deliveryMethod: "express",
}

export const useCheckoutStore = create<CheckoutStore>()(
  persist(
    (set) => ({
      formData: defaultFormData,
      updateFormData: (data) => {
        set((state) => ({
          formData: { ...state.formData, ...data },
        }))
      },
      clearFormData: () => {
        set({ formData: defaultFormData })
      },
    }),
    {
      name: "fade-checkout-storage",
    },
  ),
)

