# PDP & Discovery Upgrade — Checklist (honest status)

Branch: `upgrade/pdp-discovery-sol`. Status legend: ✅ done · ◐ partial (real data wired, gated on a
documented backend gap) · ⛔ blocked by missing backend (frontend boundary + dev state shipped) ·
▫ not started.

Data rule honoured throughout: **no fabricated products, reviews, stock, ratings, prices, discounts,
percentages, statistics, or authenticity claims.** Sections hide when data is absent.

## Foundations
- [x] ✅ Inspect repo, contracts, data model, live shape, existing PDP
- [x] ✅ Docs: assumptions, IA, backend-requirements, motion spec, this TODO
- [x] ✅ Typed PDP data layer — `lib/pdp/{types,parse,policy,loader}.ts`
- [x] ✅ Pure parse helpers unit-tested — `tests/pdp/parse.test.ts`
- [x] ✅ Typed analytics dispatcher — `lib/analytics/pdp-events.ts`

## Product page sections
- [x] ✅ 1. Media gallery (thumbs, full-screen viewer, keyboard, swipe, zoom, fallbacks, a11y labels)
- [x] ✅ 1. Purchase panel (brand/name/concentration/desc/rating, variants, qty, add-to-cart, buy-now,
      wishlist, share, delivery/returns/authenticity links, price-per-ml, stock/low/preorder/waitlist)
- [x] ✅ 1. Variant selection updates image/price/per-ml/stock/SKU/sample state (from real variants)
- [x] ◐ 1. Sample-first (full bottle / sample / discovery set) — renders when real sample variants or
      discovery sets exist; credit-redemption copy gated on backend rules
- [x] ✅ 1. Sticky mobile purchase bar (safe-area aware)
- [x] ✅ 2. At-a-glance fragrance profile (provenance-labelled, icons+text)
- [x] ✅ 3. "What it smells like" (plain-language, only from approved fields)
- [x] ✅ 4. Interactive fragrance pyramid (note → explore, tooltips, reduced-motion)
- [x] ✅ 5. Main accords (ranked bars, source label; proportional ranking, no fake percentages)
- [x] ✅ 6. "How it wears" scent timeline (4 stages, editorial caution)
- [x] ◐ 7. Performance profile (aggregated from real per-review ratings + counts; endpoint R4 pending)
- [x] ✅ 8. Climate & Nigerian-use guidance (manual city select, descriptive language, no geolocation)
- [x] ◐ 9. AI "Will this suit me?" (grounded via /recommendations; dedicated /fit endpoint = R5)
- [x] ◐ 10. Compare drawer + `/compare` page (client, URL-driven, up to 4; batch endpoint R9)
- [x] ◐ 11. Layering Lab (real /api/v1/layering; "save"/"add both" gated on R6)
- [x] ✅ 12. Authenticity & sourcing (only real authenticityStatus/batch/lastVerifiedAt; no fake claims)
- [x] ✅ 13. Delivery/returns/FAQ (single policy source, near-cart + accordion)
- [x] ✅ 14. Brand & perfumer profiles (only verified fields; brand's other products)
- [x] ✅ 15. Recommendation groups (grounded, explanations, out-of-stock excluded/labelled)
- [x] ✅ 16. Reviews (summary, distribution, verified %, structured sub-scores, submit, browse, filters,
      image gallery, AI summary labelled with count + access to originals)
- [x] ⛔ 17. Q&A (full component + frontend boundary; **no backend** → dev state, contract R7)
- [x] ✅ 18. Fragrance DNA promotion (intentional CTA, no auto-modal)
- [x] ✅ 19. Smart product cards (progressive disclosure, notes/family/sample/wishlist/compare/quick-add)
- [x] ◐ 20. Wishlist ✅ / Scent Wardrobe ⛔ (owned/tried/private-rating/wear-log dev state, contract R8)

## Cross-cutting
- [x] ✅ URL-based filters for discovery/compare (shareable, back/forward correct)
- [x] ✅ Graceful missing-data, loading (skeleton), and error states
- [x] ✅ Responsive 360→1440; mobile priority order; sticky bar
- [x] ✅ Reduced-motion respected
- [x] ✅ Accessibility pass (keyboard, focus, headings, dialog focus, alt text, labels, contrast,
      touch targets, no colour-only / hover-only meaning)
- [x] ✅ SEO structured data (Product/Offer/Brand/Breadcrumb; AggregateRating & Review only when real;
      FAQ only when visibly present)
- [x] ✅ Analytics events (typed; no sensitive DNA/AI payloads to third parties)
- [x] ✅ Purchase area works when AI / reviews / recs / video fail

## Verification
- [x] ✅ Formatting / lint (`eslint .`)
- [x] ✅ Strict typecheck (`tsc --noEmit`)
- [x] ✅ Unit tests (`vitest run`) — parse helpers, policy, analytics guards
- [x] ✅ Production build (`next build`)
- [ ] ◐ Playwright E2E / visual-regression / axe automation — harness not present in repo; manual
      responsive + a11y QA recorded in `PDP_VISUAL_QA.md` / `PDP_ACCESSIBILITY_REPORT.md`. Adding a
      Playwright harness is the top remaining item (see Handoff).

## Known remaining (honest)
- Q&A, Scent Wardrobe, dedicated AI-fit and performance-aggregation endpoints are **backend gaps**
  (R4–R8); the frontend ships typed boundaries + dev states, not fake data.
- Automated E2E/visual/a11y suites need a Playwright + axe harness added to the repo.
- Real high-resolution bottle media, sample/discovery-set variants, perfumer bios and accord data
  must be entered by the merchant before those sections light up in production.
