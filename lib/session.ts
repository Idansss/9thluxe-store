// lib/session.ts
import { auth } from '@/lib/auth'        // ✅ use your own NextAuth export
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export type SessionUser = {
  id: string
  name: string | null
  email: string
  role: "USER" | "ADMIN"
}

/**
 * Require an authenticated user. If not signed in, redirect to /auth/signin.
 * Returns the user from your DB (so you have a stable id).
 */
export async function requireUser(): Promise<SessionUser> {
  const session = await auth()
  const email = session?.user?.email
  if (!email) {
    // send them to signin and come back to /account after login
    redirect('/auth/signin?callbackUrl=/account')
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, role: true },
  })

  if (!user) {
    redirect('/auth/signin?callbackUrl=/account')
  }

  return user!
}
