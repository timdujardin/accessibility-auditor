'use client';

import type { FC } from 'react';

import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';

import Alert from '@/components/atoms/alert/Alert';
import Button from '@/components/atoms/button/Button';
import Heading from '@/components/atoms/heading/Heading';
import Stepper from '@/components/atoms/stepper/Stepper';
import Text from '@/components/atoms/text/Text';
import Toast from '@/components/atoms/toast/Toast';
import Wrapper from '@/components/atoms/wrapper/Wrapper';
import AppShell from '@/components/organisms/app-shell/AppShell';
import StepAuditScope from '@/components/organisms/wizard/step-audit-scope/StepAuditScope';
import StepAuditorSummary from '@/components/organisms/wizard/step-auditor-summary/StepAuditorSummary';
import StepAutomatedScan from '@/components/organisms/wizard/step-automated-scan/StepAutomatedScan';
import StepDashboard from '@/components/organisms/wizard/step-dashboard/StepDashboard';
import StepManualReporting from '@/components/organisms/wizard/step-manual-reporting/StepManualReporting';
import StepNextSteps from '@/components/organisms/wizard/step-next-steps/StepNextSteps';
import StepSamplePages from '@/components/organisms/wizard/step-sample-pages/StepSamplePages';
import StepTechnologies from '@/components/organisms/wizard/step-technologies/StepTechnologies';
import { useAuth } from '@/contexts/AuthContext';
import { useAction } from '@/hooks/api.hooks';
import {
  nextStep,
  prefillScanFindings,
  previousStep,
  resetAudit,
  selectApprovedViolationKeys,
  setSavedAuditId,
} from '@/redux/slices/audit';
import { selectActiveCriteria } from '@/redux/slices/criteria';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { publishAudit } from '@/utils/publishAudit.util';

import { handleNextStepsUpdate, handlePublish, handleSummaryChange } from './page.callbacks';
import { WIZARD_STEPS } from './page.constants';

const NewAuditPage: FC = () => {
  const dispatch = useAppDispatch();
  const activeStep = useAppSelector((s) => s.audit.activeStep);
  const savedAuditId = useAppSelector((s) => s.audit.savedAuditId);
  const title = useAppSelector((s) => s.audit.title);
  const auditScope = useAppSelector((s) => s.audit.auditScope);
  const executiveSummary = useAppSelector((s) => s.audit.executiveSummary);
  const statementGuidance = useAppSelector((s) => s.audit.statementGuidance);
  const ownerContactPhone = useAppSelector((s) => s.audit.ownerContactPhone);
  const ownerContactEmail = useAppSelector((s) => s.audit.ownerContactEmail);
  const ownerContactAddress = useAppSelector((s) => s.audit.ownerContactAddress);
  const samplePages = useAppSelector((s) => s.audit.samplePages);
  const auditState = useAppSelector((s) => s.audit);
  const activeCriteria = useAppSelector(selectActiveCriteria);
  const approvedViolationKeys = useAppSelector(selectApprovedViolationKeys);

  const { user } = useAuth();
  const router = useRouter();
  const { action: doPublish, status: publishStatus, error: publishError } = useAction(publishAudit);
  const isPublishing = publishStatus === 'loading';

  const reduxPages = useMemo(
    () => samplePages.map((p) => ({ id: p.id, title: p.title, url: p.url, auditMode: p.auditMode })),
    [samplePages],
  );

  const onPublish = useCallback(() => handlePublish(user, auditState, doPublish), [user, auditState, doPublish]);

  const handleNext = () => {
    if (activeStep === 2 && !savedAuditId) {
      dispatch(setSavedAuditId(crypto.randomUUID()));
    }

    if (activeStep === 3 && approvedViolationKeys.length > 0) {
      dispatch(prefillScanFindings());
    }

    if (activeStep === 7) {
      router.push('/dashboard');
      dispatch(resetAudit());
      return;
    }

    dispatch(nextStep());
  };

  const handleBack = () => {
    dispatch(previousStep());
  };

  const onSummaryChange = useCallback((summary: string) => handleSummaryChange(dispatch, summary), [dispatch]);

  const onNextStepsUpdate = useCallback(
    (updates: Parameters<typeof handleNextStepsUpdate>[1]) => handleNextStepsUpdate(dispatch, updates),
    [dispatch],
  );

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <StepAuditScope />;
      case 1:
        return <StepSamplePages />;
      case 2:
        return <StepTechnologies />;
      case 3:
        return <StepAutomatedScan auditId={savedAuditId ?? ''} auditScope={auditScope} samplePages={reduxPages} />;
      case 4:
        return <StepManualReporting samplePages={reduxPages} activeCriteria={activeCriteria} />;
      case 5:
        return (
          <StepAuditorSummary
            auditTitle={title}
            auditScope={auditScope}
            executiveSummary={executiveSummary}
            onSummaryChange={onSummaryChange}
          />
        );
      case 6:
        return (
          <StepDashboard
            auditScope={auditScope}
            samplePages={reduxPages}
            onPublish={onPublish}
            isPublishing={isPublishing}
          />
        );
      case 7:
        return (
          <StepNextSteps
            statementGuidance={statementGuidance}
            ownerContactPhone={ownerContactPhone}
            ownerContactEmail={ownerContactEmail}
            ownerContactAddress={ownerContactAddress}
            onUpdate={onNextStepsUpdate}
          />
        );
      default:
        return null;
    }
  };

  const isLastStep = activeStep === WIZARD_STEPS.length - 1;
  const isSaveStep = activeStep === 2 && !savedAuditId;

  const getNextButtonLabel = (): string => {
    if (isLastStep) {
      return 'Complete Audit';
    }
    if (isSaveStep) {
      return 'Save & Continue';
    }

    return 'Next';
  };

  return (
    <AppShell>
      <Wrapper sx={{ marginBlockEnd: 4 }}>
        <Heading tag="h1" size="h4" gutterBottom>
          New Accessibility Audit
        </Heading>
        <Text variant="body1" color="text.secondary">
          Follow the WCAG-EM 2.0 methodology to set up your audit.
        </Text>
      </Wrapper>

      <Stepper steps={WIZARD_STEPS} activeStep={activeStep} sx={{ marginBlockEnd: 4 }} />

      <Wrapper sx={{ marginBlockEnd: 4 }}>{renderStepContent()}</Wrapper>

      <Wrapper sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined">
          Back
        </Button>
        <Button onClick={handleNext} variant="contained">
          {getNextButtonLabel()}
        </Button>
      </Wrapper>

      <Toast
        open={publishStatus === 'succeeded' || publishStatus === 'failed'}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={publishStatus === 'succeeded' ? 'success' : 'error'} variant="filled">
          {publishStatus === 'succeeded'
            ? 'Audit published successfully'
            : (publishError?.message ?? 'Failed to publish audit')}
        </Alert>
      </Toast>
    </AppShell>
  );
};

export default NewAuditPage;
