-- First update any products/categories using WATCHES or GLASSES to PERFUMES
UPDATE "Product" SET category = 'PERFUMES' WHERE category IN ('WATCHES', 'GLASSES');
UPDATE "Category" SET "enumKey" = 'PERFUMES' WHERE "enumKey" IN ('WATCHES', 'GLASSES');

-- Create new enum with only PERFUMES
CREATE TYPE "ProductCategory_new" AS ENUM ('PERFUMES');

-- Switch Product.category to new enum
ALTER TABLE "Product" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "Product" ALTER COLUMN "category" TYPE "ProductCategory_new" USING (category::text::"ProductCategory_new");
ALTER TABLE "Product" ALTER COLUMN "category" SET DEFAULT 'PERFUMES'::"ProductCategory_new";

-- Switch Category.enumKey to new enum (nullable: preserve NULL)
ALTER TABLE "Category" ALTER COLUMN "enumKey" TYPE "ProductCategory_new" USING (CASE WHEN "enumKey" IS NOT NULL THEN "enumKey"::text::"ProductCategory_new" ELSE NULL END);

-- Drop old enum and rename new
DROP TYPE "ProductCategory";
ALTER TYPE "ProductCategory_new" RENAME TO "ProductCategory";
