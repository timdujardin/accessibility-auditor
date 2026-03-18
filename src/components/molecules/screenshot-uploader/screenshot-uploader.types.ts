export interface ScreenshotUploaderProps {
  findingId: string;
  existingScreenshots: Array<{ id: string; storagePath: string; altText: string }>;
  onUpload: (storagePath: string, altText: string) => Promise<void>;
  onDelete?: (screenshotId: string) => Promise<void>;
}
