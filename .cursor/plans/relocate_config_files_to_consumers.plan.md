---
name: ''
overview: ''
todos: []
isProject: false
---

# Relocate Config Files to Consumers

## Problem

The `config/` folder contains 5 files with mixed concerns: some exports are shared across 7+ files, others serve a single component. Single-use exports should live co-located with their consumer. The two large WCAG reference data files (`wcag.config.ts`, `automation.config.ts`) stay in `config/`.

---

## Overview

| Config file            | Action                                                                                              |
| ---------------------- | --------------------------------------------------------------------------------------------------- |
| `user.config.ts`       | **Delete** — move to `src/services/content-api/users/user.constants.ts`                             |
| `theme.config.ts`      | **Delete** — move to `src/contexts/theme.constants.ts`                                              |
| `audit.config.ts`      | **Slim down** — move 7 single-use exports to co-located constants + color system to `color.util.ts` |
| `wcag.config.ts`       | **Keep** (857-line WCAG reference data)                                                             |
| `automation.config.ts` | **Keep** (1312-line testability metadata)                                                           |

After: `config/` contains only 3 files (down from 5), and `audit.config.ts` shrinks from 22 exports to 8. Color system lives in `src/utils/color.util.ts`.

---

## Step 1 — Move `user.config.ts` → `src/services/content-api/users/user.constants.ts`

Create new file with content from `config/user.config.ts`:

```typescript
export const ROLE_OPTIONS = [
  { value: 'auditor', label: 'Auditor' },
  { value: 'admin', label: 'Admin' },
];
```

Update imports in 2 files:

| File                                                               | Old import                       | New import                                           |
| ------------------------------------------------------------------ | -------------------------------- | ---------------------------------------------------- |
| `src/components/molecules/invite-user-dialog/InviteUserDialog.tsx` | `from '@/../config/user.config'` | `from '@/services/content-api/users/user.constants'` |
| `src/components/molecules/edit-role-dialog/EditRoleDialog.tsx`     | `from '@/../config/user.config'` | `from '@/services/content-api/users/user.constants'` |

Delete `config/user.config.ts`.

---

## Step 2 — Move `theme.config.ts` → `src/contexts/theme.constants.ts`

Move entire file contents (MUI `createTheme` call) to `src/contexts/theme.constants.ts`.

Update import in 1 file:

| File                            | Old import                        | New import                 |
| ------------------------------- | --------------------------------- | -------------------------- |
| `src/contexts/ThemeContext.tsx` | `from '@/../config/theme.config'` | `from './theme.constants'` |

Delete `config/theme.config.ts`.

---

## Step 3 — Move `AUDIT_TYPE_OPTIONS` → `step-audit-scope.constants.ts`

New file: `src/components/organisms/wizard/step-audit-scope/step-audit-scope.constants.ts`

```typescript
import type { AuditType } from '@/@types/audit';

export interface AuditTypeOption {
  value: AuditType;
  label: string;
  description: string;
  icon: string;
}

export const AUDIT_TYPE_OPTIONS: AuditTypeOption[] = [
  { value: 'web', label: 'Web Accessibility', description: 'Websites and web applications', icon: 'Language' },
  { value: 'design', label: 'Design Accessibility', description: 'Design files and prototypes', icon: 'Palette' },
  {
    value: 'document',
    label: 'Document Accessibility',
    description: 'PDF, Word, and other documents',
    icon: 'Description',
  },
  {
    value: 'native_app',
    label: 'Native App Accessibility',
    description: 'iOS and Android applications',
    icon: 'PhoneIphone',
  },
];
```

Update import in `StepAuditScope.tsx`:

| Old                                                             | New                                                                 |
| --------------------------------------------------------------- | ------------------------------------------------------------------- |
| `import { AUDIT_TYPE_OPTIONS } from '@/../config/audit.config'` | `import { AUDIT_TYPE_OPTIONS } from './step-audit-scope.constants'` |

Remove `AUDIT_TYPE_OPTIONS` + `AuditTypeOption` from `config/audit.config.ts`.

---

## Step 4 — Move `TECHNOLOGY_OPTIONS` → `step-technologies.constants.ts`

New file: `src/components/organisms/wizard/step-technologies/step-technologies.constants.ts`

