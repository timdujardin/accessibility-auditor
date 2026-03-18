'use client';

import type { InviteUserFormValues } from '@/services/content-api/users/invite.schema';
import type { FC } from 'react';

import { FormProvider, useForm } from 'react-hook-form';

import ConfirmDialog from '@/components/atoms/confirm-dialog/ConfirmDialog';
import FormSelect from '@/components/atoms/form-select/FormSelect';
import FormTextField from '@/components/atoms/form-text-field/FormTextField';
import Wrapper from '@/components/atoms/wrapper/Wrapper';
import { inviteUserResolver } from '@/services/content-api/users/invite.schema';
import { ROLE_OPTIONS } from '@/services/content-api/users/user.constants';

export interface InviteUserDialogProps {
  open: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (data: InviteUserFormValues) => void;
}

const InviteUserDialog: FC<InviteUserDialogProps> = ({ open, isSubmitting, onClose, onSubmit }) => {
  const methods = useForm<InviteUserFormValues>({
    mode: 'onSubmit',
    resolver: inviteUserResolver,
    defaultValues: { email: '', fullName: '', organization: '', role: 'auditor' as const },
  });

  const handleConfirm = () => {
    methods.handleSubmit(onSubmit)();
  };

  return (
    <FormProvider {...methods}>
      <ConfirmDialog
        open={open}
        title="Invite New User"
        confirmLabel={isSubmitting ? 'Inviting...' : 'Send Invite'}
        onConfirm={handleConfirm}
        onCancel={onClose}
      >
        <Wrapper sx={{ display: 'flex', flexDirection: 'column', gap: 2, marginBlockStart: 1 }}>
          <FormTextField<InviteUserFormValues> name="email" label="Email" type="email" required />
          <FormTextField<InviteUserFormValues> name="fullName" label="Full Name" />
          <FormTextField<InviteUserFormValues> name="organization" label="Organization" />
          <FormSelect<InviteUserFormValues> name="role" label="Role" options={ROLE_OPTIONS} />
        </Wrapper>
      </ConfirmDialog>
    </FormProvider>
  );
};

export default InviteUserDialog;
