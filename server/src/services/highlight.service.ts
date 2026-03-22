import { BadRequestException, Injectable } from '@nestjs/common';
import { OnJob } from 'src/decorators';
import { BulkIdResponseDto, BulkIdsDto } from 'src/dtos/asset-ids.response.dto';
import { AuthDto } from 'src/dtos/auth.dto';
import {
  HighlightCreateDto,
  HighlightGenerateDto,
  HighlightGenerateFromAlbumDto,
  HighlightResponseDto,
  HighlightSearchDto,
  HighlightUpdateDto,
  mapHighlight,
} from 'src/dtos/highlight.dto';
import { HighlightType, JobName, Permission, QueueName } from 'src/enum';
import { BaseService } from 'src/services/base.service';
import { addAssets, removeAssets } from 'src/utils/asset.util';
import { DEFAULT_SCORING_CONFIG, ScoringAsset, ScoringConfig, selectTopAssets } from 'src/utils/scoring';

@Injectable()
export class HighlightService extends BaseService {
  @OnJob({ name: JobName.HighlightGenerate, queue: QueueName.BackgroundTask })
  async onHighlightGenerate() {
    const users = await this.userRepository.getList({ withDeleted: false });

    for (const user of users) {
      try {
        await this.generateAutoHighlightsForUser(user.id);
      } catch (error) {
        this.logger.error(`Failed to generate highlights for user ${user.id}: ${error}`);
      }
    }
  }

  private async generateAutoHighlightsForUser(ownerId: string) {
    // Find all auto-curated highlights that have a source tag
    const highlights = await this.highlightRepository.search(ownerId, { type: HighlightType.Auto });

    for (const highlight of highlights) {
      if (!highlight.sourceTagId) {
        continue;
      }

      try {
        await this.regenerateHighlight(ownerId, highlight.id, highlight.sourceTagId);
      } catch (error) {
        this.logger.error(`Failed to regenerate highlight ${highlight.id}: ${error}`);
      }
    }
  }

  private async regenerateHighlight(ownerId: string, highlightId: string, sourceTagId: string) {
    const tagAssets = await this.highlightRepository.getAssetsByTagId(sourceTagId);

    if (tagAssets.length === 0) {
      return;
    }

    const scoringAssets: ScoringAsset[] = tagAssets.map((asset) => ({
      id: asset.id,
      fileCreatedAt: asset.fileCreatedAt,
      isFavorite: asset.isFavorite,
      width: asset.width ?? undefined,
      height: asset.height ?? undefined,
    }));

    const config: ScoringConfig = { ...DEFAULT_SCORING_CONFIG };
    const topAssets = selectTopAssets(scoringAssets, config);
    const topAssetIds = new Set(topAssets.map((a) => a.asset.id));

    // Remove all existing assets from this highlight
    const existingAssetIds = await this.highlightRepository.getAssetIds(
      highlightId,
      tagAssets.map((a) => a.id),
    );

    if (existingAssetIds.size > 0) {
      await this.highlightRepository.removeAssetIds(highlightId, [...existingAssetIds]);
    }

    // Add top assets
    await this.highlightRepository.addAssetIds(highlightId, [...topAssetIds]);

    // Store scores
    const scores = new Map(topAssets.map((a) => [a.asset.id, a.score]));
    await this.highlightRepository.updateAssetScores(highlightId, scores);

    // Set thumbnail to highest scored asset
    if (topAssets.length > 0) {
      const bestAsset = [...topAssets].sort((a, b) => b.score - a.score)[0];
      await this.highlightRepository.update(highlightId, { thumbnailAssetId: bestAsset.asset.id });
    }
  }

  async search(auth: AuthDto, dto: HighlightSearchDto): Promise<HighlightResponseDto[]> {
    const highlights = await this.highlightRepository.search(auth.user.id, dto);
    return highlights.map((highlight) => mapHighlight(highlight, auth));
  }

  async get(auth: AuthDto, id: string): Promise<HighlightResponseDto> {
    await this.requireAccess({ auth, permission: Permission.HighlightRead, ids: [id] });
    const highlight = await this.findOrFail(id);
    return mapHighlight(highlight, auth);
  }

  async create(auth: AuthDto, dto: HighlightCreateDto): Promise<HighlightResponseDto> {
    const assetIds = dto.assetIds || [];
    const allowedAssetIds = await this.checkAccess({
      auth,
      permission: Permission.AssetShare,
      ids: assetIds,
    });

    const highlight = await this.highlightRepository.create(
      {
        ownerId: auth.user.id,
        name: dto.name,
        description: dto.description || '',
        type: dto.type,
        isPinned: dto.isPinned ?? false,
        sourceTagId: dto.sourceTagId ?? null,
        thumbnailAssetId: null,
      },
      allowedAssetIds,
    );

    // If auto type with source tag, run initial generation
    if (dto.type === HighlightType.Auto && dto.sourceTagId) {
      await this.regenerateHighlight(auth.user.id, highlight.id, dto.sourceTagId);
      // Re-fetch to get updated assets
      const updated = await this.findOrFail(highlight.id);
      return mapHighlight(updated, auth);
    }

    // For manual, set thumbnail to first allowed asset
    if (allowedAssetIds.size > 0) {
      const firstAssetId = [...allowedAssetIds][0];
      await this.highlightRepository.update(highlight.id, { thumbnailAssetId: firstAssetId });
    }

    return mapHighlight(highlight, auth);
  }

