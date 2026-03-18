import type { WcagCriterion } from '@/@types/criteria';
import type { FindingPriority } from '@/@types/finding';

import { WCAG_CRITERIA } from '@/../config/wcag.config';

const AXE_TAG_TO_CRITERION: Record<string, string> = {};

for (const criterion of WCAG_CRITERIA) {
  const numericId = criterion.id.replace(/\./g, '');
  AXE_TAG_TO_CRITERION[`wcag${numericId}`] = criterion.id;
}

/**
 * Maps axe-core rule tags to WCAG criterion IDs.
 * @param {string[]} tags - The axe-core tags from a violation (e.g. "wcag111").
 * @returns {string[]} Unique WCAG criterion IDs (e.g. "1.1.1").
 */
export const mapAxeTagsToCriteria = (tags: string[]): string[] => {
  const criteria = new Set<string>();
  for (const tag of tags) {
    const criterion = AXE_TAG_TO_CRITERION[tag];
    if (criterion) {
      criteria.add(criterion);
    }
  }
  return Array.from(criteria);
};

/**
 * Groups WCAG criteria by their principle number (1-4).
 * @param {WcagCriterion[]} criteria - The criteria to group.
 * @returns {Record<number, WcagCriterion[]>} A map from principle number to its criteria.
 */
export const groupCriteriaByPrinciple = (criteria: WcagCriterion[]): Record<number, WcagCriterion[]> => {
  const grouped: Record<number, WcagCriterion[]> = { 1: [], 2: [], 3: [], 4: [] };
  for (const c of criteria) {
    grouped[c.principle].push(c);
  }
  return grouped;
};

/**
 * Converts an axe-core impact level to an internal finding priority.
 * @param {'minor' | 'moderate' | 'serious' | 'critical' | null} impact - The axe-core impact level.
 * @returns {FindingPriority} The corresponding finding priority.
 */
export const mapAxeImpactToPriority = (
  impact: 'minor' | 'moderate' | 'serious' | 'critical' | null,
): FindingPriority => {
  switch (impact) {
    case 'critical':
      return 'critical';
    case 'serious':
      return 'major';
    case 'moderate':
      return 'minor';
    case 'minor':
    default:
      return 'advisory';
  }
};
