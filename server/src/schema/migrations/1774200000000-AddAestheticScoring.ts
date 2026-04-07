import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // Add aestheticScoredAt sentinel column to job status table
  await sql`ALTER TABLE "asset_job_status" ADD COLUMN IF NOT EXISTS "aestheticScoredAt" timestamp with time zone`.execute(
    db,
  );

  // Create per-asset aesthetic score cache table
  await sql`CREATE TABLE IF NOT EXISTS "asset_aesthetic_score" (
    "assetId" uuid NOT NULL,
    "score" real NOT NULL,
    CONSTRAINT "asset_aesthetic_score_pkey" PRIMARY KEY ("assetId"),
    CONSTRAINT "asset_aesthetic_score_assetId_fkey" FOREIGN KEY ("assetId")
      REFERENCES "asset" ("id") ON DELETE CASCADE
  )`.execute(db);
}

export async function down(db: Kysely<any>): Promise<void> {
  await sql`DROP TABLE IF EXISTS "asset_aesthetic_score"`.execute(db);
  await sql`ALTER TABLE "asset_job_status" DROP COLUMN IF EXISTS "aestheticScoredAt"`.execute(db);
}
