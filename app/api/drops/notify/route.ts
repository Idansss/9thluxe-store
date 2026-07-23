import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"

import { clientIp, consumeRateLimit } from "@/lib/middleware/limiter"
import { prisma } from "@/lib/prisma"
import { hasTrustedOrigin } from "@/lib/security/origin"

const notifySchema = z.object({
  email: z.string().trim().email().max(254),
  productSlug: z.string().trim().min(1).max(200).optional(),
}).strict()

export async function POST(req: NextRequest) {
  try {
    if (!hasTrustedOrigin(req)) {
      return NextResponse.json(
        { error: "Request origin could not be verified" },
        { status: 403 },
      )
    }
    const limit = await consumeRateLimit(
      `drop-notify:ip:${clientIp(req)}`,
      5,
      60 * 60 * 1000,
    )
    if (!limit.ok) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        { status: 429 },
      )
    }

    const parsed = notifySchema.safeParse(await req.json())
    if (!parsed.success) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 })
    }
    const email = parsed.data.email.toLowerCase()
    const productSlug = parsed.data.productSlug

    // Upsert subscriber
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      create: { email },
      update: {},
    })

    // Increment notifyCount on the product
    if (productSlug && typeof productSlug === "string") {
      await prisma.product.updateMany({
        where: {
          slug: productSlug,
          deletedAt: null,
          publishStatus: "PUBLISHED",
        },
        data: { notifyCount: { increment: 1 } },
      })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error("Drop notify error:", e)
    return NextResponse.json({ error: "Failed to register" }, { status: 500 })
  }
}
