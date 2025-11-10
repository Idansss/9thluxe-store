import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Security Settings</h2>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 font-semibold">Change Password</h3>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input id="currentPassword" type="password" className="rounded-lg" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input id="newPassword" type="password" className="rounded-lg" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" className="rounded-lg" />
          </div>

          <Button type="submit" className="rounded-lg">
            Update Password
          </Button>
        </form>
      </div>
    </div>
  )
}
