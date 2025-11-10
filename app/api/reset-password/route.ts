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

    // TODO: Send email with reset link
    // For now, we'll return the link so it can be displayed in development
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3002'}/auth/reset/${resetToken}`
    console.log('Password reset link:', resetUrl)
    console.log('Token:', resetToken)

    return NextResponse.json({ 
      message: 'If an account exists for this email, a reset link has been sent.',
      resetLink: resetUrl // Include in development
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Failed to process reset request' },
      { status: 500 }
    )
  }
}