```typescript
export interface TechnologyOption {
  id: string;
  label: string;
  url: string;
}

export const TECHNOLOGY_OPTIONS: TechnologyOption[] = [
  { id: 'html', label: 'HTML', url: 'https://html.spec.whatwg.org/' },
  { id: 'css', label: 'CSS', url: 'https://www.w3.org/Style/CSS/' },
  { id: 'js', label: 'JavaScript', url: 'https://tc39.es/ecma262/' },
  { id: 'aria', label: 'WAI-ARIA', url: 'https://www.w3.org/WAI/ARIA/apg/' },
  { id: 'svg', label: 'SVG', url: 'https://www.w3.org/Graphics/SVG/' },
  { id: 'pdf', label: 'PDF', url: 'https://www.iso.org/standard/75839.html' },
];
```

Update import in `StepTechnologies.tsx`:

| Old                                                             | New                                                                  |
| --------------------------------------------------------------- | -------------------------------------------------------------------- |
| `import { TECHNOLOGY_OPTIONS } from '@/../config/audit.config'` | `import { TECHNOLOGY_OPTIONS } from './step-technologies.constants'` |

Remove `TECHNOLOGY_OPTIONS` + `TechnologyOption` from `config/audit.config.ts`.

---

## Step 5 — Move `DEFAULT_STATEMENT_GUIDANCE` → `step-next-steps.constants.ts`

New file: `src/components/organisms/wizard/step-next-steps/step-next-steps.constants.ts`

```typescript
export const DEFAULT_STATEMENT_GUIDANCE = `After receiving the audit documents, you must perform 2 tasks:

1. Add an Accessibility Statement to your website
2. Define your backlog/sprint for remediation

For both the Web Accessibility Directive (public sector) and the European Accessibility Act (private sector), you are legally required to provide an accessibility statement. Accessibility statements show your users that you care about accessibility and provide a contact point for visitors to report issues.

You can use these tools to create your statement:
- W3C Statement Generator (EN): https://www.w3.org/WAI/planning/statements/
- Belgian Statement Generator (NL): https://assistant.accessibility.belgium.be/

Verify applicable laws with your legal department using the W3C Web Accessibility Laws & Policies list: https://www.w3.org/WAI/policies/`;
```

Update import in `StepNextSteps.tsx`:

| Old                                                                     | New                                                                        |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `import { DEFAULT_STATEMENT_GUIDANCE } from '@/../config/audit.config'` | `import { DEFAULT_STATEMENT_GUIDANCE } from './step-next-steps.constants'` |

Remove `DEFAULT_STATEMENT_GUIDANCE` from `config/audit.config.ts`.

---

## Step 6 — Move color system → `src/utils/color.util.ts`

`SEMANTIC_COLORS`, `SemanticColor`, `toMuiColor` (+ internal `MUI_COLOR_MAP`, `MuiColor`) are color utilities, not audit config. Move to a dedicated util.

New file: `src/utils/color.util.ts`

```typescript
export const SEMANTIC_COLORS = {
  success: '#2E7D32',
  warning: '#ED6C02',
  error: '#C62828',
  info: '#0288D1',
  neutral: '#9E9E9E',
  primary: '#1976d2',
  secondary: '#9c27b0',
} as const;

export type SemanticColor = keyof typeof SEMANTIC_COLORS;

type MuiColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

const MUI_COLOR_MAP: Record<SemanticColor, MuiColor> = {
  success: 'success',
  warning: 'warning',
  error: 'error',
  info: 'info',
  neutral: 'default',
  primary: 'primary',
  secondary: 'secondary',
};

/**
 * Converts a semantic color key to its corresponding MUI palette color name.
 * @param {SemanticColor} semantic - The semantic color key.
 * @returns {MuiColor} The MUI palette color name.
 */
export const toMuiColor = (semantic: SemanticColor): MuiColor => MUI_COLOR_MAP[semantic];
```

Update imports in 12 consumer files:

| File                                                                    | What moves to `@/utils/color.util` |
| ----------------------------------------------------------------------- | ---------------------------------- |
| `src/hooks/tables/importPreview.table.tsx`                              | `toMuiColor`                       |
| `src/hooks/tables/auditList.table.tsx`                                  | `toMuiColor`                       |
| `src/components/atoms/testability-badge/TestabilityBadge.tsx`           | `toMuiColor`                       |
| `src/components/atoms/testability-badge/testability-badge.constants.ts` | `SemanticColor` (type)             |
| `src/components/atoms/wcag-level-badge/WcagLevelBadge.tsx`              | `toMuiColor`                       |
| `src/components/atoms/wcag-level-badge/wcag-level-badge.constants.ts`   | `SemanticColor` (type)             |
| `src/components/atoms/priority-chip/PriorityChip.tsx`                   | `toMuiColor`                       |
| `src/components/atoms/status-badge/StatusBadge.tsx`                     | `toMuiColor`                       |
| `src/app/audits/[id]/_components/AuditDetailPageContent.tsx`            | `toMuiColor`                       |
| `src/app/audits/[id]/report/page.tsx`                                   | `SEMANTIC_COLORS`                  |
| `src/utils/reportGeneration.util.ts`                                    | `SEMANTIC_COLORS`                  |
| `src/app/admin/page.tsx`                                                | `SEMANTIC_COLORS`                  |

Update `config/audit.config.ts` internally — add `import type { SemanticColor } from '@/utils/color.util'` (needed by `STATUS_DISPLAY`, `OUTCOME_DISPLAY`, `PRIORITY_DISPLAY`). Remove `SEMANTIC_COLORS`, `SemanticColor`, `toMuiColor`, `MUI_COLOR_MAP`, `MuiColor` from the file.

---

## Step 7 — Move `SCOPE_COLORS` → `src/app/admin/page.constants.ts`

New file: `src/app/admin/page.constants.ts`

```typescript
import type { SemanticColor } from '@/utils/color.util';

