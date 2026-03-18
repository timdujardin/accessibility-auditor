'use client';

import type { TextInputProps } from '@/components/atoms/text-input/text-input.types';
import type { FieldValues, Path } from 'react-hook-form';

import { Controller, useFormContext } from 'react-hook-form';

import TextInput from '@/components/atoms/text-input/TextInput';

type FormTextFieldProps<T extends FieldValues> = {
  name: Path<T>;
  helperText?: string;
} & Omit<TextInputProps, 'name' | 'value' | 'onChange' | 'onBlur' | 'error' | 'helperText'>;

const FormTextField = <T extends FieldValues>({
  name,
  helperText,
  ...textFieldProps
}: Readonly<FormTextFieldProps<T>>) => {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextInput
          {...textFieldProps}
          {...field}
          value={field.value ?? ''}
          error={!!error}
          helperText={error?.message ?? helperText}
        />
      )}
    />
  );
};

export default FormTextField;
