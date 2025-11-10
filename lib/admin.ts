// lib/admin.ts
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function requireAdmin() {
  const session = await auth()
  const email = session?.user?.email?.toLowerCase()
  const admins = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean)

  if (!email || !admins.includes(email)) {
    redirect('/auth/signin')
  }
  return { email }
}
