'use client';

import type { AuditRow, SamplePageRow } from '@/services/audit.service';
import type { FC } from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { getCriteriaForScope, SCOPE_LABELS_LONG, STATUS_DISPLAY } from '@/../config/audit.config';
import Button from '@/components/atoms/button/Button';
import ContentCard from '@/components/atoms/content-card/ContentCard';
import Divider from '@/components/atoms/divider/Divider';
import Heading from '@/components/atoms/heading/Heading';
import Icon from '@/components/atoms/icon/Icon';
import LayoutGrid from '@/components/atoms/layout-grid/LayoutGrid';
import Tag from '@/components/atoms/tag/Tag';
import Text from '@/components/atoms/text/Text';
import Wrapper from '@/components/atoms/wrapper/Wrapper';
import AppShell from '@/components/organisms/app-shell/AppShell';
import { useAction } from '@/hooks/api.hooks';
import { updateAuditStatus } from '@/services/audit.service';
import { toMuiColor } from '@/utils/color.util';
import { displayValue, formatDate, humanize } from '@/utils/format.util';

interface AuditDetailContentProps {
  audit: AuditRow | null;
  samplePages: SamplePageRow[];
}

const AuditDetailPageContent: FC<AuditDetailContentProps> = ({ audit: initialAudit, samplePages }) => {
  const router = useRouter();
  const [audit, setAudit] = useState(initialAudit);
  const { action: startAudit, status: startStatus } = useAction(updateAuditStatus);

  if (!audit) {
    return (
      <AppShell>
        <Heading tag="h5" color="text.secondary">
          Audit not found.
        </Heading>
      </AppShell>
    );
  }

  const { id, title, audit_scope, status, audit_type, commissioner, created_at, accessibility_baseline } = audit;
  const criteriaCount = getCriteriaForScope(audit_scope).length;

  return (
    <AppShell>
      <Wrapper sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBlockEnd: 3 }}>
        <Wrapper>
          <Heading tag="h1" size="h4" gutterBottom>
            {title || 'Untitled Audit'}
          </Heading>
          <Wrapper sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Tag label={SCOPE_LABELS_LONG[audit_scope]} color="primary" />
            <Tag label={`${criteriaCount} criteria`} variant="outlined" />
            <Tag label={STATUS_DISPLAY[status].label} color={toMuiColor(STATUS_DISPLAY[status].color)} />
            <Tag label={humanize(audit_type)} variant="outlined" />
          </Wrapper>
        </Wrapper>
        <Wrapper sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Icon name="Scanner" />}
            onClick={() => router.push(`/audits/${id}/automated`)}
          >
            Automated Scan
          </Button>
          <Button
            variant="contained"
            startIcon={<Icon name="Assessment" />}
            onClick={() => router.push(`/audits/${id}/report`)}
          >
            View Report
          </Button>
        </Wrapper>
      </Wrapper>

      <Divider sx={{ marginBlockEnd: 3 }} />

      <LayoutGrid container spacing={3}>
        <LayoutGrid size={{ xs: 12, md: 8 }}>
          <ContentCard sx={{ marginBlockEnd: 3 }}>
            <Heading tag="h2" size="h6" gutterBottom>
              Sample Pages ({samplePages.length})
            </Heading>
            {samplePages.length === 0 ? (
              <Text color="text.secondary">No sample pages added yet.</Text>
            ) : (
              samplePages.map(({ id: pageId, title: pageTitle, url, sample_type, audit_mode, is_tested }) => (
                <Wrapper
                  key={pageId}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBlock: 1.5,
                    borderBlockEnd: '1px solid',
                    borderColor: 'divider',
                    '&:last-child': { borderBlockEnd: 'none' },
                  }}
                >
                  <Wrapper>
                    <Text fontWeight={600}>{pageTitle}</Text>
                    <Text variant="caption" color="text.secondary">
                      {url}
                    </Text>
                  </Wrapper>
                  <Wrapper sx={{ display: 'flex', gap: 1 }}>
                    <Tag label={sample_type} size="small" variant="outlined" />
                    <Tag label={audit_mode} size="small" variant="outlined" />
                    {is_tested ? <Tag label="Tested" size="small" color="success" /> : null}
                  </Wrapper>
                </Wrapper>
              ))
            )}
          </ContentCard>
        </LayoutGrid>

        <LayoutGrid size={{ xs: 12, md: 4 }}>
          <ContentCard sx={{ marginBlockEnd: 3 }}>
            <Heading tag="h2" size="h6" gutterBottom>
              Audit Info
            </Heading>
            <Text variant="body2" color="text.secondary">
              Commissioner
            </Text>
            <Text sx={{ marginBlockEnd: 1.5 }}>{displayValue(commissioner)}</Text>
            <Text variant="body2" color="text.secondary">
              Created
            </Text>
            <Text sx={{ marginBlockEnd: 1.5 }}>{formatDate(created_at)}</Text>
            <Text variant="body2" color="text.secondary">
              Accessibility Baseline
            </Text>
            <Text>{displayValue(accessibility_baseline)}</Text>
          </ContentCard>

          {status === 'draft' && (
            <Button
              variant="contained"
              fullWidth
              disabled={startStatus === 'loading'}
              startIcon={<Icon name="PlayArrow" />}
              onClick={async () => {
                await startAudit(id, 'in_progress');
                setAudit({ ...audit, status: 'in_progress' });
              }}
            >
              {startStatus === 'loading' ? 'Starting...' : 'Start Audit'}
            </Button>
          )}
        </LayoutGrid>
      </LayoutGrid>
    </AppShell>
  );
};

export default AuditDetailPageContent;
