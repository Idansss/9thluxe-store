import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await auth()
    const email = session?.user?.email

    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { enabled } = await request.json()

    await prisma.user.update({
      where: { email },
      data: { marketingEmails: enabled } as any,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to update preference:", error)
    return NextResponse.json({ error: "Failed to update preference" }, { status: 500 })
  }
}



