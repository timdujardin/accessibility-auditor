'use client';

import type { FC } from 'react';

import { useCallback, useMemo } from 'react';

import type { AuditScopeFormValues } from './step-audit-scope.schema';

import Accordion from '@/components/atoms/accordion/Accordion';
import Alert from '@/components/atoms/alert/Alert';
import FormTextField from '@/components/atoms/form-text-field/FormTextField';
import Form from '@/components/atoms/form/Form';
import Heading from '@/components/atoms/heading/Heading';
import Icon from '@/components/atoms/icon/Icon';
import LayoutGrid from '@/components/atoms/layout-grid/LayoutGrid';
import Text from '@/components/atoms/text/Text';
import Wrapper from '@/components/atoms/wrapper/Wrapper';
import AuditScopeCard from '@/components/molecules/audit-scope-card/AuditScopeCard';
import AuditTypeCard from '@/components/molecules/audit-type-card/AuditTypeCard';
import { updateAuditInfo } from '@/redux/slices/audit';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { getAdvancedScopes, getRegularScopes } from '@/utils/auditScope.util';

import { AUDIT_TYPE_OPTIONS } from './step-audit-scope.constants';
import { auditScopeResolver } from './step-audit-scope.schema';

const StepAuditScope: FC = () => {
  const dispatch = useAppDispatch();
  const title = useAppSelector((s) => s.audit.title);
  const commissioner = useAppSelector((s) => s.audit.commissioner);
  const auditType = useAppSelector((s) => s.audit.auditType);
  const auditScope = useAppSelector((s) => s.audit.auditScope);
  const accessibilityBaseline = useAppSelector((s) => s.audit.accessibilityBaseline);

  const formSettings = useMemo(
    () => ({
      resolver: auditScopeResolver,
      values: { title, commissioner, auditType, auditScope, accessibilityBaseline },
    }),
    [title, commissioner, auditType, auditScope, accessibilityBaseline],
  );

  const handleChange = useCallback(
    (data: AuditScopeFormValues) => {
      dispatch(updateAuditInfo(data));
    },
    [dispatch],
  );

  const regularScopes = getRegularScopes();
  const advancedScopes = getAdvancedScopes();

  return (
    <Wrapper>
      <Heading tag="h2" size="h6" gutterBottom>
        Audit Details
      </Heading>

      <Form<AuditScopeFormValues> onChange={handleChange} formSettings={formSettings}>
        <LayoutGrid container spacing={2} sx={{ marginBlockEnd: 4 }}>
          <LayoutGrid size={{ xs: 12, sm: 6 }}>
            <FormTextField<AuditScopeFormValues>
              name="title"
              label="Audit Title"
              fullWidth
              required
              placeholder="e.g., Example Corp Website Audit 2026"
            />
          </LayoutGrid>
          <LayoutGrid size={{ xs: 12, sm: 6 }}>
            <FormTextField<AuditScopeFormValues>
              name="commissioner"
              label="Commissioner"
              fullWidth
              placeholder="e.g., Example Corp"
            />
          </LayoutGrid>
        </LayoutGrid>
      </Form>

      <Heading tag="h2" size="h6" gutterBottom>
        Audit Type
      </Heading>

      <LayoutGrid container spacing={2} sx={{ marginBlockEnd: 4 }}>
        {AUDIT_TYPE_OPTIONS.map((option) => (
          <LayoutGrid size={{ xs: 12, sm: 6, md: 3 }} key={option.value}>
            <AuditTypeCard
              value={option.value}
              label={option.label}
              description={option.description}
              iconKey={option.icon}
              selected={auditType === option.value}
              onSelect={() => dispatch(updateAuditInfo({ auditType: option.value }))}
            />
          </LayoutGrid>
        ))}
      </LayoutGrid>

      <Heading tag="h2" size="h6" gutterBottom>
        Audit Scope
      </Heading>

      <LayoutGrid container spacing={2} sx={{ marginBlockEnd: 2 }}>
        {regularScopes.map((option) => (
          <LayoutGrid size={{ xs: 12, md: 4 }} key={option.value}>
            <AuditScopeCard
              value={option.value}
              label={option.label}
              description={option.description}
              criteriaCount={option.criteriaCount}
              coveragePercent={option.coveragePercent}
              selected={auditScope === option.value}
              onSelect={() => dispatch(updateAuditInfo({ auditScope: option.value }))}
            />
          </LayoutGrid>
        ))}
      </LayoutGrid>

      {auditScope === 'quick' && (
        <Alert severity="warning" icon={<Icon name="WarningAmber" />} sx={{ marginBlockEnd: 2 }}>
          Quick audits should not be used to guide customers towards compliance. They are merely used to give a very
          quick indication. For compliance or accessibility reporting, use a Typical or Full audit.
        </Alert>
      )}

      {advancedScopes.length > 0 && (
        <Accordion
          summary={
            <Text variant="body2" color="text.secondary">
              Advanced — Show AAA options (rarely needed)
            </Text>
          }
          sx={{ marginBlockEnd: 4 }}
        >
          <LayoutGrid container spacing={2}>
            {advancedScopes.map((option) => (
              <LayoutGrid size={{ xs: 12, md: 4 }} key={option.value}>
                <AuditScopeCard
                  value={option.value}
                  label={option.label}
                  description={option.description}
                  criteriaCount={option.criteriaCount}
                  selected={auditScope === option.value}
                  isAdvanced
                  onSelect={() => dispatch(updateAuditInfo({ auditScope: option.value }))}
                />
              </LayoutGrid>
            ))}
          </LayoutGrid>
        </Accordion>
      )}

      <Heading tag="h2" size="h6" gutterBottom>
        Accessibility Support Baseline
      </Heading>
      <Form<AuditScopeFormValues> onChange={handleChange} formSettings={formSettings}>
        <FormTextField<AuditScopeFormValues>
          name="accessibilityBaseline"
          fullWidth
          multiline
          rows={3}
          placeholder="e.g., Chrome + NVDA, Firefox + NVDA, Safari + VoiceOver, Edge + JAWS"
          helperText="Define the browsers, assistive technologies, and devices the product is expected to work with."
        />
      </Form>
    </Wrapper>
  );
};

export default StepAuditScope;
