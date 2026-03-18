import { z } from 'zod';

import { createZodResolver } from '@/utils/validation.util';

const ROLES = ['auditor', 'admin'] as const;

export const inviteUserSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  fullName: z.string(),
  organization: z.string(),
  role: z.enum(ROLES),
});

export type InviteUserFormValues = z.infer<typeof inviteUserSchema>;

export const inviteUserResolver = createZodResolver(inviteUserSchema);

export const editRoleSchema = z.object({
  role: z.enum(ROLES),
});

export type EditRoleFormValues = z.infer<typeof editRoleSchema>;

export const editRoleResolver = createZodResolver(editRoleSchema);
