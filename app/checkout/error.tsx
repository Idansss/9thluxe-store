"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="mx-auto flex min-h-[40vh] max-w-lg flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="text-xl font-semibold text-foreground">Checkout error</h1>
      <p className="text-sm text-muted-foreground">
        Something went wrong. Your cart is safe. Please try again or contact us if it persists.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/cart">View cart</Link>
        </Button>
      </div>
    </main>
  )
}
