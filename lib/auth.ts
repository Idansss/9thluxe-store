// lib/auth.ts
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const credsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  rememberMe: z.string().optional(),
})

// Dynamic session maxAge: set in authorize, read by session config (remember me = 30 days, else 24h)
let dynamicSessionMaxAge = 30 * 24 * 60 * 60 // default 30 days

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: {
    strategy: 'jwt',
    get maxAge() {
      return dynamicSessionMaxAge
    },
  },
  trustHost: true,
  debug: process.env.NODE_ENV !== 'production',
  secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        rememberMe: { label: 'Remember me', type: 'text' },
      },
      async authorize(credentials) {
        const parsed = credsSchema.safeParse(credentials)
        if (!parsed.success) return null
        const { email, password, rememberMe } = parsed.data

        // Set session duration before returning (used by session.maxAge getter)
        dynamicSessionMaxAge =
          rememberMe === 'true' ? 30 * 24 * 60 * 60 : 24 * 60 * 60 // 30 days vs 24 hours

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user || !user.passwordHash) return null

        const ok = await bcrypt.compare(password, user.passwordHash)
        if (!ok) return null

        return { id: user.id, email: user.email, name: user.name ?? user.email }
      },
    }),
  ],
})
