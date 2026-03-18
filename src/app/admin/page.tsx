'use client';

import type { AuditScope, AuditStatus } from '@/@types/audit';
import type { AuditListRow } from '@/hooks/tables/auditList.table';
import type { FC } from 'react';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';

import { SCOPE_LABELS_SHORT, STATUS_DISPLAY } from '@/../config/audit.config';
import ContentCard from '@/components/atoms/content-card/ContentCard';
import DonutChart from '@/components/atoms/donut-chart/DonutChart';
import Heading from '@/components/atoms/heading/Heading';
import LayoutGrid from '@/components/atoms/layout-grid/LayoutGrid';
import Spinner from '@/components/atoms/spinner/Spinner';
import StatCard from '@/components/atoms/stat-card/StatCard';
import Text from '@/components/atoms/text/Text';
import Wrapper from '@/components/atoms/wrapper/Wrapper';
import DataTable from '@/components/molecules/data-table/DataTable';
import AppShell from '@/components/organisms/app-shell/AppShell';
import { useAuth } from '@/contexts/AuthContext';
import { useAudits } from '@/hooks/audit.hooks';
import { useAuditListTable } from '@/hooks/tables/auditList.table';
import { SEMANTIC_COLORS } from '@/utils/color.util';

import { SCOPE_COLORS } from './page.constants';

const AdminPage: FC = () => {
  const { user } = useAuth();
  const { audits, isLoading } = useAudits(user?.id ?? null, true);
  const router = useRouter();
  const auditTable = useAuditListTable(audits as AuditListRow[], { showCreated: true, useStatusBadge: true });

  const stats = useMemo(() => {
    const byStatus: Record<string, number> = { draft: 0, in_progress: 0, completed: 0 };
    const byScope: Record<string, number> = {};

    for (const audit of audits) {
      byStatus[audit.status] = (byStatus[audit.status] ?? 0) + 1;
      const scopeLabel = SCOPE_LABELS_SHORT[audit.audit_scope as AuditScope];
      byScope[scopeLabel] = (byScope[scopeLabel] ?? 0) + 1;
    }

    return { byStatus, byScope };
  }, [audits]);

  if (isLoading) {
    return (
      <AppShell>
        <Wrapper sx={{ display: 'flex', justifyContent: 'center', paddingBlockStart: 8 }}>
          <Spinner />
        </Wrapper>
      </AppShell>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <AppShell>
        <Heading tag="h5" color="error">
          Access denied. Admin role required.
        </Heading>
      </AppShell>
    );
  }

  const statusPieData = Object.entries(stats.byStatus)
    .filter(([, count]) => count > 0)
    .map(([status, count]) => ({
      id: status,
      value: count,
      label: STATUS_DISPLAY[status as AuditStatus].label,
      color: SEMANTIC_COLORS[STATUS_DISPLAY[status as AuditStatus].color],
    }));

  const scopePieData = Object.entries(stats.byScope)
    .filter(([, count]) => count > 0)
    .map(([scope, count], i) => ({
      id: scope,
      value: count,
      label: scope,
      color: SEMANTIC_COLORS[SCOPE_COLORS[i % SCOPE_COLORS.length]],
    }));

  return (
    <AppShell>
      <Heading tag="h1" size="h4" gutterBottom>
        Admin Overview
      </Heading>
      <Text variant="body1" color="text.secondary" sx={{ marginBlockEnd: 3 }}>
        Organization-wide audit statistics and management.
      </Text>

      <LayoutGrid container spacing={3} sx={{ marginBlockEnd: 3 }}>
        <LayoutGrid size={{ xs: 6, md: 3 }}>
          <StatCard value={audits.length} label="Total Audits" color="primary.main" />
        </LayoutGrid>
        <LayoutGrid size={{ xs: 6, md: 3 }}>
          <StatCard value={stats.byStatus.completed} label="Completed" color="success.main" />
        </LayoutGrid>
        <LayoutGrid size={{ xs: 6, md: 3 }}>
          <StatCard value={stats.byStatus.in_progress} label="In Progress" color="warning.main" />
        </LayoutGrid>
        <LayoutGrid size={{ xs: 6, md: 3 }}>
          <StatCard value={stats.byStatus.draft} label="Drafts" />
        </LayoutGrid>
      </LayoutGrid>

      <LayoutGrid container spacing={3} sx={{ marginBlockEnd: 3 }}>
        {statusPieData.length > 0 && (
          <LayoutGrid size={{ xs: 12, md: 6 }}>
            <ContentCard>
              <Text variant="subtitle2" fontWeight={600} sx={{ marginBlockEnd: 1 }}>
                Audits by Status
              </Text>
              <DonutChart data={statusPieData} height={220} />
            </ContentCard>
          </LayoutGrid>
        )}
        {scopePieData.length > 0 && (
          <LayoutGrid size={{ xs: 12, md: 6 }}>
            <ContentCard>
              <Text variant="subtitle2" fontWeight={600} sx={{ marginBlockEnd: 1 }}>
                Audits by Scope
              </Text>
              <DonutChart data={scopePieData} height={220} />
            </ContentCard>
          </LayoutGrid>
        )}
      </LayoutGrid>

      <ContentCard>
        <Text variant="subtitle2" fontWeight={600} sx={{ marginBlockEnd: 1 }}>
          All Audits
        </Text>
        <DataTable
          table={auditTable}
          size="small"
          onRowClick={(row) => router.push(`/audits/${row.id}`)}
          emptyMessage="No audits found."
        />
      </ContentCard>
    </AppShell>
  );
};

export default AdminPage;
