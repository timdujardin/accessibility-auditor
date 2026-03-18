import type { FindingFormValues } from './finding-form.schema';

export interface FindingFormProps {
  onSubmit: (values: FindingFormValues) => Promise<void>;
  initialValues?: Partial<FindingFormValues>;
  submitLabel?: string;
}
