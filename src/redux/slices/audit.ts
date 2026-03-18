import type { AuditScope, AuditType } from '@/@types/audit';
import type { EvaluationOutcome } from '@/@types/criteria';
import type { FindingPriority } from '@/@types/finding';
import type { SamplePage } from '@/@types/sample';
import type { AxeViolation } from '@/@types/scan';
import type { AppState } from '@/redux/store';
import type { ImportedAudit } from '@/utils/earlTransform.util';
import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

import { mapAxeImpactToPriority, mapAxeTagsToCriteria } from '@/utils/wcagMapping.util';

const VALID_OUTCOMES = new Set<string>(['passed', 'failed', 'inapplicable', 'cantTell', 'untested']);

const DASHBOARD_STEP = 6;

export type SamplePageDraft = Omit<SamplePage, 'auditId'>;

export interface AuditResultDraft {
  id: string;
  criterionId: string;
  samplePageId: string;
  outcome: EvaluationOutcome;
  observations: string;
}

export interface FindingDraft {
  id: string;
  auditResultId: string;
  description: string;
  recommendation: string;
  priority: FindingPriority;
  elementSelector: string;
  elementHtml: string;
  fromAutomatedScan: boolean;
  auditorValidated: boolean;
  isUnresolvable: boolean;
  alternativeSolution: string;
  createdAt: string;
}

export interface FindingScreenshotDraft {
  id: string;
  findingId: string;
  dataUrl: string;
  altText: string;
}

export interface ScanPageResultDraft {
  pageId: string;
  pageTitle: string;
  url: string;
  violations: AxeViolation[];
  passesCount: number;
  incompleteCount: number;
  inapplicableCount: number;
  screenshots: Record<string, string>;
  scannedAt: string;
}

export interface AuditWizardState {
  activeStep: number;
  isSaving: boolean;
  savedAuditId: string | null;
  title: string;
  commissioner: string;
  auditType: AuditType;
  auditScope: AuditScope;
  accessibilityBaseline: string;
  executiveSummary: string;
  statementGuidance: string;
  ownerContactPhone: string;
  ownerContactEmail: string;
  ownerContactAddress: string;
  samplePages: SamplePageDraft[];
  technologies: string[];
  auditResults: AuditResultDraft[];
  findings: FindingDraft[];
  screenshots: FindingScreenshotDraft[];
  scanResults: Record<string, ScanPageResultDraft>;
  dismissedViolationKeys: string[];
  approvedViolationKeys: string[];
}

const initialState: AuditWizardState = {
  activeStep: 0,
  isSaving: false,
  savedAuditId: null,
  title: '',
  commissioner: '',
  auditType: 'web',
  auditScope: 'full_aa' satisfies AuditScope,
  accessibilityBaseline: '',
  executiveSummary: '',
  statementGuidance: '',
  ownerContactPhone: '',
  ownerContactEmail: '',
  ownerContactAddress: '',
  samplePages: [],
  technologies: ['html', 'css', 'js'],
  auditResults: [],
  findings: [],
  screenshots: [],
  scanResults: {},
  dismissedViolationKeys: [],
  approvedViolationKeys: [],
};

