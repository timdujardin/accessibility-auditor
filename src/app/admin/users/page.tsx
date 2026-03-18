'use client';

import type { FC } from 'react';

import ContentCard from '@/components/atoms/content-card/ContentCard';
import Heading from '@/components/atoms/heading/Heading';
import Icon from '@/components/atoms/icon/Icon';
import Text from '@/components/atoms/text/Text';
import Wrapper from '@/components/atoms/wrapper/Wrapper';
import AppShell from '@/components/organisms/app-shell/AppShell';
import { useAuth } from '@/contexts/AuthContext';

const UserManagementPage: FC = () => {
  const { user: currentUser } = useAuth();

  if (currentUser?.role !== 'admin') {
    return (
      <AppShell>
        <Heading tag="h5" color="error">
          Access denied. Admin role required.
        </Heading>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Wrapper sx={{ marginBlockEnd: 3 }}>
        <Heading tag="h1" size="h4" gutterBottom>
          User Management
        </Heading>
        <Text variant="body1" color="text.secondary">
          Manage auditor accounts and assign roles.
        </Text>
      </Wrapper>

      <ContentCard
        contentSx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBlock: 6, gap: 2 }}
      >
        <Icon name="People" sx={{ fontSize: 48, color: 'text.secondary' }} />
        <Heading tag="h6" color="text.secondary">
          User management will be available when Supabase is configured
        </Heading>
        <Text variant="body2" color="text.secondary" sx={{ textAlign: 'center', maxInlineSize: 400 }}>
          Full user management with invitations, role assignment, and account administration will be enabled once
          Supabase authentication is integrated.
        </Text>
      </ContentCard>
    </AppShell>
  );
};

export default UserManagementPage;
