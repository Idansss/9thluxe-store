import { NextRequest, NextResponse } from "next/server"
import { rateLimit } from "@/lib/middleware/rate-limit"
import { emailSchema, nameSchema, validateAndSanitize } from "@/lib/middleware/validate-input"
import { z } from "zod"

const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  subject: z.string().min(1, "Subject is required").max(200),
  message: z.string().min(10, "Message too short").max(5000),
})

function getClientId(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "anonymous"
}

export async function POST(req: NextRequest) {
  try {
    if (!rateLimit(getClientId(req), 5, 60 * 1000)) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 })
    }

    const body = await req.json()
    const validated = validateAndSanitize(contactSchema, body)
    if (!validated.success) {
      return NextResponse.json({ error: validated.error }, { status: 400 })
    }
    const { name, email, subject, message } = validated.data

    // In a real application, you would:
    // 1. Save to database
    // 2. Send email notification
    // 3. Send confirmation email to user
    // For now, we'll just simulate success

    // TODO: Implement actual email sending and database storage
    // await prisma.contactMessage.create({ data: { name, email, subject, message } })
    // await sendEmail({ to: 'fadeessencee@gmail.com', subject, body: message })

    return NextResponse.json(
      {
        message: "Thank you for contacting us! We'll get back to you soon.",
      },
      { status: 200 },
    )
  } catch {
    return NextResponse.json({ error: "Failed to send message. Please try again." }, { status: 500 })
  }
}

