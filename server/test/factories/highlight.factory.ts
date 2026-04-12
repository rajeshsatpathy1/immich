import { HighlightType } from 'src/enum';
import { AssetFactory } from 'test/factories/asset.factory';
import { build } from 'test/factories/builder.factory';
import { AssetLike, FactoryBuilder } from 'test/factories/types';
import { newDate, newUuid, newUuidV7 } from 'test/small.factory';

interface HighlightRow {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  updateId: string;
  deletedAt: Date | null;
  ownerId: string;
  name: string;
  description: string;
  type: HighlightType;
  isPinned: boolean;
  sourceTagId: string | null;
  thumbnailAssetId: string | null;
  scoringConfig: object;
}

export class HighlightFactory {
  #assets: AssetFactory[] = [];

  private constructor(private readonly value: HighlightRow) {}

  static create(dto: Partial<HighlightRow> = {}) {
    return HighlightFactory.from(dto).build();
  }

  static from(dto: Partial<HighlightRow> = {}) {
    return new HighlightFactory({
      id: newUuid(),
      createdAt: newDate(),
      updatedAt: newDate(),
      updateId: newUuidV7(),
      deletedAt: null,
      ownerId: newUuid(),
      name: 'Test Highlight',
      description: '',
      type: HighlightType.Manual,
      isPinned: false,
      sourceTagId: null,
      thumbnailAssetId: null,
      scoringConfig: {},
      ...dto,
    });
  }

  asset(asset: AssetLike, builder?: FactoryBuilder<AssetFactory>) {
    this.#assets.push(build(AssetFactory.from(asset), builder));
    return this;
  }

  build() {
    return { ...this.value, assets: this.#assets.map((asset) => asset.build()) };
  }
}
