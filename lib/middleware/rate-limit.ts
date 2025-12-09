// Simple in-memory rate limiter (for production, use Redis or similar)
const requests = new Map<string, { count: number; resetTime: number }>()

export function rateLimit(identifier: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now()
  const record = requests.get(identifier)

  if (!record || now > record.resetTime) {
    // Create new record or reset expired one
    requests.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    })
    return true
  }

  if (record.count >= maxRequests) {
    return false // Rate limit exceeded
  }

  // Increment count
  record.count++
  return true
}

// Clean up old entries periodically
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now()
    for (const [key, value] of requests.entries()) {
      if (now > value.resetTime) {
        requests.delete(key)
      }
    }
  }, 60000) // Clean up every minute
}

