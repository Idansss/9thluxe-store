import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Profile Information</h2>

      <div className="rounded-xl border border-border bg-card p-6">
        <form className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" defaultValue="John" className="rounded-lg" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" defaultValue="Doe" className="rounded-lg" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="john@example.com" className="rounded-lg" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" type="tel" defaultValue="+234 816 059 1348" className="rounded-lg" />
          </div>

          <Button type="submit" className="rounded-lg">
            Save Changes
          </Button>
        </form>
      </div>
    </div>
  )
}
