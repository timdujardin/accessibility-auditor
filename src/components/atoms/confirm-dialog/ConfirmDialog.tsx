import type { FC } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import type { ConfirmDialogProps } from './confirm-dialog.types';

/**
 * Confirmation dialog component. Combines MUI Dialog, DialogTitle, DialogContent, DialogActions.
 * @param {ConfirmDialogProps} props - Dialog configuration.
 * @returns {JSX.Element} A modal dialog with confirm/cancel actions.
 */
const ConfirmDialog: FC<ConfirmDialogProps> = ({
  open,
  title,
  description,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmColor = 'primary',
  onConfirm,
  onCancel,
  sx,
}) => (
  <Dialog open={open} onClose={onCancel} sx={sx}>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      {description ? <DialogContentText>{description}</DialogContentText> : null}
      {children}
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel}>{cancelLabel}</Button>
      <Button onClick={onConfirm} variant="contained" color={confirmColor}>
        {confirmLabel}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
