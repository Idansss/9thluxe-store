"use client"

import * as React from "react"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import { Switch } from "@/components/ui/switch"

import { toast } from "sonner"

export default function SettingsPage() {

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const [isLoading, setIsLoading] = React.useState(true)

  const [formData, setFormData] = React.useState({

    firstName: "",

    lastName: "",

    email: "",

    phone: "",

    orderUpdates: true,

    promotionalEmails: true,

    wishlistAlerts: false,

  })



  React.useEffect(() => {

    async function loadSettings() {

      try {

        const response = await fetch("/api/account/settings")

        if (response.ok) {

          const data = await response.json()

          setFormData(data)

        } else if (response.status === 401) {

          // User is not authenticated
          toast.error("Authentication required", {

            description: "Please sign in to view your settings.",

          })

        }

      } catch (error) {

        console.error("Failed to load settings:", error)

        toast.error("Failed to load settings", {

          description: "Please refresh the page.",

        })

      } finally {

        setIsLoading(false)

      }

    }

    loadSettings()

  }, [])



  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    const { name, value, type, checked } = e.target

    setFormData((prev) => ({

      ...prev,

      [name]: type === "checkbox" ? checked : value,

    }))

  }



  const saveSettings = async (updates: Partial<typeof formData>) => {
    try {
      const response = await fetch("/api/account/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: updates.firstName ?? formData.firstName,
          lastName: updates.lastName ?? formData.lastName,
          phone: updates.phone ?? formData.phone,
          orderUpdates: updates.orderUpdates ?? formData.orderUpdates,
          promotionalEmails: updates.promotionalEmails ?? formData.promotionalEmails,
          wishlistAlerts: updates.wishlistAlerts ?? formData.wishlistAlerts,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Don't throw, just return false with error message
        console.error("Settings update failed:", data.error || "Unknown error")
        return { success: false, error: data.error || "Failed to update settings" }
      }

      return { success: true }
    } catch (error: any) {
      console.error("Failed to save settings:", error)
      return { success: false, error: error.message || "Network error occurred" }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const result = await saveSettings(formData)

    if (result.success) {
      toast.success("Settings updated", {
        description: "Your profile information has been saved successfully.",
      })
    } else {
      const errorMsg = result.error || "Please try again later."
      toast.error("Failed to update settings", {
        description: errorMsg === "Unauthorized" 
          ? "Please sign in to save your settings." 
          : errorMsg,
      })
    }

    setIsSubmitting(false)
  }

  const handleNotificationToggle = async (key: "orderUpdates" | "promotionalEmails" | "wishlistAlerts", checked: boolean) => {
    // Update local state immediately for responsive UI
    setFormData((prev) => ({ ...prev, [key]: checked }))

    // Save to database
    const result = await saveSettings({ [key]: checked })

    if (result.success) {
      toast.success("Notification preference updated", {
        description: `Your ${key.replace(/([A-Z])/g, " $1").toLowerCase()} preference has been saved.`,
      })
    } else {
      // Revert on error
      setFormData((prev) => ({ ...prev, [key]: !checked }))
      const errorMsg = result.error || "Please try again."
      toast.error("Failed to update preference", {
        description: errorMsg === "Unauthorized" 
          ? "Please sign in to save your preferences." 
          : errorMsg,
      })
    }
  }



  if (isLoading) {

    return (

      <div className="space-y-6">

        <Card>

          <CardContent className="pt-6">

            <div className="animate-pulse space-y-4">

              <div className="h-4 bg-muted rounded w-1/4"></div>

              <div className="h-10 bg-muted rounded"></div>

            </div>

          </CardContent>

        </Card>

      </div>

    )

  }



  return (

    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Profile Settings */}

      <Card>

        <CardHeader>

          <CardTitle className="text-lg">Profile Information</CardTitle>

          <CardDescription>Update your personal details</CardDescription>

        </CardHeader>

        <CardContent className="space-y-4 w-full min-w-0">

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="space-y-2">

              <Label htmlFor="firstName">First Name</Label>

              <Input

                id="firstName"

                name="firstName"

                value={formData.firstName}

                onChange={handleInputChange}

                required

              />

            </div>

            <div className="space-y-2">

              <Label htmlFor="lastName">Last Name</Label>

              <Input

                id="lastName"

                name="lastName"

                value={formData.lastName}

                onChange={handleInputChange}

                required

              />

            </div>

          </div>

          <div className="space-y-2 w-full min-w-0">

            <Label htmlFor="email">Email</Label>

            <Input

              id="email"

              name="email"

              type="email"

              value={formData.email}

              onChange={handleInputChange}

              disabled

              className="opacity-70 w-full min-w-0"

            />

          </div>

          <div className="space-y-2">

            <Label htmlFor="phone">Phone</Label>

            <Input

              id="phone"

              name="phone"

              type="tel"

              value={formData.phone}

              onChange={handleInputChange}

            />

          </div>

          <Button type="submit" disabled={isSubmitting}>

            {isSubmitting ? "Saving..." : "Save Changes"}

          </Button>

        </CardContent>

      </Card>



      {/* Notification Preferences */}

      <Card>

        <CardHeader>

          <CardTitle className="text-lg">Notifications</CardTitle>

          <CardDescription>Manage your notification preferences</CardDescription>

        </CardHeader>

        <CardContent className="space-y-4">

          <div className="flex items-center justify-between">

            <div>

              <p className="font-medium">Order Updates</p>

              <p className="text-sm text-muted-foreground">Receive updates about your orders</p>

            </div>

            <Switch

              checked={formData.orderUpdates}

              onCheckedChange={(checked) => handleNotificationToggle("orderUpdates", checked)}

            />

          </div>

          <div className="flex items-center justify-between">

            <div>

              <p className="font-medium">Promotional Emails</p>

              <p className="text-sm text-muted-foreground">Receive emails about new products and offers</p>

            </div>

            <Switch

              checked={formData.promotionalEmails}

              onCheckedChange={(checked) => handleNotificationToggle("promotionalEmails", checked)}

            />

          </div>

          <div className="flex items-center justify-between">

            <div>

              <p className="font-medium">Wishlist Alerts</p>

              <p className="text-sm text-muted-foreground">Get notified when wishlist items go on sale</p>

            </div>

            <Switch

              checked={formData.wishlistAlerts}

              onCheckedChange={(checked) => handleNotificationToggle("wishlistAlerts", checked)}

            />

          </div>

        </CardContent>

      </Card>

    </form>

  )

}
