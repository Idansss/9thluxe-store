import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json()
  if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
  const exists = await prisma.user.findUnique({ where: { email } })
  if (exists) return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
  const hash = await bcrypt.hash(password, 10)
  await prisma.user.create({ data: { email, name, passwordHash: hash } })
  return NextResponse.json({ ok: true })
}
