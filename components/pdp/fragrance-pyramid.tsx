"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { Reveal } from "./reveal"
import { trackPdp } from "@/lib/analytics/pdp-events"
import type { PdpNote } from "@/lib/pdp/types"

interface Tier {
  key: "top" | "heart" | "base"
  label: string
  window: string
  notes: PdpNote[]
  width: string
}

/**
 * Interactive top/heart/base pyramid. Each note is a link that explores other products containing it
 * (URL-driven /shop?note=). Accessible text fallback is the note names themselves; motion is a gentle
 * staggered reveal that is instant under reduced motion (handled inside <Reveal>).
 */
export function FragrancePyramid({
  productId,
  notesTop,
  notesHeart,
  notesBase,
}: {
  productId: string
  notesTop: PdpNote[]
  notesHeart: PdpNote[]
  notesBase: PdpNote[]
}) {
  const allTiers: Tier[] = [
    { key: "top", label: "Top notes", window: "First impression · 0–15 min", notes: notesTop, width: "w-[62%]" },
    { key: "heart", label: "Heart notes", window: "The character · 15 min–2 hrs", notes: notesHeart, width: "w-[80%]" },
    { key: "base", label: "Base notes", window: "The signature · lingers", notes: notesBase, width: "w-full" },
  ]
  const tiers = allTiers.filter((t) => t.notes.length > 0)

  if (tiers.length === 0) return null

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-3">
      {tiers.map((tier, i) => (
        <Reveal key={tier.key} delay={i * 80} className={cn("flex justify-center", tier.width)}>
          <div className="w-full rounded-xl border border-border bg-card/80 px-5 py-4 text-center shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">{tier.label}</p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {tier.notes.map((note) => (
                <Note key={note.slug} note={note} productId={productId} />
              ))}
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">{tier.window}</p>
          </div>
        </Reveal>
      ))}
    </div>
  )
}

function Note({ note, productId }: { note: PdpNote; productId: string }) {
  return (
    <Link
      href={`/shop?note=${encodeURIComponent(note.slug)}`}
      onClick={() => trackPdp("note_selected", { productId, note: note.slug })}
      className="group inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      title={`Explore other fragrances with ${note.name}`}
    >
      {note.name}
      <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
    </Link>
  )
}
