import type { FindingFormValues } from './finding-form.schema';

export const PRIORITY_OPTIONS = [
  { value: 'critical', label: 'Critical' },
  { value: 'major', label: 'Major' },
  { value: 'minor', label: 'Minor' },
  { value: 'advisory', label: 'Advisory' },
];

export const DEFAULT_VALUES: FindingFormValues = {
  description: '',
  recommendation: '',
  priority: 'major',
  elementSelector: '',
  elementHtml: '',
};
