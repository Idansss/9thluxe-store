import { prisma } from "@/lib/prisma"

export async function getAddressesByUserId(userId: string) {
  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  })

  return addresses
}

