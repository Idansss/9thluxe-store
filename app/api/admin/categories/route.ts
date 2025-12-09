import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/admin"
import { ProductCategory } from "@prisma/client"

export const runtime = "nodejs"

// GET - List all categories
export async function GET() {
  try {
    await requireAdmin()

    const categories = await prisma.category.findMany({
      orderBy: { name: "asc" },
    })

    const results = await Promise.all(
      categories.map(async (category) => {
        let productCount = 0
        if (category.enumKey) {
          productCount = await prisma.product.count({
            where: { category: category.enumKey },
          })
        }
        return { ...category, productCount }
      })
    )

    return NextResponse.json({ categories: results })
  } catch (error) {
    console.error("Get categories error:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

// POST - Create category
export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const { name, slug, description, enumKey } = await request.json()

    if (!name || !slug) {
      return NextResponse.json({ error: "Name and slug are required" }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        enumKey: enumKey ? (enumKey as ProductCategory) : null,
      },
    })

    return NextResponse.json({ category })
  } catch (error: any) {
    console.error("Create category error:", error)
    if (error.code === "P2002") {
      return NextResponse.json({ error: "A category with this slug already exists" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}

