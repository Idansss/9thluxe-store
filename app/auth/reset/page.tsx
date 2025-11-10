"use client"
import Link from 'next/link'
import { useState } from 'react'

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetLink, setResetLink] = useState('')

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to send reset email. Please try again.')
        return
      }

      // Store the reset link for development
      if (data.resetLink) {
        setResetLink(data.resetLink)
      }

      setSent(true)
    } catch (err) {
      setError('Failed to send reset email. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 card">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-foreground">Reset Your Password</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {sent ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              <p className="font-medium mb-1">Check your email</p>
              <p>
                If an account exists for <strong>{email}</strong>, a password reset link has been sent to your inbox.
              </p>
            </div>

            {/* Development: Show reset link */}
            {resetLink && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
                <p className="font-medium text-amber-800 mb-2">Development Mode - Reset Link:</p>
                <a 
                  href={resetLink} 
                  className="text-blue-600 hover:underline break-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {resetLink}
                </a>
              </div>
            )}
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-6">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input w-full mt-1"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading || sent}
              />
            </div>

            <div>
              <button 
                type="submit" 
                disabled={isLoading || sent} 
                className="btn w-full"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
          </form>
        )}

        <div className="text-center">
          <Link 
            href="/auth/signin" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

