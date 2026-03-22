import { DEFAULT_SCORING_CONFIG, scoreAsset, selectTopAssets, type ScoringAsset, type ScoringConfig } from 'src/utils/scoring';
import { describe, expect, it } from 'vitest';

function makeAsset(overrides: Partial<ScoringAsset> & { id: string }): ScoringAsset {
  return {
    fileCreatedAt: new Date('2024-06-15'),
    fileSize: 3_000_000,
    width: 4000,
    height: 3000,
    faceCount: 0,
    isFavorite: false,
    rating: 0,
    ...overrides,
  };
}

describe('scoring', () => {
  describe('scoreAsset', () => {
    it('should return a score between 0 and 1', () => {
      const asset = makeAsset({ id: 'a1' });
      const score = scoreAsset(asset, [asset]);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });

    it('should score favorited assets higher', () => {
      const base = makeAsset({ id: 'a1', isFavorite: false });
      const fav = makeAsset({ id: 'a2', isFavorite: true });
      const allAssets = [base, fav];
      const baseScore = scoreAsset(base, allAssets);
      const favScore = scoreAsset(fav, allAssets);
      expect(favScore).toBeGreaterThan(baseScore);
    });

    it('should score assets with faces higher', () => {
      const noFaces = makeAsset({ id: 'a1', faceCount: 0 });
      const withFaces = makeAsset({ id: 'a2', faceCount: 3 });
      const allAssets = [noFaces, withFaces];
      const noFaceScore = scoreAsset(noFaces, allAssets);
      const faceScore = scoreAsset(withFaces, allAssets);
      expect(faceScore).toBeGreaterThan(noFaceScore);
    });

    it('should score higher-rated assets higher', () => {
      const lowRated = makeAsset({ id: 'a1', rating: 1 });
      const highRated = makeAsset({ id: 'a2', rating: 5 });
      const allAssets = [lowRated, highRated];
      const lowScore = scoreAsset(lowRated, allAssets);
      const highScore = scoreAsset(highRated, allAssets);
      expect(highScore).toBeGreaterThan(lowScore);
    });

    it('should score higher-resolution assets higher', () => {
      const lowRes = makeAsset({ id: 'a1', width: 640, height: 480 });
      const highRes = makeAsset({ id: 'a2', width: 4000, height: 3000 });
      const allAssets = [lowRes, highRes];
      const lowScore = scoreAsset(lowRes, allAssets);
      const highScore = scoreAsset(highRes, allAssets);
      expect(highScore).toBeGreaterThan(lowScore);
    });

    it('should handle a single asset', () => {
      const asset = makeAsset({ id: 'a1' });
      const score = scoreAsset(asset, [asset]);
      expect(score).toBeGreaterThan(0);
    });

    it('should handle assets with missing dimensions gracefully', () => {
      const asset = makeAsset({ id: 'a1', width: 0, height: 0, fileSize: 0 });
      const score = scoreAsset(asset, [asset]);
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(1);
    });
  });

  describe('selectTopAssets', () => {
    it('should return empty array for empty input', () => {
      const result = selectTopAssets([]);
      expect(result).toEqual([]);
    });

    it('should return all assets when fewer than maxPhotos', () => {
      const assets = [makeAsset({ id: 'a1' }), makeAsset({ id: 'a2' })];
      const config: ScoringConfig = { ...DEFAULT_SCORING_CONFIG, maxPhotos: 10 };
      const result = selectTopAssets(assets, config);
      expect(result).toHaveLength(2);
    });

    it('should limit to maxPhotos', () => {
      const assets = Array.from({ length: 20 }, (_, i) =>
        makeAsset({
          id: `a${i}`,
          fileCreatedAt: new Date(2024, 0, i + 1),
        }),
      );
      const config: ScoringConfig = { ...DEFAULT_SCORING_CONFIG, maxPhotos: 5 };
      const result = selectTopAssets(assets, config);
      expect(result).toHaveLength(5);
    });

    it('should provide temporal spread across date range', () => {
      // Create assets spanning 6 months, clustered in January and June
      const assets = [
        // January cluster (10 assets)
        ...Array.from({ length: 10 }, (_, i) =>
          makeAsset({ id: `jan${i}`, fileCreatedAt: new Date(2024, 0, i + 1) }),
        ),
        // Isolated March asset
        makeAsset({ id: 'mar1', fileCreatedAt: new Date(2024, 2, 15) }),
        // June cluster (10 assets)
        ...Array.from({ length: 10 }, (_, i) =>
          makeAsset({ id: `jun${i}`, fileCreatedAt: new Date(2024, 5, i + 1) }),
        ),
      ];
      const config: ScoringConfig = { ...DEFAULT_SCORING_CONFIG, maxPhotos: 5 };
      const result = selectTopAssets(assets, config);

      // Should pick from multiple time periods, not just one cluster
      const months = new Set(result.map((r) => r.asset.fileCreatedAt.getMonth()));
      expect(months.size).toBeGreaterThanOrEqual(2);
    });

    it('should sort final selection by date', () => {
      const assets = Array.from({ length: 15 }, (_, i) =>
        makeAsset({
          id: `a${i}`,
          fileCreatedAt: new Date(2024, 0, i + 1),
          faceCount: i % 3, // Varied scores
        }),
      );
      const config: ScoringConfig = { ...DEFAULT_SCORING_CONFIG, maxPhotos: 5 };
      const result = selectTopAssets(assets, config);

      for (let i = 1; i < result.length; i++) {
        expect(result[i].asset.fileCreatedAt.getTime()).toBeGreaterThanOrEqual(
          result[i - 1].asset.fileCreatedAt.getTime(),
        );
      }
    });

    it('should handle all assets with same date', () => {
      const sameDate = new Date('2024-06-15');
      const assets = Array.from({ length: 15 }, (_, i) =>
        makeAsset({
          id: `a${i}`,
          fileCreatedAt: sameDate,
          faceCount: i,
        }),
      );
      const config: ScoringConfig = { ...DEFAULT_SCORING_CONFIG, maxPhotos: 5 };
      const result = selectTopAssets(assets, config);
      expect(result).toHaveLength(5);
    });

    it('should prefer favorites when scores are similar', () => {
      const assets = [
        makeAsset({ id: 'fav', fileCreatedAt: new Date(2024, 0, 1), isFavorite: true }),
        ...Array.from({ length: 15 }, (_, i) =>
          makeAsset({ id: `reg${i}`, fileCreatedAt: new Date(2024, 0, i + 2), isFavorite: false }),
        ),
      ];
      const config: ScoringConfig = { ...DEFAULT_SCORING_CONFIG, maxPhotos: 5 };
      const result = selectTopAssets(assets, config);
      const selectedIds = result.map((r) => r.asset.id);
      expect(selectedIds).toContain('fav');
    });

    it('should include each result with a score', () => {
      const assets = [makeAsset({ id: 'a1' }), makeAsset({ id: 'a2' })];
      const result = selectTopAssets(assets);
      for (const item of result) {
        expect(item).toHaveProperty('asset');
        expect(item).toHaveProperty('score');
        expect(typeof item.score).toBe('number');
      }
    });
  });

  describe('DEFAULT_SCORING_CONFIG', () => {
    it('should have weights that sum to 1', () => {
      const { dateWeight, peopleWeight, qualityWeight, favoriteAndRatingWeight } = DEFAULT_SCORING_CONFIG;
      expect(dateWeight + peopleWeight + qualityWeight + favoriteAndRatingWeight).toBe(1);
    });

    it('should have maxPhotos of 10', () => {
      expect(DEFAULT_SCORING_CONFIG.maxPhotos).toBe(10);
    });
  });
});
