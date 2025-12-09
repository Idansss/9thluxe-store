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

import { useAddressStore } from "@/lib/stores/address-store"



export default function AddressesPage() {
  const router = useRouter()
  const addresses = useAddressStore((state) => state.addresses)
  const deleteAddress = useAddressStore((state) => state.deleteAddress)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [addressToDelete, setAddressToDelete] = React.useState<string | null>(null)

  const handleDelete = (addressId: string) => {
    setAddressToDelete(addressId)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (addressToDelete) {
      deleteAddress(addressToDelete)
      toast.success("Address deleted", {
        description: "The address has been removed from your saved addresses.",
      })
      setDeleteDialogOpen(false)
      setAddressToDelete(null)
    }
  }

  const handleEdit = (addressId: string) => {
    router.push(`/account/addresses/${addressId}/edit`)
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

                  <span className="font-medium">{address.name}</span>

                </div>

                {address.isDefault && <Badge variant="secondary">Default</Badge>}

              </div>



              <div className="text-sm text-muted-foreground space-y-1">

                <p>{address.address}</p>

                <p>

                  {address.city}, {address.state} {address.postalCode}

                </p>

                <p>{address.phone}</p>

              </div>



              <div className="flex gap-2 mt-4">

                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent"
                  onClick={() => handleEdit(address.id)}
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

      {/* Delete Confirmation Dialog */}
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
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>

  )

}
