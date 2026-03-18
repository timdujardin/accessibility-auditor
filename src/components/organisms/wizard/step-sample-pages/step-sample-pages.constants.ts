import type { SamplePageFormValues } from './step-sample-pages.schema';

export const SAMPLE_TYPE_OPTIONS = [
  { value: 'structured', label: 'Structured' },
  { value: 'random', label: 'Random' },
];

export const AUDIT_MODE_OPTIONS = [
  { value: 'automated', label: 'Automated' },
  { value: 'full', label: 'Full (Manual)' },
  { value: 'both', label: 'Both' },
];

export const DEFAULT_VALUES: SamplePageFormValues = {
  title: '',
  url: '',
  description: '',
  sampleType: 'structured',
  auditMode: 'both',
};
