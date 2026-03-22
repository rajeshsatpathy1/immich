import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';
import { Highlight } from 'src/database';
import { HistoryBuilder } from 'src/decorators';
import { AssetResponseDto, mapAsset } from 'src/dtos/asset-response.dto';
import { AuthDto } from 'src/dtos/auth.dto';
import { HighlightType } from 'src/enum';
import { Optional, ValidateBoolean, ValidateEnum, ValidateUUID } from 'src/validation';

export class HighlightSearchDto {
  @ValidateEnum({ enum: HighlightType, name: 'HighlightType', description: 'Highlight type', optional: true })
  type?: HighlightType;

  @ValidateBoolean({ optional: true, description: 'Filter by pinned status' })
  isPinned?: boolean;

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  @Optional()
  @ApiProperty({ type: 'integer', description: 'Number of highlights to return' })
  size?: number;
}

export class HighlightCreateDto {
  @ApiProperty({ description: 'Highlight name' })
  name!: string;

  @ApiProperty({ description: 'Highlight description', required: false })
  @Optional()
  description?: string;

  @ValidateEnum({ enum: HighlightType, name: 'HighlightType', description: 'Highlight type' })
  type!: HighlightType;

  @ValidateUUID({
    optional: true,
    description: 'Source tag ID for auto-curated highlights',
    history: new HistoryBuilder().added('v2.6.0').stable('v2.6.0'),
  })
  sourceTagId?: string;

  @ValidateUUID({ optional: true, each: true, description: 'Asset IDs to include in highlight' })
  assetIds?: string[];

  @ValidateBoolean({ optional: true, description: 'Pin this highlight' })
  isPinned?: boolean;
}

export class HighlightUpdateDto {
  @ApiProperty({ description: 'Highlight name', required: false })
  @Optional()
  name?: string;

  @ApiProperty({ description: 'Highlight description', required: false })
  @Optional()
  description?: string;

  @ValidateBoolean({ optional: true, description: 'Pin this highlight' })
  isPinned?: boolean;

  @ValidateUUID({ optional: true, description: 'Thumbnail asset ID' })
  thumbnailAssetId?: string;
}

export class HighlightGenerateDto {
  @ValidateUUID({ description: 'Source tag ID to generate highlight from' })
  sourceTagId!: string;

  @ApiProperty({ description: 'Highlight name', required: false })
  @Optional()
  name?: string;
}

export class HighlightGenerateFromAlbumDto {
  @ValidateUUID({ description: 'Album ID to generate highlight from' })
  albumId!: string;

  @ApiProperty({ description: 'Highlight name', required: false })
  @Optional()
  name?: string;
}

export class HighlightResponseDto {
  @ApiProperty({ description: 'Highlight ID' })
  id!: string;
  @ApiProperty({ description: 'Creation date' })
  createdAt!: Date;
  @ApiProperty({ description: 'Last update date' })
  updatedAt!: Date;
  @ApiProperty({ description: 'Owner user ID' })
  ownerId!: string;
  @ApiProperty({ description: 'Highlight name' })
  name!: string;
  @ApiProperty({ description: 'Highlight description' })
  description!: string;
  @ValidateEnum({ enum: HighlightType, name: 'HighlightType', description: 'Highlight type' })
  type!: HighlightType;
  @ApiProperty({ description: 'Is highlight pinned' })
  isPinned!: boolean;
  @ApiProperty({ description: 'Source tag ID', nullable: true })
  sourceTagId!: string | null;
  @ApiProperty({ description: 'Thumbnail asset ID', nullable: true })
  thumbnailAssetId!: string | null;
  @ApiProperty({ description: 'Assets in highlight' })
  assets!: AssetResponseDto[];
}

export const mapHighlight = (entity: Highlight | Record<string, any>, auth: AuthDto): HighlightResponseDto => {
  return {
    id: entity.id,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
    ownerId: entity.ownerId,
    name: entity.name,
    description: entity.description,
    type: entity.type as HighlightType,
    isPinned: entity.isPinned,
    sourceTagId: entity.sourceTagId,
    thumbnailAssetId: entity.thumbnailAssetId,
    assets: ('assets' in entity ? (entity.assets as any[]) : []).map((asset) => mapAsset(asset, { auth })),
  };
};
