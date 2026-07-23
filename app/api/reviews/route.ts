import crypto from "node:crypto"

import { NextRequest, NextResponse } from "next/server"
import type { Prisma } from "@prisma/client"
import { z } from "zod"

import { auth } from "@/lib/auth"
import { clientIp, consumeRateLimit } from "@/lib/middleware/limiter"
import { logger } from "@/lib/observability/logger"
import { prisma } from "@/lib/prisma"
import { findVerifyingOrder } from "@/lib/reviews/verify"
import { hasTrustedOrigin } from "@/lib/security/origin"

export const runtime = "nodejs"

const reviewSchema = z.object({
  productId: z.string().trim().min(1).max(100),
  rating: z.coerce.number().int().min(1).max(5),
  comment: z.string().trim().max(2000).optional(),
  displayName: z.string().trim().max(80).optional(),
  tag: z.string().trim().max(40).optional(),
}).strict()

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get("productId")
  if (!productId) {
    return NextResponse.json({ reviews: [] })
  }

  const filter = request.nextUrl.searchParams.get("filter") || "recent"
  const orderBy: Prisma.ReviewOrderByWithRelationInput[] =
    filter === "highest"
      ? [{ rating: "desc" }, { createdAt: "desc" }]
      : filter === "lowest"
        ? [{ rating: "asc" }, { createdAt: "desc" }]
        : [{ createdAt: "desc" }]

  const reviews = await prisma.review.findMany({
    where: { productId, approved: true },
    orderBy,
    take: 25,
    include: { user: { select: { name: true } } },
  })

  return NextResponse.json({ reviews })
}

export async function POST(request: NextRequest) {
  try {
    if (!hasTrustedOrigin(request)) {
      return NextResponse.json(
        { success: false, error: "Request origin could not be verified" },
        { status: 403 },
      )
    }

    const session = await auth()
    const email = session?.user?.email
    if (!email) {
      return NextResponse.json(
        { success: false, error: "You must sign in to submit a review." },
        { status: 401 },
      )
    }

    const emailHash = crypto
      .createHash("sha256")
      .update(email.toLowerCase())
      .digest("hex")
    const limit = await consumeRateLimit(
      `review-submit:user:${emailHash}:ip:${clientIp(request)}`,
      5,
      60 * 60 * 1000,
    )
    if (!limit.ok) {
      return NextResponse.json(
        { success: false, error: "Too many review attempts. Try again later." },
        { status: 429 },
      )
    }

    const parsed = reviewSchema.safeParse(await request.json())
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Product ID and rating (1-5) are required.",
        },
        { status: 400 },
      )
    }

    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      select: { id: true, name: true },
    })
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User account not found" },
        { status: 404 },
      )
    }

    const orderId = await findVerifyingOrder(user.id, parsed.data.productId)
    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          error: "Only verified purchasers can review this product.",
        },
        { status: 403 },
      )
    }

    const existing = await prisma.review.findFirst({
      where: {
        userId: user.id,
        productId: parsed.data.productId,
      },
      select: { id: true },
    })
    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: "You have already reviewed this product.",
        },
        { status: 409 },
      )
    }

    await prisma.review.create({
      data: {
        userId: user.id,
        productId: parsed.data.productId,
        orderId,
        verifiedPurchase: true,
        rating: parsed.data.rating,
        comment: parsed.data.comment || null,
        approved: true,
        moderationStatus: "PENDING",
        displayName: parsed.data.displayName || user.name || undefined,
        tag: parsed.data.tag || undefined,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "You have already reviewed this product.",
        },
        { status: 409 },
      )
    }
    logger.error("review_creation_failed", { internal: String(error) })
    return NextResponse.json(
      { success: false, error: "Unable to store review" },
      { status: 500 },
    )
  }
}
