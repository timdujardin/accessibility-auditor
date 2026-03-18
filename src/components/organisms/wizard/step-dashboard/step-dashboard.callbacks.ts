/**
 * Opens the publish confirmation dialog.
 * @param {(open: boolean) => void} setConfirmOpen - State setter to control dialog visibility.
 * @returns {void}
 */
export const handlePublishClick = (setConfirmOpen: (open: boolean) => void) => {
  setConfirmOpen(true);
};

/**
 * Closes the confirmation dialog and optionally runs the publish callback.
 * @param {(open: boolean) => void} setConfirmOpen - State setter to control dialog visibility.
 * @param {() => Promise<void>} [onPublish] - Optional async callback to perform the publish action.
 * @returns {Promise<void>} Resolves when the publish flow completes.
 */
export const handleConfirmPublish = async (
  setConfirmOpen: (open: boolean) => void,
  onPublish?: () => Promise<void>,
) => {
  setConfirmOpen(false);
  if (onPublish) {
    await onPublish();
  }
};
