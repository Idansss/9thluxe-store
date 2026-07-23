import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { clientIp, consumeRateLimit } from "@/lib/middleware/limiter"
import { emailSchema, validateAndSanitize } from "@/lib/middleware/validate-input"
import { hasTrustedOrigin } from "@/lib/security/origin"
import { z } from "zod"

const subscribeSchema = z.object({ email: emailSchema })

export async function POST(req: NextRequest) {
  try {
    if (!hasTrustedOrigin(req)) {
      return NextResponse.json(
        { error: "Request origin could not be verified" },
        { status: 403 },
      )
    }
    const limit = await consumeRateLimit(
      `newsletter-subscribe:ip:${clientIp(req)}`,
      5,
      60 * 60 * 1000,
    )
    if (!limit.ok) {
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
