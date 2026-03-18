import { z } from 'zod';

import { createZodResolver } from '@/utils/validation.util';

const SAMPLE_TYPES = ['structured', 'random'] as const;
const AUDIT_MODES = ['automated', 'full', 'both'] as const;

export const samplePageSchema = z.object({
  title: z.string().min(1, 'Page title is required'),
  url: z.string().min(1, 'URL is required'),
  description: z.string(),
  sampleType: z.enum(SAMPLE_TYPES),
  auditMode: z.enum(AUDIT_MODES),
});

export type SamplePageFormValues = z.infer<typeof samplePageSchema>;

export const samplePageResolver = createZodResolver(samplePageSchema);
