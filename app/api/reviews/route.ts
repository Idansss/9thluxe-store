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

    // Get user ID from database
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true } })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    const userId = user.id

    const { productId, rating, comment } = await request.json()

    if (!productId || !rating || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 })
    }

    // Create the review
    const review = await prisma.review.create({
      data: {
        userId,
        productId,
        rating: parseInt(rating),
        comment: comment || null,
        approved: true,
      },
    })

    // Update product rating cache
    const allReviews = await prisma.review.findMany({
      where: { productId, approved: true },
    })

    const averageRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
    const ratingCount = allReviews.length

    await prisma.product.update({
      where: { id: productId },
      data: {
        ratingAvg: averageRating,
        ratingCount,
      },
    })

    return NextResponse.json({ success: true, review })
  } catch (error) {
    console.error("Review submission error:", error)
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 })
  }
}
