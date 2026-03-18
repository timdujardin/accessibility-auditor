# Accessibility Auditor

A WCAG-EM 2.0 based accessibility auditing application built with Next.js, Material UI, and (in phase 2) Supabase.

## Features

- **Wizard-driven audit workflow** following WCAG-EM 2.0 methodology (8-step process)
- **4 audit scope tiers**: Quick (17 criteria), Typical (28), Full AA (55, default), Full AAA (86)
- **4 audit types**: Web, Design, Document, Native App accessibility
- **Automated scanning** via axe-core + Puppeteer with node-level screenshot capture
- **Scan integration**: approve/dismiss individual violations, prefill findings from approved scan results
- **Per-issue prioritization** (critical/major/minor/advisory) with screenshot uploads
- **AI-generated executive summaries** via Google Gemini Flash
- **EARL/JSON-LD import** supporting both old step-based and WCAG-EM Report Tool v3 semantic-key formats -- imports load into Redux state with a Publish button to persist
- **EARL/JSON-LD export** compatible with W3C WCAG-EM Report Tool
- **Report Preview** in the dashboard step with findings grouped by sample page, enriched with WCAG criterion details and merged screenshots
- **Dashboard generation** with conformance overview, charts, and quick wins
- **Next Steps guidance** including Accessibility Statement templates and remediation backlogs

### Phase 2 (planned)

- **Supabase integration**: PostgreSQL database, Auth, and Storage for persistent data
- **Role-based access**: auditor and admin roles with Supabase Row Level Security
- **User management**: invite users, assign roles, manage accounts

## Tech Stack

| Layer      | Technology                                                           |
| ---------- | -------------------------------------------------------------------- |
| Framework  | Next.js 16 (App Router) + TypeScript (strict mode)                   |
| UI         | Material UI v7                                                       |
| Charts     | Recharts                                                             |
| State      | Redux Toolkit (wizard state) + React Context (auth, theme)           |
| Forms      | React Hook Form + Zod validation                                     |
| Tables     | TanStack Table v8                                                    |
| Scanning   | @axe-core/puppeteer + puppeteer-core + @sparticuz/chromium           |
| AI         | Google Gemini Flash                                                  |
| Database   | Supabase (PostgreSQL + Auth + Storage) -- _phase 2, not yet active_  |
| Linting    | ESLint 9 (flat config) with SonarJS, jsx-a11y-x, baseline-js         |
| Formatting | Prettier with sorted imports (`@ianvs/prettier-plugin-sort-imports`) |

## Getting Started

### Prerequisites

- Node.js 22 (see `.nvmrc`)
- (Optional) Google Gemini API key for AI-generated executive summaries
- (Phase 2) Docker for local Supabase development

### Local Development Setup

```bash
nvm use          # switch to Node 22
npm install      # install dependencies
npm run dev      # start Next.js dev server on http://localhost:3000
```

### Authentication (Phase 1 -- Fake Login)

Supabase authentication is **disabled** in phase 1. The app uses a hardcoded fake login instead:

| Username | Password | Role  |
| -------- | -------- | ----- |
| `admin`  | `admin`  | Admin |

The session is persisted in `localStorage` via `useSyncExternalStore` (SSR-safe) and survives page refreshes. Sign out clears it.

All real Supabase auth code is commented out with `// TODO [Phase 2]` markers across the codebase. Search for this marker to find all locations that need re-activation when Supabase is integrated.

### Environment Variables

Copy the example file and adjust as needed:

```bash
cp .env.local.example .env.local
```

