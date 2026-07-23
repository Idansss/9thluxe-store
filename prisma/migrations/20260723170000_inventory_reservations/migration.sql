CREATE TYPE "InventoryReservationStatus" AS ENUM (
  'RESERVED',
  'SOLD',
  'RELEASED',
  'EXPIRED'
);

CREATE TYPE "InventoryMovementReason" AS ENUM (
  'RESERVATION_CREATED',
  'RESERVATION_EXPIRED',
  'SALE_AFTER_EXPIRY',
  'LEGACY_SALE',
  'RETURN',
  'ADJUSTMENT'
);

CREATE TABLE "InventoryReservation" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "status" "InventoryReservationStatus" NOT NULL DEFAULT 'RESERVED',
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "reservedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "finalizedAt" TIMESTAMP(3),
  "releasedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "InventoryReservation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "InventoryMovement" (
  "id" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "delta" INTEGER NOT NULL,
  "reason" "InventoryMovementReason" NOT NULL,
  "sourceType" TEXT NOT NULL,
  "sourceId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "InventoryMovement_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "InventoryReservation_orderId_productId_key"
ON "InventoryReservation"("orderId", "productId");

CREATE INDEX "InventoryReservation_status_expiresAt_idx"
ON "InventoryReservation"("status", "expiresAt");

CREATE INDEX "InventoryReservation_productId_status_idx"
ON "InventoryReservation"("productId", "status");

CREATE UNIQUE INDEX "InventoryMovement_productId_reason_sourceType_sourceId_key"
ON "InventoryMovement"("productId", "reason", "sourceType", "sourceId");

CREATE INDEX "InventoryMovement_productId_createdAt_idx"
ON "InventoryMovement"("productId", "createdAt");

CREATE INDEX "InventoryMovement_sourceType_sourceId_idx"
ON "InventoryMovement"("sourceType", "sourceId");

ALTER TABLE "InventoryReservation"
ADD CONSTRAINT "InventoryReservation_orderId_fkey"
FOREIGN KEY ("orderId") REFERENCES "Order"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "InventoryReservation"
ADD CONSTRAINT "InventoryReservation_productId_fkey"
FOREIGN KEY ("productId") REFERENCES "Product"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "InventoryMovement"
ADD CONSTRAINT "InventoryMovement_productId_fkey"
FOREIGN KEY ("productId") REFERENCES "Product"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
