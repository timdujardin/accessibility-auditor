import { z } from 'zod';

import { createZodResolver } from '@/utils/validation.util';

export const signInSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export type SignInForm = z.infer<typeof signInSchema>;

export const signInResolver = createZodResolver(signInSchema);