const slice = createSlice({
  name: 'audit',
  initialState,
  reducers: {
    setActiveStep(state, action: PayloadAction<number>) {
      state.activeStep = action.payload;
    },
    nextStep(state) {
      state.activeStep += 1;
    },
    previousStep(state) {
      state.activeStep = Math.max(0, state.activeStep - 1);
    },
    setIsSaving(state, action: PayloadAction<boolean>) {
      state.isSaving = action.payload;
    },
    setSavedAuditId(state, action: PayloadAction<string>) {
      state.savedAuditId = action.payload;
    },
    updateAuditInfo(
      state,
      action: PayloadAction<
        Partial<Pick<AuditWizardState, 'title' | 'commissioner' | 'auditType' | 'auditScope' | 'accessibilityBaseline'>>
      >,
    ) {
      Object.assign(state, action.payload);
    },
    setSamplePages(state, action: PayloadAction<SamplePageDraft[]>) {
      state.samplePages = action.payload;
    },
    addSamplePage(state, action: PayloadAction<Omit<SamplePageDraft, 'id'>>) {
      state.samplePages.push({
        ...action.payload,
        id: crypto.randomUUID(),
        sortOrder: state.samplePages.length,
      });
    },
    removeSamplePage(state, action: PayloadAction<number>) {
      state.samplePages.splice(action.payload, 1);
      state.samplePages.forEach((p, i) => {
        p.sortOrder = i;
      });
    },
    updateSamplePage(state, action: PayloadAction<{ index: number; updates: Partial<SamplePageDraft> }>) {
      const { index, updates } = action.payload;
      if (state.samplePages[index]) {
        Object.assign(state.samplePages[index], updates);
      }
    },
    setTechnologies(state, action: PayloadAction<string[]>) {
      state.technologies = action.payload;
    },
    toggleTechnology(state, action: PayloadAction<string>) {
      const techId = action.payload;
      const idx = state.technologies.indexOf(techId);
      if (idx >= 0) {
        state.technologies.splice(idx, 1);
      } else {
        state.technologies.push(techId);
      }
    },
    updateNextSteps(
      state,
      action: PayloadAction<
        Partial<
          Pick<
            AuditWizardState,
            'executiveSummary' | 'statementGuidance' | 'ownerContactPhone' | 'ownerContactEmail' | 'ownerContactAddress'
          >
        >
      >,
    ) {
      Object.assign(state, action.payload);
    },

    upsertAuditResult(
      state,
      action: PayloadAction<{
        criterionId: string;
        samplePageId: string;
        outcome: EvaluationOutcome;
        observations: string;
      }>,
    ) {
      const { criterionId, samplePageId, outcome, observations } = action.payload;
      const existing = state.auditResults.find((r) => r.criterionId === criterionId && r.samplePageId === samplePageId);
      if (existing) {
        existing.outcome = outcome;
        existing.observations = observations;
      } else {
        state.auditResults.push({
          id: crypto.randomUUID(),
          criterionId,
          samplePageId,
          outcome,
          observations,
        });
      }
    },

    addFinding(
      state,
      action: PayloadAction<{
        auditResultId: string;
        finding: Omit<FindingDraft, 'id' | 'auditResultId' | 'createdAt'>;
      }>,
    ) {
      state.findings.push({
        id: crypto.randomUUID(),
        auditResultId: action.payload.auditResultId,
        createdAt: new Date().toISOString(),
        ...action.payload.finding,
      });
    },

    updateFinding(state, action: PayloadAction<{ findingId: string; updates: Partial<FindingDraft> }>) {
      const finding = state.findings.find((f) => f.id === action.payload.findingId);
      if (finding) {
        Object.assign(finding, action.payload.updates);
      }
    },

    deleteFinding(state, action: PayloadAction<string>) {
      state.findings = state.findings.filter((f) => f.id !== action.payload);
      state.screenshots = state.screenshots.filter((s) => s.findingId !== action.payload);
    },

    addScreenshot(state, action: PayloadAction<FindingScreenshotDraft>) {
      state.screenshots.push(action.payload);
    },

    setScanResult(state, action: PayloadAction<ScanPageResultDraft>) {
      state.scanResults[action.payload.pageId] = action.payload;
    },

    clearScanResults(state) {
      state.scanResults = {};
      state.dismissedViolationKeys = [];
      state.approvedViolationKeys = [];
    },

    approveViolation(state, action: PayloadAction<string>) {
      if (!state.approvedViolationKeys.includes(action.payload)) {
        state.approvedViolationKeys.push(action.payload);
      }
      state.dismissedViolationKeys = state.dismissedViolationKeys.filter((k) => k !== action.payload);
    },

    dismissViolation(state, action: PayloadAction<string>) {
      if (!state.dismissedViolationKeys.includes(action.payload)) {
        state.dismissedViolationKeys.push(action.payload);
      }
      state.approvedViolationKeys = state.approvedViolationKeys.filter((k) => k !== action.payload);
    },

    prefillScanFindings(state) {
      const existingScanKeys = new Set(
        state.findings
          .filter((f) => f.fromAutomatedScan)
          .map((f) => {
            const result = state.auditResults.find((r) => r.id === f.auditResultId);

            return result ? `${result.samplePageId}__${result.criterionId}__${f.elementSelector}` : '';
          }),
      );

      for (const [pageId, pageResult] of Object.entries(state.scanResults)) {
        pageResult.violations.forEach((violation: AxeViolation, vIdx: number) => {
          const vKey = `${pageId}-${vIdx}`;
          if (!state.approvedViolationKeys.includes(vKey)) {
            return;
          }

          const criteriaIds = mapAxeTagsToCriteria(violation.tags);
          const priority = mapAxeImpactToPriority(violation.impact);

          for (const node of violation.nodes) {
            const selector = node.target[0] ?? '';

            for (const criterionId of criteriaIds) {
              const dedupeKey = `${pageId}__${criterionId}__${selector}`;
              if (existingScanKeys.has(dedupeKey)) {
                continue;
              }
              existingScanKeys.add(dedupeKey);

              let resultEntry = state.auditResults.find(
                (r) => r.criterionId === criterionId && r.samplePageId === pageId,
              );
              if (!resultEntry) {
                const newResult: AuditResultDraft = {
                  id: crypto.randomUUID(),
                  criterionId,
                  samplePageId: pageId,
                  outcome: 'failed',
                  observations: '',
                };
                state.auditResults.push(newResult);
                resultEntry = newResult;
              } else if (resultEntry.outcome === 'untested') {
                resultEntry.outcome = 'failed';
              }

              state.findings.push({
                id: crypto.randomUUID(),
                auditResultId: resultEntry.id,
                description: violation.help,
                recommendation: violation.description,
                priority,
                elementSelector: selector,
                elementHtml: node.html,
                fromAutomatedScan: true,
                auditorValidated: false,
                isUnresolvable: false,
                alternativeSolution: '',
                createdAt: new Date().toISOString(),
              });
            }
          }
        });
      }
    },

    /**
     * Populates the entire wizard state from an imported EARL audit.
     * Sets activeStep to the dashboard so the user can review and publish.
     */
    loadImportedAudit(_state, action: PayloadAction<ImportedAudit>) {
      const imported = action.payload;

      const samplePages: SamplePageDraft[] = imported.samplePages.map((p, index) => ({
        id: p.id || crypto.randomUUID(),
        title: p.title,
        url: p.url,
        description: '',
        sampleType: 'structured' as const,
        auditMode: 'full' as const,
        isTested: true,
        sortOrder: index,
      }));

      const pageIdSet = new Set(samplePages.map((p) => p.id));

      const auditResults: AuditResultDraft[] = [];

      for (const result of imported.results) {
        const samplePageId = pageIdSet.has(result.samplePageId) ? result.samplePageId : (samplePages[0]?.id ?? '');

        if (!samplePageId) {
          continue;
        }

        const outcome: EvaluationOutcome = VALID_OUTCOMES.has(result.outcome)
          ? (result.outcome as EvaluationOutcome)
          : 'untested';

        auditResults.push({
          id: crypto.randomUUID(),
          criterionId: result.criterionId,
          samplePageId,
          outcome,
          observations: result.description,
        });
      }

      return {
        ...initialState,
        activeStep: DASHBOARD_STEP,
        title: imported.title,
        commissioner: imported.commissioner,
        auditScope: imported.scope,
        accessibilityBaseline: imported.accessibilityBaseline,
        samplePages,
        technologies: imported.technologies.map((t) => t.name),
        auditResults,
      };
    },

    resetAudit() {
      return initialState;
    },
  },
});

