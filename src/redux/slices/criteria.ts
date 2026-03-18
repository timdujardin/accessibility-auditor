import type { AuditScope } from '@/@types/audit';
import type { WcagCriterion } from '@/@types/criteria';
import type { AppState } from '@/redux/store';

import { createSelector, createSlice } from '@reduxjs/toolkit';

import { getCriteriaForScope } from '@/../config/audit.config';
import { WCAG_CRITERIA } from '@/../config/wcag.config';

interface CriteriaState {
  allCriteria: WcagCriterion[];
}

const initialState: CriteriaState = {
  allCriteria: WCAG_CRITERIA,
};

const slice = createSlice({
  name: 'criteria',
  initialState,
  reducers: {},
});

export const selectAllCriteria = (state: AppState) => state.criteria.allCriteria;

export const selectActiveCriteria = createSelector(
  [(state: AppState) => state.criteria.allCriteria, (state: AppState) => state.audit.auditScope],
  (allCriteria, scope) => {
    const criteriaIds = getCriteriaForScope(scope);

    return allCriteria.filter((c) => criteriaIds.includes(c.id));
  },
);

export const selectCriteriaForScope = (scope: AuditScope) => {
  return createSelector([(state: AppState) => state.criteria.allCriteria], (allCriteria) => {
    const criteriaIds = getCriteriaForScope(scope);

    return allCriteria.filter((c) => criteriaIds.includes(c.id));
  });
};

export default slice.reducer;
