'use client';

import type { AuditListRow } from '@/hooks/tables/auditList.table';
import type { FC } from 'react';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useDebounce } from 'react-use';

import Button from '@/components/atoms/button/Button';
import Heading from '@/components/atoms/heading/Heading';
import Icon from '@/components/atoms/icon/Icon';
import { SelectFormControl, SelectInput, SelectLabel, SelectOption } from '@/components/atoms/select-input/SelectInput';
import TextInput from '@/components/atoms/text-input/TextInput';
import Wrapper from '@/components/atoms/wrapper/Wrapper';
import DataTable from '@/components/molecules/data-table/DataTable';
import AppShell from '@/components/organisms/app-shell/AppShell';
import { useAuditListTable } from '@/hooks/tables/auditList.table';

interface AuditsContentProps {
  audits: AuditListRow[];
}

const AuditsPageContent: FC<AuditsContentProps> = ({ audits }) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const router = useRouter();

  useDebounce(() => setDebouncedQuery(searchQuery), 300, [searchQuery]);

  const filteredAudits = audits.filter((audit) => {
    const matchesStatus = statusFilter === 'all' || audit.status === statusFilter;
    const matchesSearch =
      !debouncedQuery ||
      audit.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
      audit.commissioner.toLowerCase().includes(debouncedQuery.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  const auditTable = useAuditListTable(filteredAudits as AuditListRow[], { showType: true });

  return (
    <AppShell>
      <Wrapper sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBlockEnd: 3 }}>
        <Heading tag="h1" size="h4">
          Audits
        </Heading>
        <Button
          variant="contained"
          startIcon={<Icon name="AddCircleOutline" />}
          onClick={() => router.push('/audits/new')}
        >
          New Audit
        </Button>
      </Wrapper>

      <Wrapper sx={{ display: 'flex', gap: 2, marginBlockEnd: 3 }}>
        <TextInput
          label="Search"
          size="small"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title or commissioner..."
          sx={{ flexGrow: 1, maxInlineSize: 400 }}
        />
        <SelectFormControl size="small" sx={{ minInlineSize: 150 }}>
          <SelectLabel>Status</SelectLabel>
          <SelectInput value={statusFilter} label="Status" onChange={(e) => setStatusFilter(e.target.value)}>
            <SelectOption value="all">All</SelectOption>
            <SelectOption value="draft">Draft</SelectOption>
            <SelectOption value="in_progress">In Progress</SelectOption>
            <SelectOption value="completed">Completed</SelectOption>
          </SelectInput>
        </SelectFormControl>
      </Wrapper>

      <DataTable
        table={auditTable}
        onRowClick={(row) => router.push(`/audits/${row.id}`)}
        emptyMessage={audits.length === 0 ? 'No audits yet.' : 'No audits match your filters.'}
      />
    </AppShell>
  );
};

export default AuditsPageContent;