export const SCOPE_COLORS: SemanticColor[] = ['primary', 'secondary', 'success', 'warning'];
```

Update import in `src/app/admin/page.tsx`:

| Old                                                            | New                                      |
| -------------------------------------------------------------- | ---------------------------------------- |
| `import { SCOPE_COLORS, ... } from '@/../config/audit.config'` | `SCOPE_COLORS` from `'./page.constants'` |

Remove `SCOPE_COLORS` from `config/audit.config.ts`.

---

## Step 8 — Merge `AUDIT_SCOPE_OPTIONS` into `auditScope.util.ts`

Move `AUDIT_SCOPE_OPTIONS` + `AuditScopeOption` into `src/utils/auditScope.util.ts` (its only consumer). Replace raw criteria array references with `getCriteriaForScope`:

```typescript
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
```

Remove `AUDIT_SCOPE_OPTIONS` + `AuditScopeOption` from `config/audit.config.ts`.

No import changes needed — `StepAuditScope.tsx` already imports from `@/utils/auditScope.util`.

---

## Step 9 — Inline `DEFAULT_AUDIT_SCOPE` in Redux slice

In `src/redux/slices/audit.ts`, replace the import with a typed literal:

```typescript
// Before
import { DEFAULT_AUDIT_SCOPE } from '@/../config/audit.config';
// ...
auditScope: DEFAULT_AUDIT_SCOPE,

// After (inline — it's just 'full_aa')
auditScope: 'full_aa' satisfies AuditScope,
```

Remove `DEFAULT_AUDIT_SCOPE` from `config/audit.config.ts`.

---

## Step 10 — Un-export internal criteria arrays

After steps 8–9, the criteria arrays are only used internally by `getCriteriaForScope`. Remove the `export` keyword from:

- `QUICK_AUDIT_CRITERIA`
- `TYPICAL_AUDIT_CRITERIA`
- `FULL_AA_AUDIT_CRITERIA`
- `FULL_AAA_AUDIT_CRITERIA`

---

## Final state of `config/audit.config.ts`

Only shared, audit-domain exports remain (8 exports, down from 22):

| Export                | Consumers                              |
| --------------------- | -------------------------------------- |
| `getCriteriaForScope` | 5 files (app, organisms, redux, utils) |
| `STATUS_DISPLAY`      | 4 files (hooks, app, atoms)            |
| `PRIORITY_DISPLAY`    | 3 files (app, atoms, utils)            |
| `OUTCOME_DISPLAY`     | 2 files (hooks, atoms)                 |
| `SCOPE_LABELS_SHORT`  | 2 files (hooks, app)                   |
| `SCOPE_LABELS_LONG`   | 3 files (organisms, app)               |

Internal-only (no longer exported): `QUICK_AUDIT_CRITERIA`, `TYPICAL_AUDIT_CRITERIA`, `FULL_AA_AUDIT_CRITERIA`, `FULL_AAA_AUDIT_CRITERIA`, `SCOPE_CRITERIA_MAP`.

Imports `SemanticColor` type from `@/utils/color.util` (for the display config types).

## Final state of `src/utils/color.util.ts`

New file with the color system (3 exports):

| Export            | Consumers                                               |
| ----------------- | ------------------------------------------------------- |
| `SEMANTIC_COLORS` | 3 files (app/report, utils, app/admin)                  |
| `SemanticColor`   | 5 files (atoms constants, page.constants, audit.config) |
| `toMuiColor`      | 7 files (atoms, hooks, app)                             |

---

## Verification

```bash
npm run check:types && npm run check:lint
```
