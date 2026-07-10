"use client"

import * as React from "react"
import { Loader2 } from "lucide-react"
import { SmartProductCard } from "./smart-product-card"
import { PdpSection } from "./section"
import { trackPdp } from "@/lib/analytics/pdp-events"
import type { PdpCard } from "@/lib/pdp/types"

interface Seed {
  family: string | null
  notes: string[]
  occasion: string | null
  climate: string | null
  priceNGN: number
}

interface RecItem {
  product: {
    id: string
    slug: string
    name: string
    brand: string | null
    concentration: string | null
    price: { amountNGN: number }
    compareAtPrice: { amountNGN: number } | null
    images: string[]
    ratingAvg: number
    ratingCount: number
    fragranceFamily: string | null
    notesTop: string | null
    notesHeart: string | null
    inStock: boolean
  }
  reasons: string[]
  availability: "in_stock" | "preorder" | "waitlist"
}

function toCard(item: RecItem): PdpCard {
  const p = item.product
  const notes = [p.notesTop, p.notesHeart]
    .filter(Boolean)
    .join(",")
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean)
    .slice(0, 4)
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    concentration: p.concentration,
    priceNGN: p.price.amountNGN,
    compareAtNGN: p.compareAtPrice?.amountNGN ?? null,
    image: p.images?.[0] ?? null,
    ratingAvg: p.ratingAvg,
    ratingCount: p.ratingCount,
    fragranceFamily: p.fragranceFamily,
    notes,
    hasSample: false,
    availability: item.availability === "in_stock" ? "in_stock" : item.availability,
    reason: item.reasons?.[0],
  }
}

interface Group {
  key: string
  title: string
  blurb: string
  params: Record<string, string>
}

/**
 * Grounded recommendation groups. Every candidate comes from the catalogue-grounded
 * /api/v1/recommendations engine, which never returns an unavailable product as available and never
 * invents products. Each card carries the engine's own short explanation.
 */
export function Recommendations({ seed, excludeId }: { seed: Seed; excludeId: string }) {
  const groups = React.useMemo<Group[]>(() => {
    const notes = seed.notes.slice(0, 3).join(",")
    const list: Group[] = []
    if (seed.family) {
      list.push({
        key: "character",
        title: "Similar scent character",
        blurb: "A comparable style from our shelves.",
        params: { family: seed.family, ...(notes ? { notes } : {}), limit: "4" },
      })
    }
    if (notes) {
      list.push({
        key: "shared-notes",
        title: "Shares notes with this",
        blurb: "Built around some of the same materials.",
        params: { notes, limit: "4" },
      })
    }
    list.push({
      key: "sample-first",
      title: "Try before you commit",
      blurb: "Great candidates to sample first.",
      params: { ...(seed.family ? { family: seed.family } : {}), sampleFirst: "true", limit: "4" },
    })
    return list
  }, [seed])

  const [counts, setCounts] = React.useState<Record<string, number>>({})
  const anyVisible = Object.values(counts).some((n) => n > 0)
  // Until at least one group resolves with items, render nothing (no empty "Explore further" header).
  const report = React.useCallback((key: string, n: number) => {
    setCounts((c) => (c[key] === n ? c : { ...c, [key]: n }))
  }, [])

  return (
    <PdpSection show={anyVisible} eyebrow="You may also like" title="Explore further">
      <div className="space-y-10">
        {groups.map((g) => (
          <RecGroup key={g.key} group={g} excludeId={excludeId} onResult={report} />
        ))}
      </div>
    </PdpSection>
  )
}

function RecGroup({
  group,
  excludeId,
  onResult,
}: {
  group: Group
  excludeId: string
  onResult: (key: string, n: number) => void
}) {
  const [cards, setCards] = React.useState<PdpCard[] | null>(null)
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    const params = new URLSearchParams(group.params)
    fetch(`/api/v1/recommendations?${params.toString()}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((json) => {
        if (cancelled) return
        const items = (json.data?.items ?? []) as RecItem[]
        const next = items.filter((i) => i.product.id !== excludeId).map(toCard).slice(0, 4)
        setCards(next)
        onResult(group.key, next.length)
      })
      .catch(() => {
        if (cancelled) return
        setError(true)
        onResult(group.key, 0)
      })
    return () => {
      cancelled = true
    }
  }, [group, excludeId, onResult])

  if (error) return null
  if (cards && cards.length === 0) return null

  return (
    <div>
      <div className="mb-4 flex items-baseline justify-between gap-2">
        <div>
          <h3 className="font-serif text-lg">{group.title}</h3>
          <p className="text-xs text-muted-foreground">{group.blurb}</p>
        </div>
      </div>
      {!cards ? (
        <div className="flex items-center gap-2 py-6 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Finding matches…
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {cards.map((card) => (
            <div key={card.id} onClickCapture={() => trackPdp("ai_recommendation_selected", { productId: card.id })}>
              <SmartProductCard card={card} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
