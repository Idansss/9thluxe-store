# PDP Information Architecture

Route: `app/product/[slug]/page.tsx` (React Server Component). Rich product data is loaded once on
the server via `lib/pdp/loader.ts` → `PdpData`. Below-the-fold and interactive-only pieces are lazy
client islands so the critical purchase path stays light.

## Rendering strategy

| Zone | Component kind | Loading |
| --- | --- | --- |
| Breadcrumb, gallery, purchase panel | server + small client islands | critical (SSR) |
| At-a-glance profile, What-it-smells-like, Pyramid, Accords | server | SSR, in-view reveal via CSS |
| Timeline, Performance, Climate guidance | server | SSR |
| AI fit check | client, `next/dynamic` | deferred, on-interaction |
| Reviews (summary + browser), Q&A | client, `next/dynamic` | deferred |
| Compare drawer, Layering Lab | client, `next/dynamic` | deferred, chunk-split |
| Recommendations, Brand/Perfumer, DNA promo, FAQ | server | SSR (below fold) |
| Sticky mobile purchase bar | client island | critical |

## Desktop order (two-column hero, then full-width editorial stack)

1. Breadcrumb
2. **Hero row** — media gallery (left) · purchase panel (right, sticky on scroll)
3. At-a-glance fragrance profile (grid, provenance-labelled)
4. "What it smells like" (plain-language)
5. Interactive fragrance pyramid (top/heart/base, note → explore)
6. Main accords (ranked bars, source-labelled)
7. "How it wears" scent timeline (4 stages)
8. Performance profile (with contributing-review counts)
9. Climate & Nigerian-use guidance (manual city select)
10. AI "Will this suit me?" (optional, deferred)
11. Layering Lab (deferred)
12. Reviews (summary → AI summary → browser)
13. Q&A (dev state)
14. Authenticity & sourcing
15. Delivery, returns & purchasing FAQ (accordion; single policy source)
16. Brand & perfumer profiles
17. Recommendation groups
18. Fragrance DNA invitation (intentional CTA, no auto-modal)
19. Compare drawer (global, opens from any card) + `/compare` page

## Mobile priority order

Product → price/variant → add-to-cart → essential trust → scent explanation → notes & performance →
reviews → recommendations. The sticky mobile bar carries size/price/stock/add-to-cart and never
covers content or system UI (safe-area padding + body bottom padding).

## Section visibility rules

Every section is wrapped so it returns `null` when it has no meaningful data. No empty cards, no
placeholder values, no fabricated stats. Sections whose backend is missing render a single, quiet
"available soon / not available in this environment" line rather than fake content.

## Single sources of truth

- **Money / price-per-ml** — `lib/format.ts` + `lib/pdp/parse.ts#pricePerMl`.
- **Delivery & returns policy** — one policy object in `lib/pdp/policy.ts`, consumed by both the
  near-cart summary and the FAQ accordion (prevents conflicting return periods).
- **Provenance labels** — `lib/pdp/parse.ts#PROVENANCE_LABEL`.
- **Analytics event names** — `lib/analytics/pdp-events.ts` (typed union).
