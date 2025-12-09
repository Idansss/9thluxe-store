import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (!email.includes("@")) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 })
    }

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
  } catch (error: any) {
    console.error("Contact form error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to send message. Please try again." },
      { status: 500 },
    )
  }
}

