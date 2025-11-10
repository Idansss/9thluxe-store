import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin } from "lucide-react"

const addresses = [
  {
    id: "1",
    name: "Home",
    addressLine: "123 Victoria Island",
    city: "Lagos",
    state: "Lagos State",
    phone: "+234 816 059 1348",
    isDefault: true,
  },
  {
    id: "2",
    name: "Office",
    addressLine: "45 Admiralty Way, Lekki Phase 1",
    city: "Lagos",
    state: "Lagos State",
    phone: "+234 816 059 1348",
    isDefault: false,
  },
]

export default function AddressesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Saved Addresses</h2>
        <Button>Add Address</Button>
      </div>

      <div className="space-y-4">
        {addresses.map((address) => (
          <div key={address.id} className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <p className="font-semibold">{address.name}</p>
                    {address.isDefault && (
                      <Badge className="bg-emerald-100 text-emerald-900 hover:bg-emerald-100">Default</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{address.addressLine}</p>
                  <p className="text-sm text-muted-foreground">
                    {address.city}, {address.state}
                  </p>
                  <p className="text-sm text-muted-foreground">{address.phone}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
