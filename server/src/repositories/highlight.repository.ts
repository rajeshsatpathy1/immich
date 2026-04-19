import { Injectable } from '@nestjs/common';
import { Insertable, Kysely, Updateable, sql } from 'kysely';
import { jsonArrayFrom } from 'kysely/helpers/postgres';
import { InjectKysely } from 'nestjs-kysely';
import { Chunked, ChunkedSet, DummyValue, GenerateSql } from 'src/decorators';
import { HighlightSearchDto } from 'src/dtos/highlight.dto';
import { AssetVisibility } from 'src/enum';
import { DB } from 'src/schema';
import { HighlightTable } from 'src/schema/tables/highlight.table';
import { IBulkAsset } from 'src/types';

@Injectable()
export class HighlightRepository implements IBulkAsset {
  constructor(@InjectKysely() private db: Kysely<DB>) {}

  @GenerateSql({ params: [DummyValue.UUID, {}] })
  search(ownerId: string, dto: HighlightSearchDto) {
    return this.db
      .selectFrom('highlight')
      .selectAll('highlight')
      .select((eb) =>
        jsonArrayFrom(
          eb
            .selectFrom('asset')
            .selectAll('asset')
            .innerJoin('highlight_asset', 'asset.id', 'highlight_asset.assetId')
            .whereRef('highlight_asset.highlightId', '=', 'highlight.id')
            .orderBy('highlight_asset.position', 'asc')
            .where('asset.visibility', '=', sql.lit(AssetVisibility.Timeline))
            .where('asset.deletedAt', 'is', null),
        ).as('assets'),
      )
      .$if(dto.type !== undefined, (qb) => qb.where('type', '=', dto.type!))
      .$if(dto.isPinned !== undefined, (qb) => qb.where('isPinned', '=', dto.isPinned!))
      .where('ownerId', '=', ownerId)
      .where('deletedAt', 'is', null)
      .orderBy('isPinned', 'desc')
      .orderBy('updatedAt', 'desc')
      .$if(dto.size !== undefined, (qb) => qb.limit(dto.size!))
      .execute();
  }

  @GenerateSql({ params: [DummyValue.UUID] })
  get(id: string) {
    return this.getByIdBuilder(id).executeTakeFirst();
  }

  async create(highlight: Insertable<HighlightTable>, assetIds: Set<string>) {
    const id = await this.db.transaction().execute(async (tx) => {
      const { id } = await tx.insertInto('highlight').values(highlight).returning('id').executeTakeFirstOrThrow();

      if (assetIds.size > 0) {
        const values = [...assetIds].map((assetId, index) => ({
          highlightId: id,
          assetId,
          position: index,
        }));
        await tx.insertInto('highlight_asset').values(values).execute();
      }

      return id;
    });

    return this.getByIdBuilder(id).executeTakeFirstOrThrow();
  }

  @GenerateSql({ params: [DummyValue.UUID, { name: 'Updated Highlight' }] })
  async update(id: string, highlight: Updateable<HighlightTable>) {
    await this.db.updateTable('highlight').set(highlight).where('id', '=', id).execute();
    return this.getByIdBuilder(id).executeTakeFirstOrThrow();
  }

  @GenerateSql({ params: [DummyValue.UUID] })
  async delete(id: string) {
    await this.db.deleteFrom('highlight').where('id', '=', id).execute();
  }

  @GenerateSql({ params: [DummyValue.UUID, [DummyValue.UUID]] })
  @ChunkedSet({ paramIndex: 1 })
  async getAssetIds(id: string, assetIds: string[]) {
    if (assetIds.length === 0) {
      return new Set<string>();
    }

    const results = await this.db
      .selectFrom('highlight_asset')
      .select(['assetId'])
      .where('highlightId', '=', id)
      .where('assetId', 'in', assetIds)
      .execute();

    return new Set(results.map(({ assetId }) => assetId));
  }

