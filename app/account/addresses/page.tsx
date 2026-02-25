"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, MapPin, Pencil, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type AddressItem = {
  id: string
  name: string
  address: string
  city: string
  state: string
  postalCode: string
  phone: string
  isDefault: boolean
}

export default function AddressesPage() {
  const router = useRouter()
  const [addresses, setAddresses] = React.useState<AddressItem[]>([])
  const [loading, setLoading] = React.useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [addressToDelete, setAddressToDelete] = React.useState<string | null>(null)
  const [deletingId, setDeletingId] = React.useState<string | null>(null)

  const fetchAddresses = React.useCallback(async () => {
    try {
      const res = await fetch("/api/account/addresses")
      if (res.status === 401) {
        router.push("/auth/signin?callbackUrl=/account/addresses")
        return
      }
      if (!res.ok) {
        toast.error("Failed to load addresses")
        return
      }
      const data = await res.json()
      setAddresses(data.addresses ?? [])
    } catch {
      toast.error("Failed to load addresses")
    } finally {
      setLoading(false)
    }
  }, [router])

  React.useEffect(() => {
    fetchAddresses()
  }, [fetchAddresses])

  const handleDelete = (addressId: string) => {
    setAddressToDelete(addressId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!addressToDelete) return
    setDeletingId(addressToDelete)
    try {
      const res = await fetch(`/api/account/addresses/${addressToDelete}`, { method: "DELETE" })
      if (!res.ok) {
        toast.error("Failed to delete address")
        return
      }
      setAddresses((prev) => prev.filter((a) => a.id !== addressToDelete))
      toast.success("Address deleted", {
        description: "The address has been removed from your saved addresses.",
      })
      setDeleteDialogOpen(false)
      setAddressToDelete(null)
    } catch {
      toast.error("Failed to delete address")
    } finally {
      setDeletingId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between">
          <div className="h-8 w-40 animate-pulse rounded bg-muted" />
          <div className="h-9 w-32 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Saved Addresses</h2>
        <Button size="sm" asChild>
          <Link href="/account/addresses/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Address
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((address) => (
          <Card key={address.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{address.name || "Address"}</span>
                </div>
                {address.isDefault && <Badge variant="secondary">Default</Badge>}
              </div>

              <div className="text-sm text-muted-foreground space-y-1">
                <p>{address.address}</p>
                <p>
                  {address.city}, {address.state}
                  {address.postalCode ? ` ${address.postalCode}` : ""}
                </p>
                <p>{address.phone}</p>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent"
                  onClick={() => router.push(`/account/addresses/${address.id}/edit`)}
                >
                  <Pencil className="h-3 w-3 mr-1" />
                  Edit
                </Button>
                {!address.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => handleDelete(address.id)}
                    disabled={deletingId === address.id}
                  >
                    <Trash2 className="h-3 w-3 mr-1" />
                    Delete
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {addresses.length === 0 && !loading && (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p className="mb-4">You don&apos;t have any saved addresses yet.</p>
            <Button asChild>
              <Link href="/account/addresses/new">Add your first address</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Address?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this address? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAddressToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={!!deletingId}
            >
              {deletingId ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
