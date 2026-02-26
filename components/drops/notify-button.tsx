"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell } from "lucide-react"
import { toast } from "sonner"

interface NotifyButtonProps {
  productSlug: string
}

export function NotifyButton({ productSlug }: NotifyButtonProps) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/drops/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, productSlug }),
      })
      if (!res.ok) throw new Error()
      setDone(true)
      toast.success("You're on the list!", {
        description: "We'll email you when this fragrance drops.",
      })
    } catch {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return <p className="text-sm font-medium text-green-600">You&apos;re on the list</p>
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-2 bg-transparent">
        <Bell className="h-4 w-4" />
        Notify me when it drops
      </Button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <Input
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={loading}
        className="h-9 text-sm"
      />
      <Button type="submit" size="sm" disabled={loading || !email} className="shrink-0">
        {loading ? "..." : "Notify me"}
      </Button>
    </form>
  )
}
