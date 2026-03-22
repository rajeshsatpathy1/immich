import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // highlight table
  await sql`CREATE TABLE "highlight" (
    "id" uuid NOT NULL DEFAULT immich_uuid_v7(),
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now(),
    "deletedAt" timestamp with time zone,
    "ownerId" uuid NOT NULL,
    "name" character varying NOT NULL,
    "description" text NOT NULL DEFAULT '',
    "type" character varying NOT NULL,
    "isPinned" boolean NOT NULL DEFAULT false,
    "sourceTagId" uuid,
    "thumbnailAssetId" uuid,
    "scoringConfig" jsonb NOT NULL DEFAULT '{}',
    "updateId" uuid NOT NULL DEFAULT immich_uuid_v7()
  )`.execute(db);

  await sql`ALTER TABLE "highlight" ADD CONSTRAINT "highlight_pkey" PRIMARY KEY ("id")`.execute(db);
  await sql`ALTER TABLE "highlight" ADD CONSTRAINT "highlight_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON UPDATE CASCADE ON DELETE CASCADE`.execute(db);
  await sql`ALTER TABLE "highlight" ADD CONSTRAINT "highlight_sourceTagId_fkey" FOREIGN KEY ("sourceTagId") REFERENCES "tag" ("id") ON UPDATE CASCADE ON DELETE SET NULL`.execute(db);
  await sql`ALTER TABLE "highlight" ADD CONSTRAINT "highlight_thumbnailAssetId_fkey" FOREIGN KEY ("thumbnailAssetId") REFERENCES "asset" ("id") ON UPDATE CASCADE ON DELETE SET NULL`.execute(db);
  await sql`CREATE INDEX "highlight_ownerId_idx" ON "highlight" ("ownerId")`.execute(db);
  await sql`CREATE INDEX "highlight_updateId_idx" ON "highlight" ("updateId")`.execute(db);

  await sql`CREATE OR REPLACE TRIGGER "highlight_updatedAt"
    BEFORE UPDATE ON "highlight"
    FOR EACH ROW
    EXECUTE FUNCTION updated_at()`.execute(db);

  // highlight_audit table
  await sql`CREATE TABLE "highlight_audit" (
    "id" uuid NOT NULL DEFAULT immich_uuid_v7(),
    "highlightId" uuid NOT NULL,
    "userId" uuid NOT NULL,
    "deletedAt" timestamp with time zone NOT NULL DEFAULT clock_timestamp()
  )`.execute(db);

  await sql`ALTER TABLE "highlight_audit" ADD CONSTRAINT "highlight_audit_pkey" PRIMARY KEY ("id")`.execute(db);
  await sql`CREATE INDEX "highlight_audit_highlightId_idx" ON "highlight_audit" ("highlightId")`.execute(db);
  await sql`CREATE INDEX "highlight_audit_userId_idx" ON "highlight_audit" ("userId")`.execute(db);
  await sql`CREATE INDEX "highlight_audit_deletedAt_idx" ON "highlight_audit" ("deletedAt")`.execute(db);

  // highlight_delete_audit function + trigger
  await sql`CREATE OR REPLACE FUNCTION highlight_delete_audit()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
    AS $$
      BEGIN
        INSERT INTO highlight_audit ("highlightId", "userId")
        SELECT "id", "ownerId"
        FROM OLD;
        RETURN NULL;
      END
    $$`.execute(db);

  await sql`CREATE OR REPLACE TRIGGER "highlight_delete_audit"
    AFTER DELETE ON "highlight"
    REFERENCING OLD TABLE AS "old"
    FOR EACH STATEMENT
    WHEN (pg_trigger_depth() = 0)
    EXECUTE FUNCTION highlight_delete_audit()`.execute(db);

  // highlight_asset table (junction)
  await sql`CREATE TABLE "highlight_asset" (
    "highlightId" uuid NOT NULL,
    "assetId" uuid NOT NULL,
    "position" integer NOT NULL DEFAULT 0,
    "score" real,
    "createdAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updatedAt" timestamp with time zone NOT NULL DEFAULT now(),
    "updateId" uuid NOT NULL DEFAULT immich_uuid_v7()
  )`.execute(db);

  await sql`ALTER TABLE "highlight_asset" ADD CONSTRAINT "highlight_asset_pkey" PRIMARY KEY ("highlightId", "assetId")`.execute(db);
  await sql`ALTER TABLE "highlight_asset" ADD CONSTRAINT "highlight_asset_highlightId_fkey" FOREIGN KEY ("highlightId") REFERENCES "highlight" ("id") ON UPDATE CASCADE ON DELETE CASCADE`.execute(db);
  await sql`ALTER TABLE "highlight_asset" ADD CONSTRAINT "highlight_asset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "asset" ("id") ON UPDATE CASCADE ON DELETE CASCADE`.execute(db);
  await sql`CREATE INDEX "highlight_asset_updateId_idx" ON "highlight_asset" ("updateId")`.execute(db);

  await sql`CREATE OR REPLACE TRIGGER "highlight_asset_updatedAt"
    BEFORE UPDATE ON "highlight_asset"
    FOR EACH ROW
    EXECUTE FUNCTION updated_at()`.execute(db);

  // highlight_asset_audit table
  await sql`CREATE TABLE "highlight_asset_audit" (
    "id" uuid NOT NULL DEFAULT immich_uuid_v7(),
    "highlightId" uuid NOT NULL,
    "assetId" uuid NOT NULL,
    "deletedAt" timestamp with time zone NOT NULL DEFAULT clock_timestamp()
  )`.execute(db);

  await sql`ALTER TABLE "highlight_asset_audit" ADD CONSTRAINT "highlight_asset_audit_pkey" PRIMARY KEY ("id")`.execute(db);
  await sql`ALTER TABLE "highlight_asset_audit" ADD CONSTRAINT "highlight_asset_audit_highlightId_fkey" FOREIGN KEY ("highlightId") REFERENCES "highlight" ("id") ON UPDATE CASCADE ON DELETE CASCADE`.execute(db);
  await sql`CREATE INDEX "highlight_asset_audit_highlightId_idx" ON "highlight_asset_audit" ("highlightId")`.execute(db);
  await sql`CREATE INDEX "highlight_asset_audit_assetId_idx" ON "highlight_asset_audit" ("assetId")`.execute(db);
  await sql`CREATE INDEX "highlight_asset_audit_deletedAt_idx" ON "highlight_asset_audit" ("deletedAt")`.execute(db);

  // highlight_asset_delete_audit function + trigger
  await sql`CREATE OR REPLACE FUNCTION highlight_asset_delete_audit()
    RETURNS TRIGGER
    LANGUAGE PLPGSQL
    AS $$
      BEGIN
        INSERT INTO highlight_asset_audit ("highlightId", "assetId")
        SELECT "highlightId", "assetId" FROM OLD
        WHERE "highlightId" IN (SELECT "id" FROM highlight WHERE "id" IN (SELECT "highlightId" FROM OLD));
        RETURN NULL;
      END
    $$`.execute(db);

  await sql`CREATE OR REPLACE TRIGGER "highlight_asset_delete_audit"
    AFTER DELETE ON "highlight_asset"
    REFERENCING OLD TABLE AS "old"
    FOR EACH STATEMENT
    WHEN (pg_trigger_depth() <= 1)
    EXECUTE FUNCTION highlight_asset_delete_audit()`.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP TRIGGER IF EXISTS "highlight_asset_delete_audit" ON "highlight_asset"`.execute(db);
  await sql`DROP FUNCTION IF EXISTS highlight_asset_delete_audit()`.execute(db);
  await sql`DROP TRIGGER IF EXISTS "highlight_asset_updatedAt" ON "highlight_asset"`.execute(db);
  await sql`DROP TABLE IF EXISTS "highlight_asset_audit"`.execute(db);
  await sql`DROP TABLE IF EXISTS "highlight_asset"`.execute(db);
  await sql`DROP TRIGGER IF EXISTS "highlight_delete_audit" ON "highlight"`.execute(db);
  await sql`DROP FUNCTION IF EXISTS highlight_delete_audit()`.execute(db);
  await sql`DROP TRIGGER IF EXISTS "highlight_updatedAt" ON "highlight"`.execute(db);
  await sql`DROP TABLE IF EXISTS "highlight_audit"`.execute(db);
  await sql`DROP TABLE IF EXISTS "highlight"`.execute(db);
}
