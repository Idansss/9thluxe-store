# PDP Performance Report

Branch `upgrade/pdp-discovery-sol`. Targets: LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 on mid-range
Android. This records the performance *strategy* actually implemented and verified in the build; exact
Lighthouse/field numbers should be captured against a deployed instance with real media.

## What was implemented

| Lever | Implementation |
| --- | --- |
| Server-rendered critical info | `app/product/[slug]/page.tsx` is an RSC. Product identity, gallery, purchase panel, profile, pyramid, accords, timeline, performance, climate, authenticity, FAQ, brand — all render server-side from a single `loadPdpData()` call (one DB round-trip + parallel review/brand/perfumer queries via `Promise.all`). |
| Code-split heavy islands | AI fit, Layering Lab, Reviews, Q&A, Recommendations are `next/dynamic` imports → separate chunks, each with a skeleton fallback. They are not in the critical purchase path. |
| Deferred data | Reviews list, AI summary, recommendations, layering partners and compare enrichment all fetch **after** hydration; the summary aggregate is server-computed and passed as a prop (no client refetch). |
| Reserved media dimensions | Gallery main stage is a fixed `aspect-square`; thumbnails fixed `h-16 w-16`; accord/timeline bars animate **width only** inside fixed-height tracks → no CLS. |
| Responsive images | All product imagery uses `next/image` with explicit `sizes` (`50vw` desktop hero, `25vw` cards, `64px` thumbs) and lazy loading; only the primary gallery image is `priority`. |
| Video | `<video preload="none">` — no below-the-fold media in the critical path; plays only on user action. |
| No animation-driven layout | Reveals are opacity/transform only; sticky panel uses CSS `position: sticky` (no JS/scroll listener). Sticky mobile bar toggles via a single IntersectionObserver, not a scroll handler. |
| Reduced client JS | Server components dominate; client islands are scoped to genuinely interactive units. No new animation library added (CSS + existing `tw-animate-css` only). |
| Resilience | The purchase area renders even if AI/reviews/recs/layering/video fail (each island has an error/empty state), and even if commerce config can't be read (`getPdpPolicy` falls back to schema defaults). Verified in dev by disabling the recommendations endpoint — the page and purchase panel stayed fully functional. |

## Verified

- `next build` completes clean (no type/lint errors; all 168 unit/integration tests pass).
- `/product/[slug]` compiles as a **Dynamic (ƒ)** server-rendered route; `/compare` as **Static (○)**.
- Manual profiling in dev confirmed the initial HTML contains the full editorial stack (server-rendered),
  while AI/reviews/recs/layering JS load as separate chunks.

## Not yet measured (honest gaps)

- Exact **First Load JS** per route: Next 16 suppresses the size table in non-TTY builds; read it from an
  interactive `next build`, or wire `@next/bundle-analyzer` (recommended — noted in Handoff).
- Field **LCP/INP/CLS**: require a deployment with real high-resolution bottle media and representative
  hardware. The seed catalogue uses a single placeholder image, so local LCP is not representative.
- The purchase path was designed to keep LCP = the hero bottle image (SSR, priority) and CLS ≈ 0 via
  reserved dimensions; confirm against production media.

## Recommended next steps

1. Add `@next/bundle-analyzer` and record First Load JS for `/product/[slug]`.
2. Run Lighthouse + WebPageTest (Moto G-class) against a staging deploy with real media.
3. Consider `next/dynamic` `ssr: false` for the AI/Layering/Q&A islands (needs a small client boundary
   wrapper, since the page is an RSC) to shave their SSR + hydration cost further if field INP needs it.
