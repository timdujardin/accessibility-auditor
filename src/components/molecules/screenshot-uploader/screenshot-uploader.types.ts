import type { ScreenshotSummary } from '@/@types/finding';

export interface ScreenshotUploaderProps {
  findingId: string;
  existingScreenshots: ScreenshotSummary[];
  onUpload: (storagePath: string, altText: string) => Promise<void>;
  onDelete?: (screenshotId: string) => Promise<void>;
}