  @GenerateSql({ params: [DummyValue.UUID, [DummyValue.UUID]] })
  async addAssetIds(id: string, assetIds: string[]) {
    if (assetIds.length === 0) {
      return;
    }

    // Get max position for this highlight
    const maxPos = await this.db
      .selectFrom('highlight_asset')
      .select((eb) => eb.fn.max<number>('position').as('maxPosition'))
      .where('highlightId', '=', id)
      .executeTakeFirst();

    const startPosition = (maxPos?.maxPosition ?? -1) + 1;

    await this.db
      .insertInto('highlight_asset')
      .values(assetIds.map((assetId, index) => ({ highlightId: id, assetId, position: startPosition + index })))
      .execute();
  }

  @Chunked({ paramIndex: 1 })
  @GenerateSql({ params: [DummyValue.UUID, [DummyValue.UUID]] })
  async removeAssetIds(id: string, assetIds: string[]) {
    if (assetIds.length === 0) {
      return;
    }

    await this.db
      .deleteFrom('highlight_asset')
      .where('highlightId', '=', id)
      .where('assetId', 'in', assetIds)
      .execute();
  }

  @GenerateSql({ params: [DummyValue.UUID] })
  getAssetsByTagId(tagId: string) {
    return this.db
      .selectFrom('asset')
      .selectAll('asset')
      .leftJoin('asset_aesthetic_score', 'asset_aesthetic_score.assetId', 'asset.id')
      .select('asset_aesthetic_score.score as aestheticScore')
      .innerJoin('tag_asset', 'asset.id', 'tag_asset.assetId')
      .where('tag_asset.tagId', '=', tagId)
      .where('asset.visibility', '=', sql.lit(AssetVisibility.Timeline))
      .where('asset.deletedAt', 'is', null)
      .execute();
  }

  @GenerateSql({ params: [DummyValue.UUID] })
  getAssetsByAlbumId(albumId: string) {
    return this.db
      .selectFrom('asset')
      .selectAll('asset')
      .leftJoin('asset_aesthetic_score', 'asset_aesthetic_score.assetId', 'asset.id')
      .select('asset_aesthetic_score.score as aestheticScore')
      .innerJoin('album_asset', 'asset.id', 'album_asset.assetId')
      .where('album_asset.albumId', '=', albumId)
      .where('asset.visibility', '=', sql.lit(AssetVisibility.Timeline))
      .where('asset.deletedAt', 'is', null)
      .execute();
  }

  @GenerateSql({ params: [DummyValue.UUID, DummyValue.UUID] })
  findBySourceTag(ownerId: string, sourceTagId: string) {
    return this.db
      .selectFrom('highlight')
      .selectAll('highlight')
      .where('ownerId', '=', ownerId)
      .where('sourceTagId', '=', sourceTagId)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
  }

  /**
   * Update asset scores in highlight_asset table (batch operation)
   */
  async updateAssetScores(highlightId: string, scores: Map<string, number>) {
    if (scores.size === 0) {
      return;
    }

    for (const [assetId, score] of scores) {
      await this.db
        .updateTable('highlight_asset')
        .set({ score })
        .where('highlightId', '=', highlightId)
        .where('assetId', '=', assetId)
        .execute();
    }
  }

  private getByIdBuilder(id: string) {
    return this.db
      .selectFrom('highlight')
      .selectAll('highlight')
      .select((eb) =>
        jsonArrayFrom(
          eb
            .selectFrom('asset')
            .selectAll('asset')
            .innerJoin('highlight_asset', 'asset.id', 'highlight_asset.assetId')
            .whereRef('highlight_asset.highlightId', '=', 'highlight.id')
            .orderBy('highlight_asset.position', 'asc')
            .where('asset.visibility', '=', sql.lit(AssetVisibility.Timeline))
            .where('asset.deletedAt', 'is', null),
        ).as('assets'),
      )
      .where('id', '=', id)
      .where('deletedAt', 'is', null);
  }
}
