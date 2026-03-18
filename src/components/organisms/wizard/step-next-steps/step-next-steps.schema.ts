import { z } from 'zod';

import { createZodResolver } from '@/utils/validation.util';

export const nextStepsContactSchema = z.object({
  ownerContactPhone: z.string(),
  ownerContactEmail: z.string(),
  ownerContactAddress: z.string(),
});

export type NextStepsContactFormValues = z.infer<typeof nextStepsContactSchema>;

export const nextStepsContactResolver = createZodResolver(nextStepsContactSchema);
