# Backend-Only Files List

This document lists all files that should remain in the backend-only codebase.

## Files to KEEP:

### Database
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `prisma/seed-admin.ts`

### Core Library Files
- `lib/prisma.ts`
- `lib/auth.ts`
- `lib/session.ts`
- `lib/admin.ts`
- `lib/email.ts`
- `lib/format.ts`
- `lib/pricing.ts`
- `lib/cart.ts` (moved from `components/cartActions.ts`)

### Query Functions
- `lib/queries/products.ts`
- `lib/queries/orders.ts`
- `lib/queries/users.ts`
- `lib/queries/wishlist.ts`
- `lib/queries/addresses.ts`
- `lib/queries/stats.ts`

### API Routes (all in `app/api/`)
- `app/api/auth/[...nextauth]/route.ts`
- `app/api/cart/add/route.ts`
- `app/api/cart/summary/route.ts`
- `app/api/cart/update/route.ts`
- `app/api/coupons/apply/route.ts`
- `app/api/newsletter/send/route.ts`
- `app/api/newsletter/test/route.ts`
- `app/api/paystack/initialize/route.ts`
- `app/api/paystack/webhook/route.ts`
- `app/api/products/route.ts`
- `app/api/register/route.ts`
- `app/api/reset-password/route.ts`
- `app/api/reviews/route.ts`
- `app/api/search/route.ts`
- `app/api/settings/toggle-email/route.ts`
- `app/api/settings/toggle-sms/route.ts`
- `app/api/admin/products/[id]/route.ts`
- `app/admin/orders/export/route.ts`

### Email Utilities
- `emails/sendReceipt.ts`

## Files to DELETE:

- All `components/` directory
- All `app/**/page.tsx` (except API routes)
- All `app/**/layout.tsx`
- All `app/**/loading.tsx`
- All styling files (`*.css`, `tailwind.config.ts`, etc.)
- `lib/utils.ts` (contains frontend code)
- `lib/category-data.ts` (frontend data)
- `FRONTEND/` directory (if exists)
- All frontend config files

## Changes Needed:

1. Move `components/cartActions.ts` → `lib/cart.ts`
2. Update imports in API routes from `@/components/cartActions` to `@/lib/cart`
3. Remove `lib/utils.ts` (frontend-only)
4. Remove `lib/category-data.ts` (frontend-only)

