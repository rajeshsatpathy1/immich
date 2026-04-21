// Custom enums for the highlights & aesthetic-scoring feature.
// Kept in a separate file so that only a single re-export line needs to be
// added to enum.ts, minimising rebase conflicts.

export enum ChecksumAlgorithm {
  sha1File = 'sha1', // sha1 checksum of the whole file contents
  sha1Path = 'sha1-path', // sha1 checksum of "path:" + file path (used by external libraries, deprecated)
}

export enum HighlightType {
  /** User-curated highlight from manually selected photos */
  Manual = 'manual',
  /** Auto-curated highlight generated from a tag */
  Auto = 'auto',
}
