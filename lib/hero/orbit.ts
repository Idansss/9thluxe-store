// lib/hero/orbit.ts
// Resolves the curated orbit configuration (lib/hero/orbit-config.ts) against the REAL catalogue
// into the public payload for the homepage orbital carousel. Pure builders are exported for unit
// tests; the Prisma selector is best-effort and returns null on any problem so the homepage always
// falls back to the approved Stage 1 hero. Nothing here is fabricated: notes map through the
// approved in-house ingredient library, annotation copy comes from that library's approved
// editorial text, and prominence is a qualitative perceived band - never a percentage.

import { prisma } from "@/lib/prisma"
import { getIngredient } from "@/lib/fragrance/ingredients"
import type { NoteTier, ProminenceLabel } from "@/lib/fragrance/types"
import { assetsForTier, isComingSoon, type HeroProductInput } from "./select"
import type { HeroAvailability, HeroIngredientAsset } from "./types"
import { ORBIT_SLIDES, type HomepagePerfumeSlide, type PedestalStyle } from "./orbit-config"

/** Public perceived-prominence scale required by the creative brief. Qualitative only. */
export type OrbitProminence = "Trace" | "Subtle" | "Noticeable" | "Prominent" | "Dominant"

const PROMINENCE_PUBLIC: Record<ProminenceLabel, OrbitProminence> = {
  very_prominent: "Dominant",
  prominent: "Prominent",
  moderate: "Noticeable",
  soft: "Subtle",
  trace: "Trace",
}

/** Max simultaneous ingredient visuals for the active slide (desktop). Mobile slices further. */
export const ORBIT_MAX_INGREDIENTS = 5

/** Calm luxury rhythm per the brief: 4-6s dwell, ~1s transition. */
export const ORBIT_MOTION = { dwellMs: 5_200, transitionMs: 1_000 } as const

export interface OrbitAnnotation {
  id: string
  /** Anchors the annotation to its ingredient visual (HeroIngredientAsset.id). */
  ingredientId: string
  name: string
  tier: NoteTier
  /** Approved editorial sentence from the in-house ingredient library. */
  text: string
  prominence: OrbitProminence
}

export interface OrbitSlideProduct {
  id: string
  name: string
  slug: string
  brand: string
  alt: string
  concentration: string | null
  /** Approved fragrance family from the record (e.g. "ORIENTAL"), or null when unrecorded. */
  family: string | null
  availability: HeroAvailability
  /** Approved key note names (resolved through the ingredient library), tier order preserved. */
  keyNotes: string[]
}

export interface OrbitSlideData {
  id: string
  displayOrder: number
  pedestalStyle: PedestalStyle
  /** Transparent merchant-owned bottle cutout. */
  bottleAsset: string
  product: OrbitSlideProduct
  /** Active-slide ingredient visuals, tier order, capped at ORBIT_MAX_INGREDIENTS. */
  ingredients: HeroIngredientAsset[]
  annotations: OrbitAnnotation[]
}

export interface OrbitData {
  slides: OrbitSlideData[]
  motion: typeof ORBIT_MOTION
}

/** The product fields the orbit needs. Superset of the Stage 1 input plus the family. */
export interface OrbitProductInput extends HeroProductInput {
  fragranceFamily: string | null
}

function firstSentence(text: string): string {
  const match = text.match(/^[^.!?]{10,}?[.!?]/)
  return (match ? match[0] : text).trim()
}

/**
 * Build one public slide, or null when the slide is not eligible. Eligibility requires an APPROVED,
 * enabled config entry with a real cutout asset AND a matching published, non-deleted product.
 */
export function buildOrbitSlide(
  config: HomepagePerfumeSlide,
  product: OrbitProductInput | null | undefined,
): OrbitSlideData | null {
  if (!config.enabled || config.approvalStatus !== "APPROVED" || !config.bottleAsset) return null
  if (!product || product.deletedAt || product.publishStatus !== "PUBLISHED") return null

  const tiers = [
    ...assetsForTier(product.notesTop, "top"),
    ...assetsForTier(product.notesHeart, "heart"),
    ...assetsForTier(product.notesBase, "base"),
  ]
  const ingredients = tiers.slice(0, ORBIT_MAX_INGREDIENTS)

  const annotations: OrbitAnnotation[] = []
  for (const asset of ingredients) {
    const ing = getIngredient(asset.id)
    if (!ing || ing.approval !== "approved" || !ing.shortDescription) continue
    annotations.push({
      id: `${config.id}_${asset.id}`,
      ingredientId: asset.id,
      name: asset.name,
      tier: asset.tier,
      text: firstSentence(ing.shortDescription),
      prominence: PROMINENCE_PUBLIC[asset.perceivedProminence],
    })
  }

  const brand = (product.brand ?? "").trim()
  return {
    id: config.id,
    displayOrder: config.displayOrder,
    pedestalStyle: config.pedestalStyle,
    bottleAsset: config.bottleAsset,
    product: {
      id: product.id,
      name: product.name,
      slug: product.slug,
      brand,
      alt: `${product.name}${brand ? ` by ${brand}` : ""} perfume bottle`,
      concentration: product.concentration?.trim() || null,
      family: product.fragranceFamily?.trim() || null,
      availability: isComingSoon(product) ? "coming_soon" : "available",
      keyNotes: tiers.map((a) => a.name),
    },
    ingredients,
    annotations,
  }
}

/**
 * Assemble the carousel payload from configs + fetched products. Returns null when fewer than two
 * slides are usable: a one-bottle "carousel" would be dishonest motion for nothing, so the homepage
 * keeps the Stage 1 hero instead (the brief's fallback ladder).
 */
export function buildOrbitData(
  configs: HomepagePerfumeSlide[],
  productsBySlug: Map<string, OrbitProductInput>,
): OrbitData | null {
  const slides = configs
    .slice()
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((cfg) => buildOrbitSlide(cfg, productsBySlug.get(cfg.productSlug)))
    .filter((s): s is OrbitSlideData => s !== null)
  if (slides.length < 2) return null
  return { slides, motion: ORBIT_MOTION }
}

/** Query the catalogue for the configured slides. Best-effort: any DB error yields null. */
export async function selectHeroOrbit(): Promise<OrbitData | null> {
  const candidates = ORBIT_SLIDES.filter(
    (s) => s.enabled && s.approvalStatus === "APPROVED" && s.bottleAsset,
  )
  if (candidates.length < 2) return null
  try {
    const products = await prisma.product.findMany({
      where: {
        slug: { in: candidates.map((s) => s.productSlug) },
        deletedAt: null,
        publishStatus: "PUBLISHED",
      },
    })
    const bySlug = new Map<string, OrbitProductInput>(
      products.map((p) => [p.slug, p as unknown as OrbitProductInput]),
    )
    return buildOrbitData(ORBIT_SLIDES, bySlug)
  } catch (err) {
    console.error("[hero-orbit] failed to select slides", err)
    return null
  }
}
