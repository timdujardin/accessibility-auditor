import type { User } from '@/@types/user';
import type { AuditWizardState } from '@/redux/slices/audit';
import type { AppDispatch } from '@/redux/store';
import type { PublishError, PublishResult } from '@/utils/publishAudit.util';

import { updateNextSteps } from '@/redux/slices/audit';

type DoPublishFn = (user: User, state: AuditWizardState) => Promise<PublishResult | PublishError>;

/**
 * Publishes the audit using the current wizard state.
 * @param {User | null} user - The current user.
 * @param {AuditWizardState} auditState - The audit wizard state to publish.
 * @param {DoPublishFn} doPublish - Callback that performs the publish.
 * @returns {Promise<void>} Resolves when publish completes or is skipped.
 */
export const handlePublish = async (user: User | null, auditState: AuditWizardState, doPublish: DoPublishFn) => {
  if (!user) {
    return;
  }

  try {
    const result = await doPublish(user, auditState);
    if ('error' in result) {
      return;
    }
  } catch {
    // Error state managed by useAction
  }
};

/**
 * Updates the executive summary in the audit wizard state.
 * @param {AppDispatch} dispatch - Redux dispatch function.
 * @param {string} summary - The new executive summary text.
 * @returns {void}
 */
export const handleSummaryChange = (dispatch: AppDispatch, summary: string) => {
  dispatch(updateNextSteps({ executiveSummary: summary }));
};

/**
 * Updates the next steps fields (statement guidance, owner contact info) in the audit wizard state.
 * @param {AppDispatch} dispatch - Redux dispatch function.
 * @param {Object} updates - The fields to update.
 * @param {string} [updates.statementGuidance] - Statement guidance text.
 * @param {string} [updates.ownerContactPhone] - Owner contact phone.
 * @param {string} [updates.ownerContactEmail] - Owner contact email.
 * @param {string} [updates.ownerContactAddress] - Owner contact address.
 * @returns {void}
 */
export const handleNextStepsUpdate = (
  dispatch: AppDispatch,
  updates: {
    statementGuidance?: string;
    ownerContactPhone?: string;
    ownerContactEmail?: string;
    ownerContactAddress?: string;
  },
) => {
  dispatch(updateNextSteps(updates));
};
