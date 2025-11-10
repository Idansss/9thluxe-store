"use client"

import { useState } from 'react'
import { Mail, Gift } from 'lucide-react'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    // Here you would typically send to your backend/email service
    // For now, we'll simulate a success after 1 second
    setTimeout(() => {
      setStatus('success')
      setEmail('')
      setTimeout(() => setStatus('idle'), 3000)
    }, 1000)
  }

  if (status === 'success') {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
          <Gift className="h-6 w-6 text-emerald-600" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-foreground">Check your email!</h3>
        <p className="text-sm text-muted-foreground">
          We&apos;ve sent you a 10% off discount code.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          <Mail className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Newsletter</h3>
          <p className="text-sm text-muted-foreground">Get 10% off your first order</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {status === 'loading' ? '...' : 'Subscribe'}
        </button>
      </form>
    </div>
  )
}



