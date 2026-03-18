'use client';

import type { FC } from 'react';

import { useParams } from 'next/navigation';

import Heading from '@/components/atoms/heading/Heading';
import Spinner from '@/components/atoms/spinner/Spinner';
import Wrapper from '@/components/atoms/wrapper/Wrapper';
import AppShell from '@/components/organisms/app-shell/AppShell';
import StepAutomatedScan from '@/components/organisms/wizard/step-automated-scan/StepAutomatedScan';
import { useAudit } from '@/hooks/audit.hooks';

const AutomatedScanPage: FC = () => {
  const { id } = useParams<{ id: string }>();
  const { audit, samplePages, isLoading } = useAudit(id);

  if (isLoading) {
    return (
      <AppShell>
        <Wrapper sx={{ display: 'flex', justifyContent: 'center', paddingBlockStart: 8 }}>
          <Spinner />
        </Wrapper>
      </AppShell>
    );
  }

  if (!audit) {
    return (
      <AppShell>
        <Heading tag="h5" color="text.secondary">
          Audit not found.
        </Heading>
      </AppShell>
    );
  }

  const pages = samplePages.map((p) => ({
    id: p.id,
    title: p.title,
    url: p.url,
    auditMode: p.audit_mode,
  }));

  return (
    <AppShell>
      <Heading tag="h1" size="h4" gutterBottom>
        Automated Scan — {audit.title}
      </Heading>
      <StepAutomatedScan auditId={id} auditScope={audit.audit_scope} samplePages={pages} />
    </AppShell>
  );
};

export default AutomatedScanPage;
