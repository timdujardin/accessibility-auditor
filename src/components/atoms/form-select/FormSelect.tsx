'use client';

import type { SelectInputProps } from '@/components/atoms/select-input/select-input.types';
import type { FieldValues, Path } from 'react-hook-form';

import { Controller, useFormContext } from 'react-hook-form';

import {
  SelectFormControl,
  SelectFormHelperText,
  SelectInput,
  SelectLabel,
  SelectOption,
} from '@/components/atoms/select-input/SelectInput';

interface FormSelectOption {
  value: string;
  label: string;
}

type FormSelectProps<T extends FieldValues> = {
  name: Path<T>;
  label: string;
  options: FormSelectOption[];
  size?: 'small' | 'medium';
  fullWidth?: boolean;
} & Omit<SelectInputProps, 'name' | 'value' | 'onChange' | 'onBlur' | 'error' | 'label'>;

const FormSelect = <T extends FieldValues>({
  name,
  label,
  options,
  size = 'medium',
  fullWidth = true,
  ...selectProps
}: Readonly<FormSelectProps<T>>) => {
  const { control } = useFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <SelectFormControl fullWidth={fullWidth} size={size} error={!!error}>
          <SelectLabel>{label}</SelectLabel>
          <SelectInput {...selectProps} {...field} value={field.value ?? ''} label={label}>
            {options.map((opt) => (
              <SelectOption key={opt.value} value={opt.value}>
                {opt.label}
              </SelectOption>
            ))}
          </SelectInput>
          {error?.message ? <SelectFormHelperText>{error.message}</SelectFormHelperText> : null}
        </SelectFormControl>
      )}
    />
  );
};

export default FormSelect;
