import type { AuditRow, SamplePageRow } from '@/services/audit.service';

import { requireLoggedIn } from '@/auth/auth';
import ErrorAlert from '@/components/atoms/error/Error';
import AppShell from '@/components/organisms/app-shell/AppShell';
import { createClient } from '@/server/api/supabase/server';
import { getAuditById, getSamplePages } from '@/services/audit.service';
import { safeAwait } from '@/utils/server-promises.util';

import AuditDetailPageContent from './_components/AuditDetailPageContent';

interface AuditDetailPageProps {
  readonly params: Promise<{ id: string }>;
}

const AuditDetailPage = async ({ params }: AuditDetailPageProps) => {
  await requireLoggedIn();
  const { id } = await params;
  const supabase = await createClient();
  const [error, result] = await safeAwait(Promise.all([getAuditById(id, supabase), getSamplePages(id, supabase)]));

  if (error) {
    return (
      <AppShell>
        <ErrorAlert error={error} />
      </AppShell>
    );
  }

  const [audit, samplePages] = result as [AuditRow | null, SamplePageRow[]];

  return <AuditDetailPageContent audit={audit} samplePages={samplePages} />;
};

export default AuditDetailPage;
