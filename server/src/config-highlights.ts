// Highlights & aesthetic-scoring feature — default config values.
// Kept here so that config.ts only needs a single spread per block,
// shrinking the diff that conflicts during upstream rebases.

import { QueueName } from 'src/enum';

/** Concurrency defaults for the two custom queues. Spread into config.ts `job`. */
export const highlightsJobDefaults = {
  [QueueName.AestheticScore]: { concurrency: 2 },
  [QueueName.HighlightGenerate]: { concurrency: 1 },
} as const;

/** Machine-learning defaults for aesthetic scoring. Spread into config.ts `machineLearning`. */
export const highlightsMachineLearningDefaults = {
  aesthetic: {
    enabled: true,
    modelName: 'aesthetic-predictor-v2-5',
  },
} as const;

/** Top-level feature-flag defaults. Spread at the top level of config.ts `defaults`. */
export const highlightsTopLevelDefaults = {
  memories: { enabled: true as boolean },
  highlights: { enabled: true as boolean },
} as const;
