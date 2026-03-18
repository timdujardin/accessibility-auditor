import type { AuditScope } from '@/@types/audit';

import { getCriteriaForScope } from '@/../config/audit.config';

export interface AuditScopeOption {
  value: AuditScope;
  label: string;
  description: string;
  criteriaCount: number;
  coveragePercent: number;
  isAdvanced: boolean;
  disclaimer?: string;
}

const fullAaCount = getCriteriaForScope('full_aa').length;

export const AUDIT_SCOPE_OPTIONS: AuditScopeOption[] = [
  {
    value: 'quick',
    label: 'Quick Audit',
    description: 'How good is the general state of accessibility?',
    criteriaCount: getCriteriaForScope('quick').length,
    coveragePercent: Math.round((getCriteriaForScope('quick').length / fullAaCount) * 100),
    isAdvanced: false,
    disclaimer:
      'Quick audits should not be used to guide customers towards compliance. They are merely used to give a very quick indication.',
  },
  {
    value: 'typical',
    label: 'Typical Audit',
    description: 'What do we need to do to make our website more accessible?',
    criteriaCount: getCriteriaForScope('typical').length,
    coveragePercent: Math.round((getCriteriaForScope('typical').length / fullAaCount) * 100),
    isAdvanced: false,
  },
  {
    value: 'full_aa',
    label: 'Full Audit (AA)',
    description: 'How do I build compliance with accessibility legislation?',
    criteriaCount: fullAaCount,
    coveragePercent: 100,
    isAdvanced: false,
  },
  {
    value: 'full_aaa',
    label: 'Full Audit (AAA)',
    description: 'Maximum accessibility coverage — rarely needed.',
    criteriaCount: getCriteriaForScope('full_aaa').length,
    coveragePercent: 100,
    isAdvanced: true,
  },
];

/**
 * Returns all non-advanced audit scope options.
 * @returns {AuditScopeOption[]} The list of regular scope options.
 */
export const getRegularScopes = (): AuditScopeOption[] => {
  return AUDIT_SCOPE_OPTIONS.filter((o) => !o.isAdvanced);
};

/**
 * Returns all advanced audit scope options (full AA / full AAA).
 * @returns {AuditScopeOption[]} The list of advanced scope options.
 */
export const getAdvancedScopes = (): AuditScopeOption[] => {
  return AUDIT_SCOPE_OPTIONS.filter((o) => o.isAdvanced);
};
