/**
 * Scoring engine for highlight photo curation.
 *
 * Scores photos based on multiple factors:
 * - Date score: temporal spread to avoid clustering
 * - People score: photos with faces score higher
 * - Quality score: basic heuristics (resolution, file size ratio)
 *
 * The scoring is pluggable — external scoring providers can be added
 * without changing the core algorithm.
 */

export interface ScoringAsset {
  id: string;
  fileCreatedAt: Date;
  fileSize?: number;
  width?: number;
  height?: number;
  faceCount?: number;
  isFavorite?: boolean;
  rating?: number;
  aestheticScore?: number;
}

export interface ScoringConfig {
  dateWeight: number;
  peopleWeight: number;
  qualityWeight: number;
  favoriteAndRatingWeight: number;
  aestheticWeight: number;
  maxPhotos: number;
}

export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  dateWeight: 0,
  peopleWeight: 0.1,
  qualityWeight: 0.1,
  favoriteAndRatingWeight: 0.4,
  aestheticWeight: 0.4,
  maxPhotos: 10,
};

/**
 * Calculate a date score that favors temporal spread.
 * Assets distributed evenly across the date range score higher collectively.
 */
function calculateDateScore(asset: ScoringAsset, allAssets: ScoringAsset[]): number {
  if (allAssets.length <= 1) {
    return 1;
  }

  const timestamps = allAssets.map((a) => a.fileCreatedAt.getTime()).sort((a, b) => a - b);
  const minTs = timestamps[0];
  const maxTs = timestamps[timestamps.length - 1];
  const range = maxTs - minTs;

  if (range === 0) {
    return 1;
  }

  // Normalized position in timeline (0 to 1)
  const position = (asset.fileCreatedAt.getTime() - minTs) / range;

  // Score based on how well this asset fills a temporal gap
  // Higher score for assets not clustered with others
  const assetTs = asset.fileCreatedAt.getTime();
  const otherTimestamps = timestamps.filter((ts) => ts !== assetTs);
  let minDistance: number;
  if (otherTimestamps.length === 0) {
    // All assets share the same timestamp — no isolation possible
    minDistance = 0;
  } else {
    minDistance = Infinity;
    for (const ts of otherTimestamps) {
      const distance = Math.abs(assetTs - ts) / range;
      minDistance = Math.min(minDistance, distance);
    }
  }

  // Reward temporal isolation (not clustered) + a small recency bonus
  const isolationScore = Math.min(minDistance * 5, 1); // Cap at 1
  const recencyBonus = position * 0.2; // Slight preference for newer
  return Math.min(isolationScore + recencyBonus, 1);
}

/**
 * Calculate people score based on face count.
 * Photos with faces (especially groups) score higher.
 */
function calculatePeopleScore(asset: ScoringAsset): number {
  const faceCount = asset.faceCount ?? 0;
  if (faceCount === 0) {
    return 0;
  }
  // 1 face = 0.6, 2 faces = 0.8, 3+ faces = 1.0
  return Math.min(0.4 + faceCount * 0.2, 1);
}

/**
 * Calculate basic quality score from resolution and file size.
 * Higher resolution relative to file size suggests better compression/quality.
 */
function calculateQualityScore(asset: ScoringAsset): number {
  const width = asset.width ?? 0;
  const height = asset.height ?? 0;
  const fileSize = asset.fileSize ?? 0;

  if (width === 0 || height === 0 || fileSize === 0) {
    return 0.5; // Neutral score for missing data
  }

  const megapixels = (width * height) / 1_000_000;
  // Higher resolution = generally better photo (up to a point)
  const resolutionScore = Math.min(megapixels / 12, 1); // 12MP = max score

  // Bytes per pixel — higher means more detail retained
  const bytesPerPixel = fileSize / (width * height);
  const detailScore = Math.min(bytesPerPixel / 3, 1); // ~3 bytes/px = max

  return resolutionScore * 0.6 + detailScore * 0.4;
}

/**
 * Calculate aesthetic score from the pre-computed LAION Aesthetic Predictor output.
 * Falls back to a neutral 0.5 when no score is available.
 */
function calculateAestheticScore(asset: ScoringAsset): number {
  if (asset.aestheticScore == null) {
    return 0.5; // Neutral fallback when not yet scored
  }
  return Math.min(Math.max(asset.aestheticScore / 10, 0), 1);
}

