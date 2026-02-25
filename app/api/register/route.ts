import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { toSafeAuthErrorMessage } from '@/lib/prisma-error'

function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 10).toUpperCase()
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, name, referredBy } = await req.json()
    if (!email || !password) return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    const exists = await prisma.user.findUnique({ where: { email } })
    if (exists) return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    const hash = await bcrypt.hash(password, 10)

    // Validate referral code if provided
    let referrerId: string | undefined
    if (referredBy) {
      const referrer = await prisma.user.findUnique({ where: { referralCode: String(referredBy).toUpperCase() } })
      if (referrer) referrerId = referrer.id
    }

    // Generate unique referral code
    let referralCode = generateReferralCode()
    let attempts = 0
    while (attempts < 5) {
      const existing = await prisma.user.findUnique({ where: { referralCode } })
      if (!existing) break
      referralCode = generateReferralCode()
      attempts++
    }

    await prisma.user.create({ data: { email, name, passwordHash: hash, referralCode, referredBy: referrerId } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Register API error:', error)
    return NextResponse.json({ error: toSafeAuthErrorMessage(error) }, { status: 500 })
  }
}
