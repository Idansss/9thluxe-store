"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Address {
  id: string
  name: string
  address: string
  city: string
  state: string
  postalCode: string
  phone: string
  isDefault: boolean
}

interface AddressStore {
  addresses: Address[]
  addAddress: (address: Omit<Address, "id">) => string
  updateAddress: (id: string, address: Partial<Address>) => void
  deleteAddress: (id: string) => void
  setDefaultAddress: (id: string) => void
  getAddress: (id: string) => Address | undefined
}

export const useAddressStore = create<AddressStore>()(
  persist(
    (set, get) => ({
      addresses: [
        {
          id: "1",
          name: "John Doe",
          address: "123 Victoria Island",
          city: "Lagos",
          state: "Lagos",
          postalCode: "100001",
          phone: "+234 8160591348",
          isDefault: true,
        },
        {
          id: "2",
          name: "John Doe",
          address: "456 Wuse Zone 5",
          city: "Abuja",
          state: "FCT",
          postalCode: "900001",
          phone: "+234 8160591348",
          isDefault: false,
        },
      ],
      addAddress: (address) => {
        const id = Date.now().toString()
        const newAddress: Address = { ...address, id }
        set((state) => {
          // If this is set as default, unset other defaults
          if (newAddress.isDefault) {
            return {
              addresses: state.addresses.map((a) => ({ ...a, isDefault: false })).concat(newAddress),
            }
          }
          return {
            addresses: [...state.addresses, newAddress],
          }
        })
        return id
      },
      updateAddress: (id, updates) => {
        set((state) => {
          // If setting as default, unset other defaults
          if (updates.isDefault === true) {
            return {
              addresses: state.addresses.map((a) => {
                if (a.id === id) {
                  return { ...a, ...updates }
                }
                return { ...a, isDefault: false }
              }),
            }
          }
          return {
            addresses: state.addresses.map((a) => (a.id === id ? { ...a, ...updates } : a)),
          }
        })
      },
      deleteAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.filter((a) => a.id !== id),
        }))
      },
      setDefaultAddress: (id) => {
        set((state) => ({
          addresses: state.addresses.map((a) => ({
            ...a,
            isDefault: a.id === id,
          })),
        }))
      },
      getAddress: (id) => {
        return get().addresses.find((a) => a.id === id)
      },
    }),
    {
      name: "fade-addresses-storage",
    },
  ),
)

