import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { mapPrismaProductToCard } from "@/lib/queries/products"

export const runtime = "nodejs"

/** GET /api/recommendations?notes=oud,vanilla&limit=6 - note-based product recommendations */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const notesParam = searchParams.get("notes")?.toLowerCase().trim() || ""
    const limit = Math.min(parseInt(searchParams.get("limit") || "6", 10) || 6, 20)
    const notes = notesParam
      ? notesParam.split(",").map((n) => n.trim()).filter(Boolean)
      : []

    if (notes.length === 0) {
      const products = await prisma.product.findMany({
        where: { deletedAt: null },
        orderBy: [{ ratingAvg: "desc" }, { createdAt: "desc" }],
        take: limit,
      })
      return NextResponse.json({
        products: products.map(mapPrismaProductToCard),
        source: "featured",
      })
    }

    const orConditions = notes.flatMap((note) => [
      { notesTop: { contains: note, mode: "insensitive" as const } },
      { notesHeart: { contains: note, mode: "insensitive" as const } },
      { notesBase: { contains: note, mode: "insensitive" as const } },
    ])

    const products = await prisma.product.findMany({
      where: {
        deletedAt: null,
        OR: orConditions,
      },
      orderBy: [{ ratingAvg: "desc" }, { createdAt: "desc" }],
      take: limit,
    })

    return NextResponse.json({
      products: products.map(mapPrismaProductToCard),
      source: "notes",
      notes,
    })
  } catch (error) {
    console.error("Recommendations error:", error)
    return NextResponse.json(
      { error: "Failed to load recommendations" },
      { status: 500 }
    )
  }
}
