# PDP & Discovery Upgrade — Handoff

Branch: `upgrade/pdp-discovery-sol`. Frontend-only; no backend-owned contract file
(`contracts/*`, `integrations/commerce/*`, `app/api/v1/*`) was modified.

## Features implemented

A complete redesign of the post-selection perfume experience: an editorial "atelier" product page
plus discovery features. Sections: media gallery (thumbnails, full-screen viewer, keyboard, swipe,
zoom-capable, fallbacks), purchase panel (variants, sample-first, price-per-ml, stock/low/preorder/
waitlist, add-to-cart, buy-now, wishlist, compare, share, gift, single-source delivery/returns),
sticky mobile purchase bar, at-a-glance profile with provenance labels, plain-language "what it
smells like", interactive note pyramid (note → explore), main accords (ranked, no fake percentages),
"how it wears" timeline, performance profile (verified-review aggregates with counts), Nigerian
climate guidance (manual, descriptive), AI-assisted "will this suit me?" (grounded), Layering Lab
(real `/api/v1/layering`), reviews (server summary + distribution + verified % + structured sub-scores
+ AI summary labelled with count + browse/filter/submit), Q&A (dev state), authenticity/sourcing,
delivery/returns FAQ, brand & perfumer profiles, grounded recommendation groups, Fragrance-DNA promo,
compare drawer + `/compare` page, and upgraded smart product cards.

Every section hides when it has no real data. **No fabricated products, reviews, stock, ratings,
prices, discounts, percentages, statistics, or authenticity claims exist anywhere in the code.**

## Routes & components changed

- **New page**: `app/product/[slug]/page.tsx` (rewritten RSC).
- **Rewritten page**: `app/compare/page.tsx` (typed compare store + real enrichment).
- **New data layer**: `lib/pdp/{types,parse,policy,loader}.ts`.
- **New store**: `lib/stores/compare-store.ts`.
- **New analytics**: `lib/analytics/pdp-events.ts` (typed, privacy-guarded client dispatcher).
- **New SEO**: `components/seo/pdp-structured-data.tsx` (Breadcrumb + FAQ; reuses existing `ProductJsonLd`).
- **New components** (`components/pdp/`): `section`, `reveal`, `provenance-chip`, `pdp-gallery`,
  `purchase-panel`, `sticky-purchase-bar`, `at-a-glance`, `scent-explanation`, `fragrance-pyramid`,
  `main-accords`, `wear-timeline`, `performance-profile`, `climate-guidance`, `ai-fit-check`,
  `layering-lab`, `reviews-section`, `qa-section`, `authenticity`, `delivery-returns-faq`,
  `brand-perfumer`, `dna-quiz-promo`, `recommendations`, `smart-product-card`, `compare-drawer`.
- **New tests**: `tests/pdp/parse.test.ts` (15 tests).
- **New docs**: the nine `docs/PDP_*` files.

## Backend endpoints used (real)

`GET /api/v1/reviews`, `GET /api/v1/reviews/summary`, `GET /api/v1/recommendations`,
`POST /api/v1/layering`, `POST /api/v1/back-in-stock`, `GET /api/v1/products/[slug]`,
`POST /api/cart/add`, `GET /api/cart/summary`. Product/review aggregate data is loaded server-side via
Prisma in `lib/pdp/loader.ts` (the frontend integration boundary).

## Missing backend fields (documented, not faked)

See `docs/PDP_BACKEND_REQUIREMENTS.md` R1–R10. Summary of what ships as a typed boundary + honest
unavailable state instead of fabricated content:
- **R1/R2** widen the public `CommerceProduct` DTO + real variants (accords, intensity, climate, season,
  perfumer, launch year, country, mood, authenticity, preorder/waitlist, media, sample variants).
- **R3** provenance metadata per attribute.
- **R4** performance-aggregation endpoint (currently computed from `Review` rows server-side).
- **R5** dedicated AI-fit endpoint (currently grounded via `/recommendations`).
- **R6** layering "save" + "add both to cart".
- **R7** Product Q&A (no model/route → dev state shipped).
- **R8** Scent Wardrobe (owned/tried/private rating/wear log → dev state; wishlist works today).
- **R9** compare batch endpoint + per-variant delivery estimate.
- **R10** optional authored timeline/climate copy.

## Tests executed

- `tsc --noEmit` — clean.
- `eslint .` (new files) — clean.
- `vitest run` — **168 passed** (incl. 15 new PDP parse tests and DB integration tests).
- `next build` — succeeds; `/product/[slug]` = Dynamic, `/compare` = Static.
- Manual browser QA at mobile + tablet + desktop, incl. interactive AI-fit, compare, gallery, pyramid,
  timeline, climate selector, sticky bar (see `PDP_VISUAL_QA.md`).

## Performance & accessibility

See `PDP_PERFORMANCE_REPORT.md` and `PDP_ACCESSIBILITY_REPORT.md`. Server-rendered critical path,
code-split islands, reserved media dimensions, reduced-motion honoured, WCAG 2.2 AA measures in place.

## Remaining external assets / credentials / work

1. **Real product media** (high-res bottle photography, packaging, video, 3D) — merchant data; seed uses
   a placeholder. Load via `ProductMedia` rows or `images[]`.
2. **Catalogue enrichment** — populate `mainAccords`, `olfactoryDesc`, performance/climate strings,
   `perfumer`, `launchYear`, `countryOfOrigin`, sample/discovery `ProductVariant` rows so the
   currently-hidden sections light up.
3. **Env fix (local dev)** — `.env` has `UPSTASH_REDIS_REST_URL=""`; an empty string fails the URL
   validator and makes `lib/env` throw for any commerce-config read in **dev** (production falls back to
   defaults). Set it to a real Upstash URL or leave it **unset** (not `""`). The PDP itself is already
   hardened against this, but other commerce-config-dependent dev routes (e.g. `/api/v1/recommendations`)
   will 500 in dev until it's corrected.
4. **Automated E2E / a11y / visual-regression** — no Playwright/axe harness exists in the repo yet. Add
   `@playwright/test` + `@axe-core/playwright` and cover the scenarios in the task brief (complete data,
   minimal data, no reviews, many variants, waitlist, missing image, slow/failed APIs, reduced motion,
   keyboard-only, mobile Safari). This is the top remaining engineering item.
5. **Backend R1–R10** — see requirements doc; frontend binds directly once shipped.
6. **Optional**: hoist `<CompareDrawer />` into the root layout so the tray is global across all pages
   (currently mounted on the PDP and `/compare`); add `@next/bundle-analyzer` for First Load JS numbers.
