import { z } from "zod"
import { NIGERIAN_STATES } from "@/lib/constants/nigerian-states"

export const addressFormSchema = z.object({
  name: z.string().min(1, "Full name is required").max(200),
  address: z.string().min(1, "Address line is required").max(500),
  city: z.string().min(1, "City is required").max(100),
  state: z.enum(NIGERIAN_STATES as unknown as [string, ...string[]], {
    message: "Please select a state",
  }),
  postalCode: z.string().max(20).optional().or(z.literal("")),
  phone: z
    .string()
    .min(10, "Enter a valid phone number (at least 10 digits)")
    .max(20)
    .regex(/^[\d\s+\-()]+$/, "Invalid phone format"),
  isDefault: z.boolean().optional().default(false),
})

export type AddressFormValues = z.infer<typeof addressFormSchema>
