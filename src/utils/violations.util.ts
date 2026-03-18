import { getTestability } from '@/../config/automation.config';

export interface TestabilityInfo {
  criterionId: string;
  level: 'auto' | 'partial' | 'manual';
  automation: { can: string[]; cannot: string[] };
  actRules: Array<{ status: string; implementation: string; url: string; name: string }>;
}

export interface CannotVerifyItem {
  criterionId: string;
  item: string;
}

export interface ActRuleWithCriterion {
  criterionId: string;
  status: string;
  implementation: string;
  url: string;
  name: string;
}

/**
 * Retrieves testability info for each criterion linked to a violation.
 * @param {string[]} criteriaIds - The WCAG criterion IDs to look up.
 * @returns {TestabilityInfo[]} Testability details per criterion (level, automation capabilities, ACT rules).
 */
export const getViolationTestabilityInfo = (criteriaIds: string[]): TestabilityInfo[] => {
  return criteriaIds.map((cId) => ({
    criterionId: cId,
    ...getTestability(cId),
  }));
};

/**
 * Extracts all items that automated tools cannot verify from testability info.
 * @param {TestabilityInfo[]} testabilityInfo - The testability info per criterion.
 * @returns {CannotVerifyItem[]} Flat list of criterion-item pairs that require manual verification.
 */
export const getCannotVerifyItems = (testabilityInfo: TestabilityInfo[]): CannotVerifyItem[] => {
  return testabilityInfo.flatMap((t) => t.automation.cannot.map((item) => ({ criterionId: t.criterionId, item })));
};

/**
 * Extracts all ACT rules with their associated criterion ID from testability info.
 * @param {TestabilityInfo[]} testabilityInfo - The testability info per criterion.
 * @returns {ActRuleWithCriterion[]} Flat list of ACT rules enriched with their criterion ID.
 */
export const getActRulesWithCriteria = (testabilityInfo: TestabilityInfo[]): ActRuleWithCriterion[] => {
  return testabilityInfo.flatMap((t) => t.actRules.map((rule) => ({ criterionId: t.criterionId, ...rule })));
};