/**
 * Calculate favorite/rating boost.
 */
function calculateFavoriteAndRatingScore(asset: ScoringAsset): number {
  let score = 0;
  if (asset.isFavorite) {
    score += 1;
  }
  if (asset.rating != null && asset.rating > 0) {
    score += asset.rating / 5; // Normalize 1-5 rating to 0-1
  }
  return Math.min(score, 1);
}

/**
 * Score a single asset using all factors.
 */
export function scoreAsset(
  asset: ScoringAsset,
  allAssets: ScoringAsset[],
  config: ScoringConfig = DEFAULT_SCORING_CONFIG,
): number {
  const dateScore = calculateDateScore(asset, allAssets);
  const peopleScore = calculatePeopleScore(asset);
  const qualityScore = calculateQualityScore(asset);
  const favoriteScore = calculateFavoriteAndRatingScore(asset);
  const aestheticScoreValue = calculateAestheticScore(asset);

  const totalWeight =
    config.dateWeight +
    config.peopleWeight +
    config.qualityWeight +
    config.favoriteAndRatingWeight +
    config.aestheticWeight;

  const weighted =
    dateScore * config.dateWeight +
    peopleScore * config.peopleWeight +
    qualityScore * config.qualityWeight +
    favoriteScore * config.favoriteAndRatingWeight +
    aestheticScoreValue * config.aestheticWeight;

  return totalWeight > 0 ? weighted / totalWeight : 0;
}

/**
 * Score all assets and select top N with temporal spread.
 *
 * Algorithm:
 * 1. Score all assets
 * 2. Sort by score descending
 * 3. Apply temporal spread: divide timeline into buckets, pick top from each
 * 4. Fill remaining slots with highest overall scores
 */
export function selectTopAssets(
  assets: ScoringAsset[],
  config: ScoringConfig = DEFAULT_SCORING_CONFIG,
): { asset: ScoringAsset; score: number }[] {
  if (assets.length === 0) {
    return [];
  }

  const maxPhotos = config.maxPhotos;
  if (assets.length <= maxPhotos) {
    return assets.map((asset) => ({ asset, score: scoreAsset(asset, assets, config) }));
  }

  // Score all assets
  const scored = assets.map((asset) => ({
    asset,
    score: scoreAsset(asset, assets, config),
  }));

  // Temporal spread: divide into buckets
  const timestamps = assets.map((a) => a.fileCreatedAt.getTime());
  const minTs = Math.min(...timestamps);
  const maxTs = Math.max(...timestamps);
  const range = maxTs - minTs;

  if (range === 0) {
    // All same date — just pick top by score
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, maxPhotos);
  }

  const bucketCount = Math.min(maxPhotos, Math.ceil(assets.length / 2));
  const bucketSize = range / bucketCount;
  const buckets: Map<number, { asset: ScoringAsset; score: number }[]> = new Map();

  for (const item of scored) {
    const bucketIndex = Math.min(
      Math.floor((item.asset.fileCreatedAt.getTime() - minTs) / bucketSize),
      bucketCount - 1,
    );
    if (!buckets.has(bucketIndex)) {
      buckets.set(bucketIndex, []);
    }
    buckets.get(bucketIndex)!.push(item);
  }

  // Pick the top asset from each bucket
  const selected: { asset: ScoringAsset; score: number }[] = [];
  const selectedIds = new Set<string>();

  for (const [, bucketItems] of buckets) {
    bucketItems.sort((a, b) => b.score - a.score);
    if (bucketItems.length > 0 && selected.length < maxPhotos) {
      selected.push(bucketItems[0]);
      selectedIds.add(bucketItems[0].asset.id);
    }
  }

  // Fill remaining slots with highest overall scores not already selected
  if (selected.length < maxPhotos) {
    scored.sort((a, b) => b.score - a.score);
    for (const item of scored) {
      if (selected.length >= maxPhotos) {
        break;
      }
      if (!selectedIds.has(item.asset.id)) {
        selected.push(item);
        selectedIds.add(item.asset.id);
      }
    }
  }

  // Sort final selection by date for display
  selected.sort((a, b) => a.asset.fileCreatedAt.getTime() - b.asset.fileCreatedAt.getTime());

  return selected;
}
