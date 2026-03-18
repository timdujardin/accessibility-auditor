import { z } from 'zod';

import { createZodResolver } from '@/utils/validation.util';

const AUDIT_TYPES = ['web', 'design', 'document', 'native_app'] as const;
const AUDIT_SCOPES = ['quick', 'typical', 'full_aa', 'full_aaa'] as const;

export const auditScopeSchema = z.object({
  title: z.string().min(1, 'Audit title is required'),
  commissioner: z.string(),
  auditType: z.enum(AUDIT_TYPES),
  auditScope: z.enum(AUDIT_SCOPES),
  accessibilityBaseline: z.string(),
});

export type AuditScopeFormValues = z.infer<typeof auditScopeSchema>;

export const auditScopeResolver = createZodResolver(auditScopeSchema);
