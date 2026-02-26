import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const { email, productSlug } = await req.json()

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 })
    }

    // Upsert subscriber
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      create: { email },
      update: {},
    })

    // Increment notifyCount on the product
    if (productSlug && typeof productSlug === "string") {
      await prisma.product.updateMany({
        where: { slug: productSlug, deletedAt: null },
        data: { notifyCount: { increment: 1 } },
      })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("Drop notify error:", e)
    return NextResponse.json({ error: "Failed to register" }, { status: 500 })
  }
}
