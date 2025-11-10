// app/api/auth/[...nextauth]/route.ts
import { handlers } from '@/lib/auth'

// bcrypt needs Node runtime (not Edge), otherwise you get 500s.
export const runtime = 'nodejs'

// Correctly re-export the route handlers from NextAuth v5
export const { GET, POST } = handlers
