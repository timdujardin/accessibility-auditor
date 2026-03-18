import { z } from 'zod';

import { createZodResolver } from '@/utils/validation.util';

const PRIORITIES = ['critical', 'major', 'minor', 'advisory'] as const;

export const findingSchema = z.object({
  description: z.string().min(1, 'Issue description is required'),
  recommendation: z.string(),
  priority: z.enum(PRIORITIES),
  elementSelector: z.string(),
  elementHtml: z.string(),
});

export type FindingFormValues = z.infer<typeof findingSchema>;

export const findingResolver = createZodResolver(findingSchema);
