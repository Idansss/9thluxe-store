import { prisma } from "@/lib/prisma"
import { mapPrismaProductToCard } from "./products"

export async function getWishlistByUserId(userId: string) {
  const wishlists = await prisma.wishlist.findMany({
    where: { userId },
    include: {
      product: true,
    },
    orderBy: { createdAt: "desc" },
  })

  return wishlists.map((w) => mapPrismaProductToCard(w.product))
}

