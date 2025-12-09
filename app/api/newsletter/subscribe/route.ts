import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

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
  } catch (error: any) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to subscribe. Please try again." },
      { status: 500 },
    )
  }
}

