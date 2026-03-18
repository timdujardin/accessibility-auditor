'use client';

import type { BaseSyntheticEvent, ReactNode } from 'react';
import type { FieldValues, SubmitHandler, UseFormProps } from 'react-hook-form';

import { useCallback, useEffect } from 'react';

import { FormProvider, useForm } from 'react-hook-form';
import { useDeepCompareEffect } from 'react-use';

import Wrapper from '@/components/atoms/wrapper/Wrapper';

export interface FormProps<TFieldValues extends FieldValues = FieldValues, TContext = unknown> {
  isLoading?: boolean;
  onSubmit?: SubmitHandler<TFieldValues>;
  onChange?: (data: TFieldValues) => void;
  formSettings?: UseFormProps<TFieldValues, TContext>;
  children: ReactNode;
}

const Form = <TFieldValues extends FieldValues = FieldValues, TContext = unknown>({
  isLoading,
  onSubmit,
  onChange,
  formSettings,
  children,
}: Readonly<FormProps<TFieldValues, TContext>>) => {
  const methods = useForm<TFieldValues, TContext>({
    mode: 'onSubmit',
    ...formSettings,
  });
  const { handleSubmit, watch, reset } = methods;

  useEffect(() => {
    if (!onChange) {
      return;
    }

    // eslint-disable-next-line react-hooks/incompatible-library -- RHF watch subscription is intentional
    const subscription = watch((values) => {
      onChange(values as TFieldValues);
    });

    return () => subscription.unsubscribe();
  }, [watch, onChange]);

  useDeepCompareEffect(() => {
    if (formSettings?.values) {
      reset(formSettings.values);
    }
  }, [formSettings?.values ?? {}, reset]);

  const onSubmitCallback = useCallback(
    (e: BaseSyntheticEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (isLoading) {
        return;
      }
      if (onSubmit) {
        handleSubmit(onSubmit)(e);
      }
    },
    [handleSubmit, isLoading, onSubmit],
  );

  return (
    <FormProvider {...methods}>
      <Wrapper component="form" noValidate onSubmit={onSubmitCallback}>
        {children}
      </Wrapper>
    </FormProvider>
  );
};

export default Form;