export const {
  setActiveStep,
  nextStep,
  previousStep,
  setIsSaving,
  setSavedAuditId,
  updateAuditInfo,
  setSamplePages,
  addSamplePage,
  removeSamplePage,
  updateSamplePage,
  setTechnologies,
  toggleTechnology,
  updateNextSteps,
  upsertAuditResult,
  addFinding,
  updateFinding,
  deleteFinding,
  addScreenshot,
  setScanResult,
  clearScanResults,
  approveViolation,
  dismissViolation,
  prefillScanFindings,
  loadImportedAudit,
  resetAudit,
} = slice.actions;

export const selectActiveStep = (state: AppState) => state.audit.activeStep;
export const selectAuditScope = (state: AppState) => state.audit.auditScope;
export const selectSamplePages = (state: AppState) => state.audit.samplePages;
export const selectTechnologies = (state: AppState) => state.audit.technologies;
export const selectAuditResults = (state: AppState) => state.audit.auditResults;
export const selectFindings = (state: AppState) => state.audit.findings;
export const selectScreenshots = (state: AppState) => state.audit.screenshots;
export const selectScanResults = (state: AppState) => state.audit.scanResults;
export const selectDismissedViolationKeys = (state: AppState) => state.audit.dismissedViolationKeys;
export const selectApprovedViolationKeys = (state: AppState) => state.audit.approvedViolationKeys;

export default slice.reducer;
