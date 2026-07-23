CREATE TYPE "PaymentAttemptStatus" AS ENUM (
  'INITIALIZED',
  'PENDING',
  'SUCCEEDED',
  'FAILED',
  'ABANDONED',
  'REFUNDED'
);

CREATE TABLE "CheckoutAttempt" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "idempotencyKey" TEXT NOT NULL,
  "requestHash" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CheckoutAttempt_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PaymentAttempt" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "provider" TEXT NOT NULL DEFAULT 'paystack',
  "providerReference" TEXT NOT NULL,
  "idempotencyKey" TEXT NOT NULL,
  "expectedAmountNGN" INTEGER NOT NULL,
  "expectedCurrency" TEXT NOT NULL,
  "status" "PaymentAttemptStatus" NOT NULL DEFAULT 'INITIALIZED',
  "authorizationUrl" TEXT,
  "providerTransactionId" TEXT,
  "failureCode" TEXT,
  "initializedAt" TIMESTAMP(3),
  "verifiedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "PaymentAttempt_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CheckoutAttempt_orderId_key" ON "CheckoutAttempt"("orderId");
CREATE UNIQUE INDEX "CheckoutAttempt_userId_idempotencyKey_key"
  ON "CheckoutAttempt"("userId", "idempotencyKey");
CREATE INDEX "CheckoutAttempt_expiresAt_idx" ON "CheckoutAttempt"("expiresAt");

CREATE UNIQUE INDEX "PaymentAttempt_providerReference_key"
  ON "PaymentAttempt"("providerReference");
CREATE UNIQUE INDEX "PaymentAttempt_idempotencyKey_key"
  ON "PaymentAttempt"("idempotencyKey");
CREATE INDEX "PaymentAttempt_orderId_status_idx"
  ON "PaymentAttempt"("orderId", "status");
CREATE INDEX "PaymentAttempt_status_createdAt_idx"
  ON "PaymentAttempt"("status", "createdAt");

ALTER TABLE "CheckoutAttempt"
  ADD CONSTRAINT "CheckoutAttempt_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "CheckoutAttempt"
  ADD CONSTRAINT "CheckoutAttempt_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "Order"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "PaymentAttempt"
  ADD CONSTRAINT "PaymentAttempt_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "Order"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
