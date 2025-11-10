import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    await requireAdmin()
    
    const { subject, html, text } = await request.json()
    
    if (!subject || !html) {
      return NextResponse.json(
        { error: 'Subject and HTML content are required' },
        { status: 400 }
      )
    }
    
    // Get all subscribers
    const subscribers = await prisma.user.findMany({
      where: { marketingEmails: true },
      select: { email: true, name: true }
    })
    
    if (subscribers.length === 0) {
      return NextResponse.json(
        { error: 'No subscribers found' },
        { status: 400 }
      )
    }
    
    // Send to each subscriber
    const results = await Promise.all(
      subscribers.map(user =>
        resend.emails.send({
          from: '9thLuxe <onboarding@resend.dev>', // Use Resend test domain until you verify your domain
          to: user.email,
          subject,
          html,
          text,
        }).catch(error => ({ error }))
      )
    )
    
    const successCount = results.filter(r => !r.error).length
    const failureCount = results.filter(r => r.error).length
    
    return NextResponse.json({ 
      success: true, 
      sent: successCount,
      failed: failureCount,
      total: subscribers.length
    })
  } catch (error) {
    console.error('Newsletter send error:', error)
    return NextResponse.json({ 
      error: 'Failed to send newsletter',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
