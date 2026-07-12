// lib/hero/orbit-config.ts
// Curated slide configuration for the homepage orbital carousel (Stage 2). This file codifies the
// research proposal in docs/HERO_ORBIT_RESEARCH_PROPOSAL.md: every slide references a REAL published
// catalogue product and a merchant-owned bottle asset. Slides never invent availability or data;
// ineligible entries stay DRAFT/disabled instead of being faked.
//
// Two gates must both be open before anything renders publicly:
//   1. the `hero_orbit` feature flag (default OFF) - flipping it on in production is the merchant's
//      explicit sign-off on this configuration, exactly like `isFeatured` gates the Stage 1 hero;
//   2. per-slide `approvalStatus === "APPROVED" && enabled` below.

export type PedestalStyle = "STONE" | "METAL" | "GLASS" | "WATER"
export type SlideApprovalStatus = "DRAFT" | "APPROVED" | "REJECTED"

export interface HomepagePerfumeSlide {
  id: string
  /** Ties the slide to the real catalogue product; the selector re-verifies it is PUBLISHED. */
  productSlug: string
  displayOrder: number
  /**
   * Transparent bottle cutout under /public (background removed, unrecoloured, proportions intact).
   * `null` means no usable asset exists yet and the slide can never render.
   */
  bottleAsset: string | null
  pedestalStyle: PedestalStyle
  backgroundProfile: "night-adaptive"
  motionProfile: "calm-orbit"
  approvalStatus: SlideApprovalStatus
  enabled: boolean
}

export const ORBIT_SLIDES: HomepagePerfumeSlide[] = [
  {
    // House signature oriental (oud/amber/vanilla): proposed front/default slide.
    id: "slide_nocturne",
    productSlug: "nocturne-eau-de-parfum",
    displayOrder: 1,
    bottleAsset: "/hero/nocturne-bottle.webp",
    pedestalStyle: "STONE",
    backgroundProfile: "night-adaptive",
    motionProfile: "calm-orbit",
    approvalStatus: "APPROVED",
    enabled: true,
  },
  {
    // Floral chapter (pink pepper/rose/patchouli).
    id: "slide_vesper_velvet",
    productSlug: "vesper-velvet-eau-de-parfum",
    displayOrder: 2,
    bottleAsset: "/hero/vesper-velvet-bottle.webp",
    pedestalStyle: "STONE",
    backgroundProfile: "night-adaptive",
    motionProfile: "calm-orbit",
    approvalStatus: "APPROVED",
    enabled: true,
  },
  {
    // BLOCKED: the catalogue image for this product depicts a third-party (Terre d'Hermes) bottle,
    // which may not be presented as Aurelius Noir. Stays DRAFT/disabled with no asset until the
    // merchant supplies a correct, licensed bottle image. See the research proposal, slide 1.
    id: "slide_aurelius_noir",
    productSlug: "aurelius-noir-eau-de-toilette",
    displayOrder: 3,
    bottleAsset: null,
    pedestalStyle: "STONE",
    backgroundProfile: "night-adaptive",
    motionProfile: "calm-orbit",
    approvalStatus: "DRAFT",
    enabled: false,
  },

  // ---- Expansion round (see HERO_ORBIT_RESEARCH_PROPOSAL.md, "Expansion round") ----
  // Real fragrances the merchant carries. Bottle images were supplied by the merchant and
  // background-removed to transparent WebP; slides are APPROVED. They only render once their
  // catalogue product is PUBLISHED (buildOrbitSlide gates on publishStatus), so publishing each
  // product in admin - with a real price - is the final go-live switch per slide.
  {
    id: "slide_tf_oud_wood",
    productSlug: "tom-ford-oud-wood",
    displayOrder: 4,
    bottleAsset: "/hero/tom-ford-oud-wood-bottle.webp",
    pedestalStyle: "STONE",
    backgroundProfile: "night-adaptive",
    motionProfile: "calm-orbit",
    approvalStatus: "APPROVED",
    enabled: true,
  },
  {
    id: "slide_creed_aventus",
    productSlug: "creed-aventus",
    displayOrder: 5,
    bottleAsset: "/hero/creed-aventus-bottle.webp",
    pedestalStyle: "STONE",
    backgroundProfile: "night-adaptive",
    motionProfile: "calm-orbit",
    approvalStatus: "APPROVED",
    enabled: true,
  },
  {
    id: "slide_dior_sauvage_elixir",
    productSlug: "dior-sauvage-elixir",
    displayOrder: 6,
    bottleAsset: "/hero/dior-sauvage-elixir-bottle.webp",
    pedestalStyle: "STONE",
    backgroundProfile: "night-adaptive",
    motionProfile: "calm-orbit",
    approvalStatus: "APPROVED",
    enabled: true,
  },
]
