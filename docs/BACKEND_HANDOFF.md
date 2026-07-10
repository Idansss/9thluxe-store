# Backend Handoff (for the frontend / Codex agent)

The storefront visual layer is yours. This backend gives you a typed, versioned, catalogue-grounded
API. **Do not** reach into Prisma or provider adapters from the frontend — consume the API.

## Consume this
- **Envelope:** every `/api/v1` response is `{ data, error, meta, requestId }`. On error, `data` is
  null and `error` = `{ code, message, fieldErrors? }`. Show `error.message` to users; branch on
  `error.code`.
- **Contracts:** `contracts/storefront-api.openapi.yaml` (paths + schemas),
  `contracts/error-catalogue.md` (codes → meaning), `contracts/events.md` (analytics events),
  `contracts/data-dictionary.md` (public vs private fields), `contracts/webhooks.md`.
- **Types:** generate a client from the OpenAPI file (e.g. `openapi-typescript`) or mirror the
  envelope types from `lib/http/envelope.ts`. Contract tests (`tests/contract`) fail if backend codes
  drift from the docs.

## Rules for the frontend
- Never mark an order paid client-side; rely on order status from the API (server-verified).
- Prices/totals/stock are authoritative from the server — the API rejects mismatches
  (`PRICE_MISMATCH`, `TOTAL_MISMATCH`, `INSUFFICIENT_STOCK`).
- Free-shipping threshold and fees come from the API/config, not a hard-coded value.
- Recommendations/concierge only return real, in-catalogue, available products (or explicitly
  labelled preorder/waitlist).

## Local development
```bash
npm install
cp .env.example .env          # set DATABASE_URL; leave provider keys blank to use mocks
npx prisma migrate deploy     # or: npx prisma migrate dev
npx prisma db seed            # loads perfume fixtures (non-production)
npm run dev
```
Without provider keys: commerce = local Postgres, payments = mock, AI = mock, messaging = off.

## Testing / quality
```bash
npm run test        # vitest unit + contract tests (no DB required)
npm run typecheck   # tsc --noEmit
npm run lint        # eslint
npx tsx scripts/migrate/validate.ts   # read-only migration validation (no-ops without DB)
```

## Enabling integrations (owner)
Set the relevant `.env` keys (`PAYSTACK_*` test keys, `RESEND_API_KEY`, `SHOPIFY_*`, `AI_PROVIDER`
+ key, `WHATSAPP_*`/`TWILIO_*`) and toggle `FEATURE_FLAGS`. `registry.providerStatus()` and
`lib/env.integrationStatus()` report what is active. Nothing sends real messages or makes live
charges until real keys are supplied and reviewed.

## Where things live
See `docs/BACKEND_ARCHITECTURE.md`. Provider selection: `integrations/registry.ts`. Policy:
`lib/config/`. Errors/envelope: `lib/http/`. AI: `integrations/ai/`. Data model: `docs/DATA_MODEL.md`.
