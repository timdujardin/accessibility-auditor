'use client';

import type { FC } from 'react';

import { useFormContext } from 'react-hook-form';

import type { FindingFormValues } from './finding-form.schema';

import Button from '@/components/atoms/button/Button';
import Icon from '@/components/atoms/icon/Icon';

const FindingFormSubmitButton: FC<{ label: string; isSubmitting: boolean }> = ({ label, isSubmitting }) => {
  const { formState } = useFormContext<FindingFormValues>();

  return (
    <Button
      type="submit"
      variant="contained"
      size="small"
      startIcon={<Icon name="Add" />}
      disabled={isSubmitting || !formState.isDirty}
    >
      {label}
    </Button>
  );
};

export default FindingFormSubmitButton;