  async update(auth: AuthDto, id: string, dto: HighlightUpdateDto): Promise<HighlightResponseDto> {
    await this.requireAccess({ auth, permission: Permission.HighlightUpdate, ids: [id] });

    const highlight = await this.highlightRepository.update(id, {
      name: dto.name,
      description: dto.description,
      isPinned: dto.isPinned,
      thumbnailAssetId: dto.thumbnailAssetId,
    });

    return mapHighlight(highlight, auth);
  }

  async remove(auth: AuthDto, id: string): Promise<void> {
    await this.requireAccess({ auth, permission: Permission.HighlightDelete, ids: [id] });
    await this.highlightRepository.delete(id);
  }

  async generate(auth: AuthDto, dto: HighlightGenerateDto): Promise<HighlightResponseDto> {
    const name = dto.name || 'Auto Highlight';

    // Check if an auto-highlight already exists for this tag
    const existing = await this.highlightRepository.findBySourceTag(auth.user.id, dto.sourceTagId);

    if (existing) {
      // Regenerate existing highlight
      await this.regenerateHighlight(auth.user.id, existing.id, dto.sourceTagId);
      const updated = await this.findOrFail(existing.id);
      return mapHighlight(updated, auth);
    }

    // Create new auto highlight and generate
    const highlight = await this.highlightRepository.create(
      {
        ownerId: auth.user.id,
        name,
        type: HighlightType.Auto,
        sourceTagId: dto.sourceTagId,
        thumbnailAssetId: null,
      },
      new Set(),
    );

    await this.regenerateHighlight(auth.user.id, highlight.id, dto.sourceTagId);
    const updated = await this.findOrFail(highlight.id);
    return mapHighlight(updated, auth);
  }

  async generateFromAlbum(auth: AuthDto, dto: HighlightGenerateFromAlbumDto): Promise<HighlightResponseDto> {
    await this.requireAccess({ auth, permission: Permission.AlbumRead, ids: [dto.albumId] });

    const album = await this.albumRepository.getById(dto.albumId, { withAssets: false });
    if (!album) {
      throw new BadRequestException('Album not found');
    }

    const albumAssets = await this.highlightRepository.getAssetsByAlbumId(dto.albumId);
    const config: ScoringConfig = { ...DEFAULT_SCORING_CONFIG };

    if (albumAssets.length < config.maxPhotos) {
      throw new BadRequestException(`Album must have at least ${config.maxPhotos} photos to generate a highlight`);
    }

    const scoringAssets: ScoringAsset[] = albumAssets.map((asset) => ({
      id: asset.id,
      fileCreatedAt: asset.fileCreatedAt,
      isFavorite: asset.isFavorite,
      width: asset.width ?? undefined,
      height: asset.height ?? undefined,
    }));

    const topAssets = selectTopAssets(scoringAssets, config);
    const topAssetIds = new Set(topAssets.map((a) => a.asset.id));
    const name = dto.name || `Best of ${album.albumName}`;

    const highlight = await this.highlightRepository.create(
      {
        ownerId: auth.user.id,
        name,
        description: '',
        type: HighlightType.Manual,
        sourceTagId: null,
        thumbnailAssetId: null,
        isPinned: false,
      },
      topAssetIds,
    );

    const scores = new Map(topAssets.map((a) => [a.asset.id, a.score]));
    await this.highlightRepository.updateAssetScores(highlight.id, scores);

    if (topAssets.length > 0) {
      const bestAsset = [...topAssets].sort((a, b) => b.score - a.score)[0];
      await this.highlightRepository.update(highlight.id, { thumbnailAssetId: bestAsset.asset.id });
    }

    const updated = await this.findOrFail(highlight.id);
    return mapHighlight(updated, auth);
  }

  async addAssets(auth: AuthDto, id: string, dto: BulkIdsDto): Promise<BulkIdResponseDto[]> {
    await this.requireAccess({ auth, permission: Permission.HighlightRead, ids: [id] });

    const repos = { access: this.accessRepository, bulk: this.highlightRepository };
    const results = await addAssets(auth, repos, { parentId: id, assetIds: dto.ids });

    const hasSuccess = results.find(({ success }) => success);
    if (hasSuccess) {
      await this.highlightRepository.update(id, { updatedAt: new Date() });
    }

    return results;
  }

  async removeAssets(auth: AuthDto, id: string, dto: BulkIdsDto): Promise<BulkIdResponseDto[]> {
    await this.requireAccess({ auth, permission: Permission.HighlightUpdate, ids: [id] });

    const repos = { access: this.accessRepository, bulk: this.highlightRepository };
    const results = await removeAssets(auth, repos, {
      parentId: id,
      assetIds: dto.ids,
      canAlwaysRemove: Permission.HighlightDelete,
    });

    const hasSuccess = results.find(({ success }) => success);
    if (hasSuccess) {
      await this.highlightRepository.update(id, { updatedAt: new Date() });
    }

    return results;
  }

  private async findOrFail(id: string) {
    const highlight = await this.highlightRepository.get(id);
    if (!highlight) {
      throw new BadRequestException('Highlight not found');
    }
    return highlight;
  }
}
