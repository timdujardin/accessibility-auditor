import type { AuditListRow } from '@/services/audit.service';

import { requireLoggedIn } from '@/auth/auth';
import ErrorAlert from '@/components/atoms/error/Error';
import AppShell from '@/components/organisms/app-shell/AppShell';
import { createClient } from '@/server/api/supabase/server';
import { getRecentAudits } from '@/services/audit.service';
import { safeAwait } from '@/utils/server-promises.util';

import DashboardPageContent from './_components/DashboardPageContent';

const DashboardPage = async () => {
  await requireLoggedIn();
  const supabase = await createClient();
  const [error, audits] = await safeAwait(getRecentAudits(supabase));

  if (error) {
    return (
      <AppShell>
        <ErrorAlert error={error} />
      </AppShell>
    );
  }

  return <DashboardPageContent audits={audits as AuditListRow[]} />;
};

export default DashboardPage;
