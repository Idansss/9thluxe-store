"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { AddressForm } from "@/components/account/address-form"

type AddressApi = {
  id: string
  name: string
  address: string
  city: string
  state: string
  postalCode: string
  phone: string
  isDefault: boolean
}

export default function EditAddressPage() {
  const router = useRouter()
  const params = useParams()
  const addressId = params.id as string

  const [address, setAddress] = React.useState<AddressApi | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch(`/api/account/addresses/${addressId}`)
        if (!res.ok) {
          if (res.status === 404) setError("Address not found")
          else setError("Failed to load address")
          return
        }
        const data = await res.json()
        if (!cancelled) setAddress(data.address)
      } catch {
        if (!cancelled) setError("Failed to load address")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [addressId])

  const handleSubmit = async (data: Parameters<Parameters<typeof AddressForm>[0]["onSubmit"]>[0]) => {
    const res = await fetch(`/api/account/addresses/${addressId}`, {
      method: "PATCH",
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
      throw new Error(err.error || "Failed to update address")
    }

    toast.success("Address updated", {
      description: "Your address has been successfully updated.",
    })
    router.push("/account/addresses")
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 animate-pulse rounded bg-muted" />
        <div className="h-64 animate-pulse rounded-lg bg-muted" />
      </div>
    )
  }

  if (error || !address) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">{error ?? "Address not found"}</p>
        <Button asChild variant="outline">
          <Link href="/account/addresses">Back to Addresses</Link>
        </Button>
      </div>
    )
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
        <h1 className="font-serif text-2xl font-semibold">Edit Address</h1>
      </div>

      <AddressForm
        defaultValues={{
          name: address.name,
          address: address.address,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode || "",
          phone: address.phone,
          isDefault: address.isDefault,
        }}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        onCancel={() => router.push("/account/addresses")}
        cancelLabel="Cancel"
      />
    </div>
  )
}
