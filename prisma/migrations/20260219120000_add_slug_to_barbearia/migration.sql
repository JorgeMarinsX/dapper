-- AlterTable: add slug column (nullable first for existing rows)
ALTER TABLE "Barbearia" ADD COLUMN "slug" TEXT;

-- Backfill: generate slugs from nome for existing rows
UPDATE "Barbearia" SET "slug" = LOWER(REGEXP_REPLACE(REGEXP_REPLACE("nome", '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));

-- Make slug NOT NULL after backfill
ALTER TABLE "Barbearia" ALTER COLUMN "slug" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Barbearia_slug_key" ON "Barbearia"("slug");
