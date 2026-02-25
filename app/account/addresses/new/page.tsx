"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { AddressForm } from "@/components/account/address-form"

export default function NewAddressPage() {
  const router = useRouter()

  const handleSubmit = async (data: Parameters<Parameters<typeof AddressForm>[0]["onSubmit"]>[0]) => {
    const res = await fetch("/api/account/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode || null,
        phone: data.phone,
        isDefault: data.isDefault,
      }),
    })

    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      throw new Error(err.error || "Failed to save address")
    }

    toast.success("Address added", {
      description: "Your new address has been saved.",
    })
    router.push("/account/addresses")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/account/addresses">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="font-serif text-2xl font-semibold">Add New Address</h1>
      </div>

      <AddressForm
        onSubmit={handleSubmit}
        submitLabel="Save Address"
        onCancel={() => router.push("/account/addresses")}
        cancelLabel="Cancel"
      />
    </div>
  )
}
