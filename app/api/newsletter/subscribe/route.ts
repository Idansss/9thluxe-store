import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { rateLimit } from "@/lib/middleware/rate-limit"
import { emailSchema, validateAndSanitize } from "@/lib/middleware/validate-input"
import { z } from "zod"

const subscribeSchema = z.object({ email: emailSchema })

function getClientId(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "anonymous"
}

export async function POST(req: NextRequest) {
  try {
    if (!rateLimit(getClientId(req), 5, 60 * 1000)) {
      return NextResponse.json({ error: "Too many requests. Try again later." }, { status: 429 })
    }

    const body = await req.json()
    const validated = validateAndSanitize(subscribeSchema, body)
    if (!validated.success) {
      return NextResponse.json({ error: validated.error }, { status: 400 })
    }
    const { email } = validated.data

    // Check if email already exists
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email: email.toLowerCase().trim() },
    })

    if (existing) {
      return NextResponse.json(
        { message: "You're already subscribed!", alreadySubscribed: true },
        { status: 200 },
      )
    }

    // Create new subscriber
    await prisma.newsletterSubscriber.create({
      data: {
        email: email.toLowerCase().trim(),
        subscribedAt: new Date(),
      },
    })

    return NextResponse.json({ message: "Successfully subscribed to newsletter!" }, { status: 200 })
  } catch {
    return NextResponse.json({ error: "Failed to subscribe. Please try again." }, { status: 500 })
  }
}

