# PDP & Discovery — Backend Requirements (frontend-observed gaps)

The frontend PDP is built against a **typed integration boundary** (`lib/pdp/`). Where a field or
endpoint is missing, the UI renders an intentional unavailable/development state and the requirement
is recorded here with the expected request/response schema. Backend-owned contract files
(`integrations/commerce/*`, `contracts/*`, `app/api/v1/*`) were treated as **read-only**.

---

## R1 — Widen the public `CommerceProduct` DTO

`integrations/commerce/local/index.ts#toProduct()` currently omits fragrance/commerce fields that
already exist as `Product` columns. The PDP consumes them today via the frontend Prisma loader; to
serve them through the official provider boundary (and Shopify parity), add to `CommerceProduct`:

```ts
interface CommerceProduct {
  // ...existing...
  longDescription: string | null
  story: string | null
  olfactoryDesc: string | null
  mainAccords: string[]          // ranked, strongest first
  intensity: string | null
  sprayGuidance: string | null
  season: string | null
  climate: string | null
  timeOfDay: string | null
  occasion: string | null
  beginnerFriendly: boolean | null
  moodTags: string[]
  launchYear: number | null
  perfumer: string | null
  countryOfOrigin: string | null
  concentration: string | null
  authenticityStatus: 'RETAILER_INSPECTED' | 'MANUFACTURER_VERIFIED'
  batchInfo: string | null
  lastVerifiedAt: string | null   // ISO
  isPreorder: boolean
  isWaitlist: boolean
  returnEligible: boolean
  media: { url: string; kind: 'image' | 'video'; alt: string | null; position: number }[]
}
```

## R2 — Real variants in the DTO

`toVariant()` synthesises `${id}:default` and never reads `ProductVariant`. Map real rows so size /
`priceNGN` / `sampleSize` / per-variant stock / SKU reach the storefront:

```ts
interface CommerceVariant {
  id: string; size: string | null; sku: string | null
  price: Money; compareAtPrice: Money | null
  sampleSize: boolean; inStock: boolean; availableQuantity: number | null
}
```

## R3 — Provenance metadata

For each subjective attribute (`longevity`, `sillage`, `intensity`, accords, climate, season), return
a source enum so the UI can label it truthfully:

```ts
type Provenance = 'BRAND' | 'EDITORIAL' | 'CUSTOMER_AGGREGATE'
// e.g. performance: { longevity: { value: 'Long lasting', source: 'EDITORIAL', sampleSize: 0 } }
```

## R4 — Performance aggregation endpoint

`GET /api/v1/products/:id/performance` → aggregate the structured per-review ratings with counts, so
the UI can show "N verified reviews contributing":

```json
{ "longevity": {"avg": 4.2, "count": 37},
  "sillage":   {"avg": 3.8, "count": 35},
  "value":     {"avg": 4.0, "count": 31},
  "climateHistogram": {"Lagos humid": 12, "AC office": 9},
  "occasionHistogram": {"Evening": 20, "Office": 11} }
```
Until then the loader computes these from `Review` rows directly (server-side).

## R5 — AI "Will this suit me?" fit endpoint

`POST /api/v1/products/:id/fit` grounded in the single product + catalogue candidates:

```jsonc
// request
{ "likedNotes": ["oud"], "dislikedNotes": ["anise"], "occasion": "evening",
  "climate": "lagos-humid", "budgetMaxNGN": 150000, "longevity": "long",
  "projection": "moderate", "useProfile": true }
// response
{ "matchScore": 0-100, "explanation": "…AI-assisted, grounded…",
  "matchingAttributes": ["woody amber character"], "conflicts": ["stronger than requested"],
  "alternatives": [{ "slug": "...", "reason": "..." }], "sampleFirst": true,
  "isAiAssisted": true }
```
Today the UI composes an equivalent grounded request from `GET /api/v1/recommendations`
(catalogue-grounded, never fabricates products) and derives a transparent match view; it never
invents a note, price, or product. Swap to R5 when available.

## R6 — Layering "save combination" + "add both to cart"

`POST /api/v1/layering` returns advice but saving is deferred (see `BACKEND_UPGRADE_TODO.md`). Need
`POST /api/v1/wardrobe/layerings` to persist a saved combination for signed-in users.

## R7 — Product Questions & Answers

No model/route exists. Proposed:

```
GET  /api/v1/products/:id/questions?search=&status=answered|unanswered&sort=helpful|recent
POST /api/v1/products/:id/questions            { body, category }
POST /api/v1/questions/:qid/answers            { body }         // staff/verified-buyer/brand
POST /api/v1/answers/:aid/helpful              { }
POST /api/v1/questions/:qid/subscribe          { email }
POST /api/v1/questions/:qid/report | /answers/:aid/report
```
Answer objects carry `authorType: 'STAFF' | 'VERIFIED_BUYER' | 'BRAND' | 'AI_SUGGESTED'` and a
`moderationStatus`. AI answers must be visibly labelled per moderation rules. UI ships the full
component behind an "unavailable in this environment" state.

## R8 — Scent Wardrobe

Wishlist exists; the richer Wardrobe (mark owned, mark sample tried, private rating, wear log,
saved comparisons, replenishment reminders) has no model. Proposed `WardrobeEntry`:

```ts
{ id, userId, productId, status: 'WISHLIST'|'OWNED'|'SAMPLE_TRIED',
  privateRating?: 1..5, wornAt?: Date[], location?: string,
  savedComparisonIds?: string[], replenishmentEnabled?: boolean }
```
plus `GET/POST/PATCH /api/v1/wardrobe`. UI shows Wardrobe actions as a documented dev state.

## R9 — Compare persistence & delivery estimate per variant

Comparison works client-side (URL-param driven, up to 4). A `GET /api/v1/compare?ids=` batch endpoint
returning `CommerceProduct[]` would remove N round-trips. Per-variant **delivery estimate** and
**shipping qualification** should come from `lib/config/commerce` server config, exposed as
`GET /api/v1/shipping/estimate?state=&subtotalNGN=`.

## R10 — Structured "How it wears" timeline + climate guidance fields

The timeline and Nigerian-climate guidance are currently **derived editorially** in the frontend from
`notesTop/Heart/Base`, `fragranceFamily`, `concentration`, `sillage`, `longevity`. If the brand wants
authored per-stage copy and per-city verdicts, add `wearTimeline` (JSON) and `climateGuidance` (JSON)
columns; the UI already renders from a typed shape and would bind directly.
