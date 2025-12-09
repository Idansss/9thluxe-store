# Regenerating Prisma Client

After adding the `deletedAt` field to the Product model, you need to regenerate the Prisma client.

## Steps:

1. **Stop your Next.js dev server** (press `Ctrl+C` in the terminal where it's running)

2. **Regenerate Prisma client:**
   ```bash
   npx prisma generate
   ```

3. **Re-enable the deletedAt filter** in `lib/services/product-service.ts`:
   - Uncomment line 108: `where.deletedAt = null`
   - Change line 96 from `const where: any = {` to `const where: Prisma.ProductWhereInput = {`

4. **Restart your dev server:**
   ```bash
   npm run dev
   ```

The app will work without the `deletedAt` filter temporarily, but soft deletion won't work until you complete these steps.

