"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { addressFormSchema, type AddressFormValues } from "@/lib/validations/address"
import { NIGERIAN_STATES } from "@/lib/constants/nigerian-states"

export interface AddressFormPayload {
  name: string
  address: string
  city: string
  state: string
  postalCode?: string
  phone: string
  isDefault: boolean
}

interface AddressFormProps {
  defaultValues?: Partial<AddressFormValues>
  onSubmit: (data: AddressFormPayload) => Promise<void>
  submitLabel?: string
  onCancel?: () => void
  cancelLabel?: string
}

export function AddressForm({
  defaultValues,
  onSubmit,
  submitLabel = "Save Address",
  onCancel,
  cancelLabel = "Cancel",
}: AddressFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      name: "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      phone: "",
      isDefault: false,
      ...defaultValues,
    },
  })

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsSubmitting(true)
    try {
      await onSubmit({
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode || undefined,
        phone: data.phone,
        isDefault: data.isDefault ?? false,
      })
    } finally {
      setIsSubmitting(false)
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Address Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              {...form.register("name")}
              placeholder="e.g. John Doe"
              className={form.formState.errors.name ? "border-destructive" : ""}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address Line</Label>
            <Input
              id="address"
              {...form.register("address")}
              placeholder="Street, building, area"
              className={form.formState.errors.address ? "border-destructive" : ""}
            />
            {form.formState.errors.address && (
              <p className="text-sm text-destructive">{form.formState.errors.address.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                {...form.register("city")}
                placeholder="e.g. Lagos"
                className={form.formState.errors.city ? "border-destructive" : ""}
              />
              {form.formState.errors.city && (
                <p className="text-sm text-destructive">{form.formState.errors.city.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Select
                value={form.watch("state")}
                onValueChange={(value) => form.setValue("state", value)}
              >
                <SelectTrigger
                  id="state"
                  className={form.formState.errors.state ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {NIGERIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.state && (
                <p className="text-sm text-destructive">{form.formState.errors.state.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal Code (optional)</Label>
            <Input
              id="postalCode"
              {...form.register("postalCode")}
              placeholder="e.g. 100001"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              {...form.register("phone")}
              placeholder="e.g. 08012345678 or +234 801 234 5678"
              className={form.formState.errors.phone ? "border-destructive" : ""}
            />
            {form.formState.errors.phone && (
              <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDefault"
              checked={form.watch("isDefault")}
              onCheckedChange={(checked) => form.setValue("isDefault", checked === true)}
            />
            <Label htmlFor="isDefault" className="text-sm font-normal cursor-pointer">
              Set as default address
            </Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : submitLabel}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                {cancelLabel}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
