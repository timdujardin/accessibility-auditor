export type ConformanceLevel = 'A' | 'AA' | 'AAA';

export type WcagPrinciple = 1 | 2 | 3 | 4;

export type EvaluationOutcome = 'passed' | 'failed' | 'inapplicable' | 'cantTell' | 'untested';

export interface WcagCriterion {
  id: string;
  name: string;
  url: string;
  level: ConformanceLevel;
  principle: WcagPrinciple;
  guideline: string;
  description: string;
}

export type TestabilityLevel = 'auto' | 'partial' | 'manual';

export interface AutomationCapability {
  can: string[];
  cannot: string[];
}

export interface ActRule {
  id: string;
  name: string;
  url: string;
  status: 'approved' | 'proposed';
  implementation: 'manual' | 'semi-auto' | 'automated' | 'linter';
}

export interface CriterionTestability {
  level: TestabilityLevel;
  automation: AutomationCapability;
  actRules: ActRule[];
}

export interface AuditResult {
  id: string;
  auditId: string;
  criterionId: string;
  samplePageId: string;
  outcome: EvaluationOutcome;
  observations: string;
}
