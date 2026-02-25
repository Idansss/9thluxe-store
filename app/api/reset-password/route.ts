import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ 
        message: 'If an account exists for this email, a reset link has been sent.' 
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour from now

    // Store token in database
    await prisma.user.update({
      where: { email: email.toLowerCase() },
      data: {
        // Add these fields to your User model
        resetToken: resetToken,
        resetTokenExpiry: resetTokenExpiry,
      } as any,
    })

    // TODO: Send email with reset link (use Resend or your email provider)
    const base = process.env.NEXTAUTH_URL || process.env.APP_URL || 'http://localhost:3000'
    const resetUrl = `${base}/auth/reset/${resetToken}`
    // Do not log or expose the token. Send resetUrl via email only.
    const isDev = process.env.NODE_ENV !== 'production'
    return NextResponse.json({
      message: 'If an account exists for this email, a reset link has been sent.',
      ...(isDev && { resetLink: resetUrl }),
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to process reset request' },
      { status: 500 }
    )
  }
}
