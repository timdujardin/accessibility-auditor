'use client';

import type { AuditListRow } from '@/hooks/tables/auditList.table';
import type { FC } from 'react';

import { useRouter } from 'next/navigation';

import Button from '@/components/atoms/button/Button';
import ContentCard from '@/components/atoms/content-card/ContentCard';
import Heading from '@/components/atoms/heading/Heading';
import Icon from '@/components/atoms/icon/Icon';
import LayoutGrid from '@/components/atoms/layout-grid/LayoutGrid';
import StatCard from '@/components/atoms/stat-card/StatCard';
import Text from '@/components/atoms/text/Text';
import Wrapper from '@/components/atoms/wrapper/Wrapper';
import DataTable from '@/components/molecules/data-table/DataTable';
import AppShell from '@/components/organisms/app-shell/AppShell';
import { useAuth } from '@/contexts/AuthContext';
import { useAuditListTable } from '@/hooks/tables/auditList.table';

interface DashboardContentProps {
  audits: AuditListRow[];
}

const DashboardPageContent: FC<DashboardContentProps> = ({ audits }) => {
  const { user } = useAuth();
  const router = useRouter();
  const auditTable = useAuditListTable(audits, {});

  const draftCount = audits.filter((a) => a.status === 'draft').length;
  const inProgressCount = audits.filter((a) => a.status === 'in_progress').length;
  const completedCount = audits.filter((a) => a.status === 'completed').length;

  return (
    <AppShell>
      <Wrapper sx={{ marginBlockEnd: 4 }}>
        <Heading tag="h1" size="h4" gutterBottom>
          Welcome, {user?.fullName || 'Auditor'}
        </Heading>
        <Text variant="body1" color="text.secondary">
          Your accessibility audit overview
        </Text>
      </Wrapper>

      <LayoutGrid container spacing={3} sx={{ marginBlockEnd: 4 }}>
        <LayoutGrid size={{ xs: 12, sm: 4 }}>
          <StatCard
            value={audits.length}
            label="Total Audits"
            color="primary.main"
            icon={<Icon name="Assessment" color="primary" sx={{ fontSize: 40 }} />}
          />
        </LayoutGrid>
        <LayoutGrid size={{ xs: 12, sm: 4 }}>
          <StatCard
            value={draftCount + inProgressCount}
            label="In Progress"
            color="warning.main"
            icon={<Icon name="PendingActions" color="warning" sx={{ fontSize: 40 }} />}
          />
        </LayoutGrid>
        <LayoutGrid size={{ xs: 12, sm: 4 }}>
          <StatCard
            value={completedCount}
            label="Completed"
            color="success.main"
            icon={<Icon name="CheckCircle" color="success" sx={{ fontSize: 40 }} />}
          />
        </LayoutGrid>
      </LayoutGrid>

      <Wrapper sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBlockEnd: 2 }}>
        <Heading tag="h2" size="h6">
          Recent Audits
        </Heading>
        <Button
          variant="contained"
          startIcon={<Icon name="AddCircleOutline" />}
          onClick={() => router.push('/audits/new')}
        >
          New Audit
        </Button>
      </Wrapper>

      {audits.length === 0 ? (
        <ContentCard contentSx={{ textAlign: 'center', paddingBlock: 6 }}>
          <Heading tag="h6" color="text.secondary" gutterBottom>
            No audits yet
          </Heading>
          <Text variant="body2" color="text.secondary" sx={{ marginBlockEnd: 2 }}>
            Start your first accessibility audit to see it here.
          </Text>
          <Button
            variant="contained"
            startIcon={<Icon name="AddCircleOutline" />}
            onClick={() => router.push('/audits/new')}
          >
            Create Your First Audit
          </Button>
        </ContentCard>
      ) : (
        <DataTable table={auditTable} onRowClick={(row) => router.push(`/audits/${row.id}`)} />
      )}
    </AppShell>
  );
};

export default DashboardPageContent;
