'use client';

import type { EditRoleFormValues } from '@/services/content-api/users/invite.schema';
import type { FC } from 'react';

import { FormProvider, useForm } from 'react-hook-form';

import ConfirmDialog from '@/components/atoms/confirm-dialog/ConfirmDialog';
import FormSelect from '@/components/atoms/form-select/FormSelect';
import Wrapper from '@/components/atoms/wrapper/Wrapper';
import { editRoleResolver } from '@/services/content-api/users/invite.schema';
import { ROLE_OPTIONS } from '@/services/content-api/users/user.constants';

export interface EditRoleDialogProps {
  open: boolean;
  userName: string;
  currentRole: 'auditor' | 'admin';
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: EditRoleFormValues) => void;
}

const EditRoleDialog: FC<EditRoleDialogProps> = ({ open, userName, currentRole, isSubmitting, onClose, onSubmit }) => {
  const methods = useForm<EditRoleFormValues>({
    mode: 'onSubmit',
    resolver: editRoleResolver,
    values: { role: currentRole },
  });

  const handleConfirm = () => {
    methods.handleSubmit(onSubmit)();
  };

  return (
    <FormProvider {...methods}>
      <ConfirmDialog
        open={open}
        title={`Change Role for ${userName}`}
        confirmLabel={isSubmitting ? 'Saving...' : 'Save'}
        onConfirm={handleConfirm}
        onCancel={onClose}
      >
        <Wrapper sx={{ marginBlockStart: 1 }}>
          <FormSelect<EditRoleFormValues> name="role" label="Role" options={ROLE_OPTIONS} />
        </Wrapper>
      </ConfirmDialog>
    </FormProvider>
  );
};

export default EditRoleDialog;
