export type FindingPriority = 'critical' | 'major' | 'minor' | 'advisory';

export interface ScreenshotSummary {
  id: string;
  storagePath: string;
  altText: string;
}
