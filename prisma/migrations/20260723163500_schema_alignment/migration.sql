-- Align columns that were added to the Prisma schema without a corresponding migration.
ALTER TABLE "Order"
ADD COLUMN "giftMessage" TEXT,
ADD COLUMN "giftWrapping" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "isGift" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "paymentMethod" TEXT NOT NULL DEFAULT 'CARD',
ADD COLUMN "shippingNGN" INTEGER NOT NULL DEFAULT 0;

ALTER TABLE "Product"
ALTER COLUMN "category" DROP DEFAULT;

ALTER TABLE "User"
ADD COLUMN "loyaltyTier" TEXT NOT NULL DEFAULT 'STANDARD',
ADD COLUMN "referralCode" TEXT,
ADD COLUMN "referredBy" TEXT,
ADD COLUMN "totalLifetimeSpend" INTEGER NOT NULL DEFAULT 0;

CREATE INDEX "Order_userId_createdAt_idx"
ON "Order"("userId", "createdAt");

CREATE UNIQUE INDEX "User_referralCode_key"
ON "User"("referralCode");
