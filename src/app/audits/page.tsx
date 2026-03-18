import type { AuditListRow } from '@/services/audit.service';

import { requireLoggedIn } from '@/auth/auth';
import ErrorAlert from '@/components/atoms/error/Error';
import AppShell from '@/components/organisms/app-shell/AppShell';
import { createClient } from '@/server/api/supabase/server';
import { getAllAudits } from '@/services/audit.service';
import { safeAwait } from '@/utils/server-promises.util';

import AuditsPageContent from './_components/AuditsPageContent';

const AuditsPage = async () => {
  await requireLoggedIn();
  const supabase = await createClient();
  const [error, audits] = await safeAwait(getAllAudits(supabase));

  if (error) {
    return (
      <AppShell>
        <ErrorAlert error={error} />
      </AppShell>
    );
  }

  return <AuditsPageContent audits={audits as AuditListRow[]} />;
};

export default AuditsPage;
