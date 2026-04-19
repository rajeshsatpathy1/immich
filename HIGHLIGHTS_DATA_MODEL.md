# Highlights Data Model — Design Doc

## Overview

A **highlight** is a curated collection of best photos, either manually picked or auto-generated from a tag using a scoring algorithm. This document covers the database tables, enums, types, and migrations that support highlights.

---

## Entity Relationship

```mermaid
erDiagram
    user ||--o{ highlight : owns
    tag ||--o{ highlight : "source (optional)"
    highlight ||--o{ highlight_asset : contains
    asset ||--o{ highlight_asset : "included in"
    asset ||--o| highlight : "thumbnail (optional)"
    asset ||--o| asset_aesthetic_score : "scored by ML"

    highlight {
        uuid id PK
        uuid ownerId FK
        varchar name
        text description
        varchar type "manual | auto"
        boolean isPinned
        uuid sourceTagId FK "nullable"
        uuid thumbnailAssetId FK "nullable"
        jsonb scoringConfig
        uuid updateId "for sync clients"
        timestamptz createdAt
        timestamptz updatedAt
        timestamptz deletedAt "soft delete"
    }

    highlight_asset {
        uuid highlightId PK_FK
        uuid assetId PK_FK
        integer position "display order"
        real score "nullable"
        uuid updateId "for sync clients"
        timestamptz createdAt
        timestamptz updatedAt
    }

    highlight_audit {
        uuid id PK
        uuid highlightId
        uuid userId
        timestamptz deletedAt
    }

    highlight_asset_audit {
        uuid id PK
        uuid highlightId
        uuid assetId
        timestamptz deletedAt
    }

    asset_aesthetic_score {
        uuid assetId PK_FK
        real score "LAION predictor output in [0, 10]"
    }

    highlight ||--o{ highlight_audit : "delete triggers"
    highlight_asset ||--o{ highlight_asset_audit : "delete triggers"
```

---

## Audit Trigger Flow

When a highlight or its assets are deleted, audit triggers automatically log the deletion for sync clients.

```mermaid
flowchart LR
    A["DELETE highlight"] --> B["highlight_delete_audit()"]
    B --> C["INSERT into highlight_audit"]

    D["DELETE highlight_asset"] --> E["highlight_asset_delete_audit()"]
    E --> F["INSERT into highlight_asset_audit"]

    style B fill:#ffd93d,color:#000
    style E fill:#ffd93d,color:#000
```

---

## Highlight Types

```mermaid
flowchart TD
    H["Highlight"]
    H -->|type = manual| M["User picks photos directly"]
    H -->|type = auto| A["Scored from a source tag"]
    A --> S["Scoring engine selects top N"]

    style M fill:#95e1d3,color:#000
    style A fill:#6ec6ff,color:#000
```

---

## Files

### New Files

| File | Description |
| ---- | ----------- |
| `server/src/schema/tables/highlight.table.ts` | Main highlight table — name, type, owner, optional source tag and thumbnail reference, `updateId` for sync. |
| `server/src/schema/tables/highlight-asset.table.ts` | Junction table linking highlights to assets with position (ordering), score, and `updateId` for sync. |
| `server/src/schema/tables/highlight-audit.table.ts` | Audit log for deleted highlights, populated by a DB trigger. |
| `server/src/schema/tables/highlight-asset-audit.table.ts` | Audit log for deleted highlight-asset links, populated by a DB trigger. |
| `server/src/schema/tables/asset-aesthetic-score.table.ts` | 1:1 table storing the LAION aesthetic predictor score for each asset. |
| `server/src/schema/migrations/1774119968576-AddHighlightTables.ts` | Creates all 4 highlight tables, constraints, indexes, and audit triggers. |
| `server/src/schema/migrations/1774200000000-AddAestheticScoring.ts` | Creates `asset_aesthetic_score` table and adds `aestheticScoredAt` to `asset_job_status`. |

### Modified Files

| File | What Changed |
| ---- | ------------ |
| `server/src/schema/functions.ts` | Added `highlight_delete_audit` and `highlight_asset_delete_audit` trigger functions. |
| `server/src/schema/index.ts` | Registered the 5 new tables and 2 new trigger functions in the schema. |
| `server/src/schema/tables/asset-job-status.table.ts` | Added `aestheticScoredAt` timestamp column to track ML scoring progress. |
| `server/src/enum.ts` | Added `HighlightType` (`Manual`, `Auto`), `Permission.Highlight*` entries, `ManualJobName.HighlightGenerate`, `JobName.HighlightGenerate`, and `ChecksumAlgorithm`. |
| `server/src/database.ts` | Added the `Highlight` TypeScript type used by repositories and services. |
| `server/src/constants.ts` | Added `ApiTag.Highlights` endpoint description string. |
| `server/src/types.ts` | Added `JobName.HighlightGenerate` to the `JobItem` union type. |
