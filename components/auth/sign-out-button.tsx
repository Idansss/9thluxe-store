"use client"

import { useRouter } from "next/navigation"
import { clearAllStores } from "@/lib/stores/clear-all-stores"
import { Button } from "@/components/ui/button"
import { signOutAction } from "@/app/auth/signout/actions"

interface SignOutButtonProps {
  redirectTo?: string
  className?: string
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary"
  children?: React.ReactNode
}

export function SignOutButton({ 
  redirectTo = "/", 
  className,
  variant = "outline",
  children = "Sign out"
}: SignOutButtonProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      // Clear all client-side stores first
      clearAllStores()
      // Use current origin so logout stays on same site (avoids redirect to localhost when NEXTAUTH_URL is localhost)
      const base = typeof window !== "undefined" ? window.location.origin : ""
      const to = base ? `${base}${redirectTo.startsWith("/") ? redirectTo : `/${redirectTo}`}` : redirectTo
      await signOutAction(to)
    } catch (error: any) {
      // NextAuth redirects throw errors, which is expected
      // If it's a redirect error, the redirect will happen automatically
      if (!error?.digest?.startsWith("NEXT_REDIRECT")) {
        console.error("Sign out error:", error)
        // If redirect doesn't happen, manually redirect
        router.push(redirectTo)
        router.refresh()
      }
    }
  }

  return (
    <Button 
      variant={variant}
      className={className || "btn-outline"}
      onClick={handleSignOut}
      type="button"
    >
      {children}
    </Button>
  )
}

