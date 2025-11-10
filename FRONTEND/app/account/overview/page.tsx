import { Package, Heart, MapPin, Clock } from "lucide-react"

export default function AccountOverviewPage() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-muted-foreground">Total Orders</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
              <Clock className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">3</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
              <Heart className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">8</p>
              <p className="text-xs text-muted-foreground">Wishlist Items</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold">2</p>
              <p className="text-xs text-muted-foreground">Saved Addresses</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100">
              <Package className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Order #9TL-2024-001 delivered</p>
              <p className="text-xs text-muted-foreground">2 days ago</p>
            </div>
          </div>
          <div className="flex items-start gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
              <Package className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Order #9TL-2024-002 shipped</p>
              <p className="text-xs text-muted-foreground">5 days ago</p>
            </div>
          </div>
          <div className="flex items-start gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
              <Heart className="h-4 w-4 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Added 3 items to wishlist</p>
              <p className="text-xs text-muted-foreground">1 week ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
