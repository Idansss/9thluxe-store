import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Settings</h2>

      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="mb-4 font-semibold">Notifications</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailNotifications">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive order updates via email</p>
            </div>
            <Switch id="emailNotifications" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="smsNotifications">SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive order updates via SMS</p>
            </div>
            <Switch id="smsNotifications" />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="promotions">Promotional Emails</Label>
              <p className="text-sm text-muted-foreground">Receive special offers and promotions</p>
            </div>
            <Switch id="promotions" defaultChecked />
          </div>
        </div>
      </div>
    </div>
  )
}
