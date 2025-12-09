// lib/admin.ts
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function requireAdmin() {
  const session = await auth()
  const email = session?.user?.email

  // Unauthenticated: send to signin with callback back to admin
  if (!email) {
    redirect("/auth/signin?callbackUrl=/admin")
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  })

  // Non-admin: redirect to storefront with an error flag
  if (!user || user.role !== "ADMIN") {
    redirect("/?error=not-authorized")
  }

  return user
}
