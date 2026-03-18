import type { ClipboardEvent, DragEvent } from 'react';

/**
 * Reads a file and returns its contents as a data URL string.
 * @param {File} file - The file to read.
 * @returns {Promise<string>} Resolves with the data URL string.
 */
const readFileAsDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Processes selected files, converts each to a data URL, and uploads via the callback.
 * @param {FileList | null} files - The files selected by the user.
 * @param {(processing: boolean) => void} setIsProcessing - State setter for processing indicator.
 * @param {(dataUrl: string, fileName: string) => Promise<void>} onUpload - Async callback to upload each file.
 * @returns {Promise<void>} Resolves when all files have been processed.
 */
export const handleFileSelect = async (
  files: FileList | null,
  setIsProcessing: (processing: boolean) => void,
  onUpload: (dataUrl: string, fileName: string) => Promise<void>,
) => {
  if (!files || files.length === 0) {
    return;
  }
  setIsProcessing(true);

  for (const file of Array.from(files)) {
    const dataUrl = await readFileAsDataUrl(file);
    await onUpload(dataUrl, file.name);
  }

  setIsProcessing(false);
};

/**
 * Handles a drag-and-drop event by passing dropped files to the callback.
 * @param {DragEvent} e - The drag event.
 * @param {(files: FileList | null) => void} fileSelectCallback - Callback invoked with the dropped files.
 * @returns {void}
 */
export const handleDrop = (e: DragEvent, fileSelectCallback: (files: FileList | null) => void) => {
  e.preventDefault();
  fileSelectCallback(e.dataTransfer.files);
};

/**
 * Handles a paste event by extracting image files from the clipboard and passing them to the callback.
 * @param {ClipboardEvent} e - The clipboard paste event.
 * @param {(files: FileList | null) => void} fileSelectCallback - Callback invoked with the pasted image files.
 * @returns {void}
 */
export const handlePaste = (e: ClipboardEvent, fileSelectCallback: (files: FileList | null) => void) => {
  const items = e.clipboardData.items;
  const files: File[] = [];
  for (const item of Array.from(items)) {
    if (item.type.startsWith('image/')) {
      const file = item.getAsFile();
      if (file) {
        files.push(file);
      }
    }
  }
  if (files.length > 0) {
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    fileSelectCallback(dt.files);
  }
};
