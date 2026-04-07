import { BadRequestException } from '@nestjs/common';
import { HighlightType } from 'src/enum';
import { HighlightService } from 'src/services/highlight.service';
import { AssetFactory } from 'test/factories/asset.factory';
import { HighlightFactory } from 'test/factories/highlight.factory';
import { getForHighlight } from 'test/mappers';
import { factory, newUuid, newUuids } from 'test/small.factory';
import { newTestService, ServiceMocks } from 'test/utils';

describe(HighlightService.name, () => {
  let sut: HighlightService;
  let mocks: ServiceMocks;

  beforeEach(() => {
    ({ sut, mocks } = newTestService(HighlightService));
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  describe('search', () => {
    it('should search highlights', async () => {
      const [userId] = newUuids();
      const asset = AssetFactory.create() as any;
      const highlight1 = HighlightFactory.from({ ownerId: userId }).asset(asset).build();
      const highlight2 = HighlightFactory.create({ ownerId: userId });

      mocks.highlight.search.mockResolvedValue([getForHighlight(highlight1), getForHighlight(highlight2)]);

      await expect(sut.search(factory.auth({ user: { id: userId } }), {})).resolves.toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: highlight1.id, assets: [expect.objectContaining({ id: asset.id })] }),
          expect.objectContaining({ id: highlight2.id, assets: [] }),
        ]),
      );
    });

    it('should return empty array when no highlights', async () => {
      mocks.highlight.search.mockResolvedValue([]);
      await expect(sut.search(factory.auth(), {})).resolves.toEqual([]);
    });
  });

  describe('get', () => {
    it('should throw an error when no access', async () => {
      await expect(sut.get(factory.auth(), 'not-found')).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should throw an error when highlight not found', async () => {
      const [highlightId] = newUuids();

      mocks.access.highlight.checkOwnerAccess.mockResolvedValue(new Set([highlightId]));
      mocks.highlight.get.mockResolvedValue(void 0);

      await expect(sut.get(factory.auth(), highlightId)).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should get a highlight by id', async () => {
      const userId = newUuid();
      const highlight = HighlightFactory.create({ ownerId: userId });

      mocks.highlight.get.mockResolvedValue(getForHighlight(highlight));
      mocks.access.highlight.checkOwnerAccess.mockResolvedValue(new Set([highlight.id]));

      await expect(sut.get(factory.auth({ user: { id: userId } }), highlight.id)).resolves.toMatchObject({
        id: highlight.id,
      });

      expect(mocks.highlight.get).toHaveBeenCalledWith(highlight.id);
    });
  });

  describe('create', () => {
    it('should create a manual highlight', async () => {
      const userId = newUuid();
      const highlight = HighlightFactory.create({ ownerId: userId, type: HighlightType.Manual });

      mocks.highlight.create.mockResolvedValue(getForHighlight(highlight));

      await expect(
        sut.create(factory.auth({ user: { id: userId } }), {
          name: 'My Highlight',
          type: HighlightType.Manual,
        }),
      ).resolves.toMatchObject({
        id: highlight.id,
        type: HighlightType.Manual,
      });

      expect(mocks.highlight.create).toHaveBeenCalled();
    });

    it('should create a manual highlight with assets', async () => {
      const [assetId, userId] = newUuids();
      const asset = AssetFactory.create({ id: assetId, ownerId: userId }) as any;
      const highlight = HighlightFactory.from({ ownerId: userId }).asset(asset).build();

      mocks.access.asset.checkOwnerAccess.mockResolvedValue(new Set([asset.id]));
      mocks.highlight.create.mockResolvedValue(getForHighlight(highlight));
      mocks.highlight.update.mockResolvedValue(getForHighlight(highlight));

      await expect(
        sut.create(factory.auth({ user: { id: userId } }), {
          name: 'My Highlight',
          type: HighlightType.Manual,
          assetIds: [assetId],
        }),
      ).resolves.toBeDefined();
    });

    it('should skip assets the user does not have access to', async () => {
      const [assetId, userId] = newUuids();
      const highlight = HighlightFactory.create({ ownerId: userId });

      mocks.highlight.create.mockResolvedValue(getForHighlight(highlight));

      await expect(
        sut.create(factory.auth({ user: { id: userId } }), {
          name: 'Test',
          type: HighlightType.Manual,
          assetIds: [assetId],
        }),
      ).resolves.toMatchObject({ assets: [] });

      // Should have been called with empty set since no access
      expect(mocks.highlight.create).toHaveBeenCalledWith(expect.objectContaining({ ownerId: userId }), new Set());
    });
  });

  describe('update', () => {
    it('should throw when no access', async () => {
      await expect(sut.update(factory.auth(), 'not-found', { name: 'test' })).rejects.toBeInstanceOf(
        BadRequestException,
      );
    });

    it('should update a highlight', async () => {
      const userId = newUuid();
      const highlight = HighlightFactory.create({ ownerId: userId });

      mocks.access.highlight.checkOwnerAccess.mockResolvedValue(new Set([highlight.id]));
      mocks.highlight.update.mockResolvedValue(getForHighlight({ ...highlight, name: 'Updated' }));

      await expect(
        sut.update(factory.auth({ user: { id: userId } }), highlight.id, { name: 'Updated' }),
      ).resolves.toMatchObject({ name: 'Updated' });
    });
  });

  describe('remove', () => {
    it('should throw when no access', async () => {
      await expect(sut.remove(factory.auth(), 'not-found')).rejects.toBeInstanceOf(BadRequestException);
    });

    it('should delete a highlight', async () => {
      const userId = newUuid();
      const highlight = HighlightFactory.create({ ownerId: userId });

      mocks.access.highlight.checkOwnerAccess.mockResolvedValue(new Set([highlight.id]));
      mocks.highlight.delete.mockResolvedValue(void 0);

      await expect(sut.remove(factory.auth({ user: { id: userId } }), highlight.id)).resolves.toBeUndefined();
      expect(mocks.highlight.delete).toHaveBeenCalledWith(highlight.id);
    });
  });

  describe('generate', () => {
    it('should create a new auto highlight when none exists', async () => {
      const userId = newUuid();
      const tagId = newUuid();
      const highlight = HighlightFactory.create({
        ownerId: userId,
        type: HighlightType.Auto,
        sourceTagId: tagId,
      });

      mocks.highlight.findBySourceTag.mockResolvedValue(undefined);
      mocks.highlight.create.mockResolvedValue(getForHighlight(highlight));
      mocks.highlight.getAssetsByTagId.mockResolvedValue([]);
      mocks.highlight.get.mockResolvedValue(getForHighlight(highlight));

      await expect(sut.generate(factory.auth({ user: { id: userId } }), { sourceTagId: tagId })).resolves.toMatchObject(
        {
          id: highlight.id,
          type: HighlightType.Auto,
        },
      );
    });

    it('should regenerate existing auto highlight', async () => {
      const userId = newUuid();
      const tagId = newUuid();
      const existing = HighlightFactory.create({
        ownerId: userId,
        type: HighlightType.Auto,
        sourceTagId: tagId,
      });

      mocks.highlight.findBySourceTag.mockResolvedValue(getForHighlight(existing));
      mocks.highlight.getAssetsByTagId.mockResolvedValue([]);
      mocks.highlight.getAssetIds.mockResolvedValue(new Set());
      mocks.highlight.get.mockResolvedValue(getForHighlight(existing));

      await expect(sut.generate(factory.auth({ user: { id: userId } }), { sourceTagId: tagId })).resolves.toMatchObject(
        {
          id: existing.id,
        },
      );
    });
  });
});