| Variable                        | Required | Description                                                                |
| ------------------------------- | -------- | -------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | Phase 2  | Local: `http://127.0.0.1:54321`                                            |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Phase 2  | Supabase anonymous key                                                     |
| `SUPABASE_SERVICE_ROLE_KEY`     | Phase 2  | Supabase service role key                                                  |
| `GEMINI_API_KEY`                | Optional | Google Gemini API key ([generate one](https://aistudio.google.com/apikey)) |

**Important**: for phase 1, keep the Supabase variables **commented out** in `.env.local`. If they are set, the app will try to connect to Supabase and fail silently (e.g. the wizard can't proceed past step 3).

### Available Scripts

| Command                   | Description                                  |
| ------------------------- | -------------------------------------------- |
| `npm run dev`             | Start dev server (Turbopack)                 |
| `npm run build`           | Production build                             |
| `npm run start`           | Start production server                      |
| `npm run check:all`       | Run lint + type check                        |
| `npm run check:lint`      | ESLint with auto-fix                         |
| `npm run check:types`     | TypeScript type check (`tsc --noEmit`)       |
| `npm run format:code`     | Prettier format all files                    |
| `npm run check:precommit` | Format + lint + types (for pre-commit hooks) |

### Supabase Commands (Phase 2)

| Command                    | Description                                                      |
| -------------------------- | ---------------------------------------------------------------- |
| `npm run db:start`         | Start local Supabase stack (PostgreSQL, Auth, Storage, Studio)   |
| `npm run db:stop`          | Stop local Supabase stack                                        |
| `npm run db:reset`         | Reset database, re-run migrations + seed                         |
| `npm run db:studio`        | Open Supabase Studio ([localhost:54323](http://127.0.0.1:54323)) |
| `npm run db:migration:new` | Create a new migration file                                      |
| `npm run db:types`         | Generate TypeScript types from local schema                      |

## Architecture

### Project Structure

```
config/
├── audit.config.ts              Audit scopes, criteria per scope, labels
├── wcag.config.ts               Full WCAG 2.2 criteria definitions (86 criteria)
├── automation.config.ts         axe-core rule ↔ WCAG criterion mapping
└── theme.config.ts              MUI theme customization

src/
├── @types/                      Shared TypeScript interfaces
│   ├── audit.ts                   AuditType, AuditScope, AuditStatus
│   ├── criteria.ts                WcagCriterion, EvaluationOutcome
│   ├── earl.ts                    EARL/JSON-LD types (old step-based + WCAG-EM v3)
│   ├── finding.ts                 FindingPriority
│   ├── sample.ts                  SamplePage, SampleType, AuditMode
│   ├── scan.ts                    ScanResult, ScanViolation
│   └── user.ts                    User, UserRole
│
├── app/                         Next.js App Router
│   ├── layout.tsx                 Root layout (providers: Auth, Theme, Redux)
│   ├── page.tsx                   Landing / redirect
│   ├── globals.css                Global styles
│   ├── login/
│   │   ├── page.tsx               Login page (fake auth in phase 1)
│   │   └── _components/
│   │       └── LoginPageContent.tsx  Client-side login form
│   ├── dashboard/
│   │   └── page.tsx               Dashboard with audit stats + recent audits
│   ├── audits/
│   │   ├── page.tsx               Audit list with search + status filter
│   │   ├── new/
│   │   │   └── page.tsx           8-step audit wizard (main orchestrator)
│   │   ├── import/
│   │   │   ├── page.tsx           EARL/JSON-LD file import (loads into Redux)
│   │   │   └── page.callbacks.ts  File parsing + Redux dispatch handlers
│   │   └── [id]/
│   │       ├── page.tsx           Audit detail view
│   │       ├── report/
│   │       │   └── page.tsx       Full audit report
│   │       └── automated/
│   │           └── page.tsx       Automated scan results view
│   ├── admin/
│   │   ├── page.tsx               Admin overview (stats, charts, all audits)
│   │   └── users/
│   │       ├── page.tsx           User management (phase 2 placeholder)
│   │       └── invite.schema.ts   Zod validation for invite/role forms
│   └── api/
│       ├── scan/
│       │   └── route.ts           POST: run axe-core scan on a URL
│       ├── screenshot/
│       │   └── route.ts           POST: capture screenshot of a DOM node
│       └── ai/
│           └── summary/
│               └── route.ts       POST: generate executive summary via Gemini
│
├── auth/
│   ├── auth.ts                    Auth guards (requireLoggedIn, requireAnonymous)
│   ├── auth.middleware.ts         Session middleware (pass-through in phase 1)
│   └── auth.constants.ts         Auth cookie name and config
│
├── components/                  Atomic Design component hierarchy
│   ├── atoms/                     MUI abstraction layer + domain-specific atoms
│   │   ├── accordion/               Collapsible panel (MUI Accordion)
│   │   ├── alert/                   Feedback message (MUI Alert)
│   │   ├── app-bar/                 Top navigation bar (MUI AppBar)
│   │   ├── button/                  Action button (MUI Button)
│   │   ├── checkbox/                Checkbox input (MUI Checkbox)
│   │   ├── collapsible/             Expand/collapse wrapper (MUI Collapse)
│   │   ├── confirm-dialog/          Confirmation dialog (MUI Dialog)
│   │   ├── conformance-icon/        WCAG conformance level icon
│   │   ├── content-card/            Content container (MUI Card)
│   │   ├── divider/                 Horizontal separator (MUI Divider)
│   │   ├── donut-chart/             Donut chart (Recharts PieChart)
│   │   ├── drawer/                  Side panel (MUI Drawer)
│   │   ├── error/                   ErrorAlert component for API/form errors
│   │   ├── export-button/           Report export trigger
│   │   ├── form/                    Generic Form wrapper (react-hook-form)
│   │   ├── form-group/              Form field group (MUI FormGroup)
│   │   ├── form-select/             Controlled select field
│   │   ├── form-text-field/         Controlled text field
│   │   ├── heading/                 Semantic heading (h1-h6)
│   │   ├── icon/                    Icon component with generated registry
│   │   ├── icon-button/             Icon-only button (MUI IconButton)
│   │   ├── image-gallery/           Lightbox image gallery
│   │   ├── layout-grid/             Responsive grid (MUI Grid)
│   │   ├── link/                    Navigation link (Next.js Link + MUI)
│   │   ├── list/                    Vertical list (MUI List)
│   │   ├── nav-item/                Navigation list item
│   │   ├── priority-chip/           Finding priority label chip
│   │   ├── progress-bar/            Linear progress indicator
│   │   ├── scope-icon/              Audit scope indicator
│   │   ├── select-input/            Standalone select input
│   │   ├── spinner/                 Loading spinner (MUI CircularProgress)
│   │   ├── stat-card/               Dashboard statistic card
│   │   ├── status-badge/            Audit status indicator
│   │   ├── stepper/                 Step wizard indicator (MUI Stepper)
│   │   ├── table/                   HTML table wrapper (MUI Table)
│   │   ├── tag/                     Label tag (MUI Chip)
│   │   ├── testability-badge/       Criterion testability indicator
│   │   ├── text/                    Typography component (MUI Typography)
│   │   ├── text-input/              Standalone text input
│   │   ├── toast/                   Toast notification (MUI Snackbar)
│   │   ├── toolbar/                 Toolbar container (MUI Toolbar)
│   │   ├── tooltip/                 Hover tooltip (MUI Tooltip)
│   │   ├── vertical-bar-chart/      Bar chart (Recharts BarChart)
│   │   ├── wcag-level-badge/        WCAG level (A/AA/AAA) badge
│   │   └── wrapper/                 Generic container (MUI Box)
│   │
│   ├── molecules/                 Compositions of atoms
│   │   ├── audit-scope-card/        Scope tier selection card
│   │   ├── audit-type-card/         Audit type selection card
│   │   ├── contact-form-card/       Owner contact info form
│   │   ├── criterion-card/          WCAG criterion evaluation card
│   │   ├── data-table/              Reusable table (TanStack Table)
│   │   ├── edit-role-dialog/        Role editing dialog (phase 2)
│   │   ├── executive-summary-card/  AI summary editor card
│   │   ├── finding-form/            Finding creation/edit form + submit button
│   │   ├── invite-user-dialog/      User invite dialog (phase 2)
│   │   ├── issue-card/              Finding display card
│   │   ├── nav-drawer/              Navigation sidebar content
│   │   ├── sample-page-card/        Sample page entry card
│   │   ├── scan-progress-card/      Scan progress indicator
│   │   ├── screenshot-uploader/     Screenshot upload (drag/paste/browse)
│   │   ├── statement-guidance-card/  Accessibility statement helper
│   │   ├── technology-checkbox/     Technology selection checkbox
│   │   ├── user-profile-card/       User info + sign out
│   │   └── violation-list-item/     Scan violation display row
│   │
│   └── organisms/                Full sections with business logic
│       ├── app-shell/               Main layout shell (AppBar + Drawer)
│       └── wizard/                  Audit wizard step components
│           ├── step-audit-scope/      Step 1: Audit type & scope selection
│           ├── step-sample-pages/     Step 2: Sample page management
│           ├── step-technologies/     Step 3: Technology selection
│           ├── step-automated-scan/   Step 4: axe-core automated scan
│           ├── step-manual-reporting/ Step 5: Per-criterion evaluation + findings
│           │   └── FindingItem.tsx      Individual finding display
│           ├── step-auditor-summary/  Step 6: Auditor info + executive summary
│           ├── step-dashboard/        Step 7: Conformance dashboard + report preview
│           │   ├── ReportPreview.tsx     Collapsible findings-by-page report
│           │   └── ReportFindingCard.tsx Read-only finding card for report
│           └── step-next-steps/       Step 8: Statement guidance + contacts
│
├── contexts/
│   ├── AuthContext.tsx             Fake auth via useSyncExternalStore (phase 1) / Supabase (phase 2)
│   └── ThemeContext.tsx            MUI theme + dark/light mode toggle
│
├── hooks/
│   ├── api.hooks.ts               useAction, useGetItem, useGetList (generic API hooks)
│   ├── audit.hooks.ts             useAudit, useAudits (Supabase data)
│   ├── findings.hooks.ts          useAuditResults (results, findings, screenshots)
│   ├── localAuditResults.hooks.ts useLocalAuditResults (Redux-based results for wizard)
│   ├── scan.hooks.ts              useScan (axe-core scan orchestration)
│   └── tables/                    TanStack Table column definitions
│       ├── auditList.table.tsx      Audit list columns
│       ├── conformanceOverview.table.tsx  Conformance table columns
│       ├── importPreview.table.tsx  EARL import preview columns
│       ├── remediationBacklog.table.tsx   Remediation backlog columns
│       └── userManagement.table.tsx  User management columns (phase 2)
│
├── redux/
│   ├── store.ts                   Redux store configuration
│   ├── providers/
│   │   └── store-provider.tsx     Redux provider wrapper
│   └── slices/
│       ├── audit.ts               Wizard state (steps, form data, sample pages)
│       └── criteria.ts            WCAG criteria + scope-based filtering
│
├── services/
│   ├── api.service.ts             Supabase client factory + apiFetch + ApiError
│   ├── ai.service.ts              AI summary generation service
│   ├── audit.service.ts           Audit CRUD operations (Supabase)
│   └── scan.service.ts            Scan trigger service
│
├── server/
│   └── api/supabase/
│       ├── client.ts              Browser Supabase client (proxy when unconfigured)
│       └── server.ts              Server Supabase client (Next.js cookies)
│
├── utils/
│   ├── auditScope.util.ts        Scope comparison helpers
│   ├── color.util.ts             Semantic color configuration
│   ├── earlTransform.util.ts     EARL/JSON-LD parser (old + v3 formats) + export
│   ├── findings.util.ts          Finding count/filter helpers
│   ├── format.util.ts            Display formatting (displayValue, truncate, etc.)
│   ├── prioritization.util.ts    Priority sorting logic
│   ├── publishAudit.util.ts      Wizard → Supabase persistence (publish flow)
│   ├── reportGeneration.util.ts  Report data aggregation by sample page
│   ├── scan.util.ts              axe-core result processing
│   ├── server-promises.util.ts   safeAwait async wrapper (server-only)
│   ├── validation.util.ts        Zod resolver factory for react-hook-form
│   ├── violations.util.ts        Violation grouping/deduplication
│   └── wcagMapping.util.ts       axe-core rule → WCAG criterion mapping
│
└── middleware.ts                  Next.js middleware entry point

supabase/
├── config.toml                  Supabase local config
├── seed.sql                     Database seed data (test accounts)
└── migrations/
    └── 001_initial_schema.sql   Full schema (users, audits, findings, RLS)
```

### Audit Wizard Flow

The audit wizard (`/audits/new`) follows the 8-step WCAG-EM 2.0 methodology. State is managed in Redux (`audit` slice) and published to Supabase via the "Publish Audit" button.

```
Step 1: Audit Type & Scope     → Select audit type (web/design/doc/app) + scope tier
Step 2: Sample Pages           → Add pages to audit sample set
Step 3: Technologies           → Select technologies in use (HTML, CSS, JS, etc.)
Step 4: Automated Scan         → Run axe-core scan, approve/dismiss violations
Step 5: Manual Reporting       → Per-criterion per-page evaluation + findings
Step 6: Auditor & Summary      → Review auditor info, generate executive summary
Step 7: Dashboard              → Conformance overview, charts, report preview, quick wins
Step 8: Next Steps             → Accessibility statement, remediation backlog, contacts
        ── Publish Audit ──── → Write full state to Supabase, redirect to audit detail
```

Approved automated scan violations are prefilled as findings in Step 5. The Dashboard (Step 7) includes a collapsible Report Preview showing all findings grouped by sample page with merged screenshots.

**Import path**: EARL/JSON-LD files imported via `/audits/import` are parsed and loaded into Redux, landing the user directly on Step 7 (Dashboard) with a Publish button to persist to Supabase.

### State Management

| Concern               | Solution                               | Scope                   |
| --------------------- | -------------------------------------- | ----------------------- |
| Wizard form data      | Redux Toolkit (`audit` slice)          | Audit creation + import |
| Scan results          | Redux Toolkit (`audit` slice)          | Automated scan step     |
| WCAG criteria catalog | Redux Toolkit (`criteria` slice)       | App-wide                |
| Authentication        | React Context + `useSyncExternalStore` | App-wide                |
| Theme / dark mode     | React Context (`ThemeContext`)         | App-wide                |
| Persistence           | `publishAudit.util.ts` → Supabase      | Publish action          |
| Audit data (CRUD)     | Supabase via hooks                     | Phase 2                 |

### Component Architecture (Atomic Design)

Components follow the Atomic Design pattern:

- **Atoms** -- smallest building blocks, no business logic (badges, form fields, icons)
- **Molecules** -- compositions of atoms with some local state (cards, dialogs, form sections)
- **Organisms** -- full sections with business logic, context access, API calls (wizard steps, app shell)

Each component lives in its own folder with co-located files:

- `ComponentName.tsx` -- the component
- `component-name.types.ts` -- TypeScript props interface (when needed)
- `component-name.constants.ts` -- local constants (when needed)
- `component-name.callbacks.ts` -- extracted callback functions (when needed)

### Naming Conventions

| Folder       | File Pattern                    | Example                         |
| ------------ | ------------------------------- | ------------------------------- |
| config       | `{name}.config.ts`              | `audit.config.ts`               |
| utils        | `{name}.util.ts`                | `wcagMapping.util.ts`           |
| hooks        | `{domain}.hooks.ts`             | `audit.hooks.ts`                |
| hooks/tables | `{name}.table.tsx`              | `auditList.table.tsx`           |
| contexts     | `{Name}Context.tsx`             | `AuthContext.tsx`               |
| components   | `{ComponentName}.tsx`           | `CriterionCard.tsx`             |
| co-located   | `{component-name}.types.ts`     | `criterion-card.types.ts`       |
| co-located   | `{component-name}.constants.ts` | `step-audit-scope.constants.ts` |
| co-located   | `{component-name}.callbacks.ts` | `step-dashboard.callbacks.ts`   |
| types        | `{domain}.ts`                   | `finding.ts`                    |
| services     | `{domain}.service.ts`           | `audit.service.ts`              |
| Redux slices | `{domain}.ts`                   | `audit.ts`                      |

### Key Conventions

- **No `.find()` or `.filter()` in components** -- extract to utils or hooks
- **No prop drilling** -- use Context + custom hooks for shared state
- **No magic numbers** -- use named constants from config files
- **Type-only imports** -- enforced via ESLint (`consistent-type-imports`)
- **Logical CSS properties** -- `inlineSize` instead of `width`, `blockSize` instead of `height`, etc.
- **Supabase queries in hooks only** -- never called directly in components

### API Routes

| Endpoint          | Method | Description                                                                        |
| ----------------- | ------ | ---------------------------------------------------------------------------------- |
| `/api/scan`       | POST   | Runs an axe-core accessibility scan on a given URL using headless Chromium         |
| `/api/screenshot` | POST   | Captures a screenshot of a specific DOM element via Puppeteer                      |
| `/api/ai/summary` | POST   | Generates an executive summary using Google Gemini Flash based on audit statistics |

### Linting & Formatting

ESLint 9 flat config with these plugins:

- **eslint-config-next** -- Next.js core web vitals + TypeScript rules
- **eslint-plugin-sonarjs** -- code quality (complexity, duplicates)
- **eslint-plugin-jsx-a11y-x** -- enhanced accessibility linting
- **eslint-plugin-baseline-js** -- flags non-widely-available JS features
- **eslint-plugin-react-you-might-not-need-an-effect** -- detects unnecessary useEffect
- **eslint-plugin-depend** -- suggests lighter dependency alternatives

Prettier is configured with `printWidth: 120`, single quotes, trailing commas, and auto-sorted imports.

Run before committing:

```bash
npm run check:precommit
```

## Audit Scopes

| Scope       | Criteria | Coverage    | Use Case                             |
| ----------- | -------- | ----------- | ------------------------------------ |
| Quick       | 17       | ~30% AA     | Quick indication, not for compliance |
| Typical     | 28       | ~51% AA     | Improvement guidance                 |
| **Full AA** | **55**   | **100% AA** | **Compliance (default)**             |
| Full AAA    | 86       | 100% AAA    | Maximum coverage (rare)              |

Scope definitions and criteria mappings are configured in `config/audit.config.ts`. The full WCAG 2.2 criteria catalog lives in `config/wcag.config.ts`.

## Phase 2 Activation Guide

To enable Supabase when ready:

1. Start local Supabase: `npm run db:start`
2. Uncomment Supabase variables in `.env.local`
3. Search the codebase for `// TODO [Phase 2]` and uncomment all marked code
4. Key files to update:
   - `src/contexts/AuthContext.tsx` -- re-enable Supabase auth
   - `src/auth/auth.middleware.ts` -- re-enable session validation
   - `src/app/login/page.tsx` -- re-enable email login + sign-up tab
   - `src/app/login/login.schema.ts` -- re-enable sign-up schema
   - `src/app/admin/users/page.tsx` -- re-enable user management CRUD
5. Run migrations: `npm run db:reset`

## License

Private -- All rights reserved.
