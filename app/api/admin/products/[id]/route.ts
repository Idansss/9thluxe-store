import { NextRequest, NextResponse } from "next/server"

import { requireAdmin } from "@/lib/admin"
import { deleteProduct } from "@/lib/services/product-service"

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireAdmin()

    const { id } = await params
    await deleteProduct(id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete product error:", error)
    
    // Return user-friendly error message
    const errorMessage = error instanceof Error 
      ? error.message 
      : "Failed to delete product"
    
    return NextResponse.json(
      { error: errorMessage },
      { status: error instanceof Error && error.message.includes("Cannot delete") ? 400 : 500 }
    )
  }
}


