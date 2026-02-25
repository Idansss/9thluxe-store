-- AlterTable: add optional name and postalCode to Address
ALTER TABLE "Address" ADD COLUMN "name" TEXT;
ALTER TABLE "Address" ADD COLUMN "postalCode" TEXT;
