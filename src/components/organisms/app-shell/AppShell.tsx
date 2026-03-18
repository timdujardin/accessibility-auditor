'use client';

import type { FC, ReactNode } from 'react';

import { usePathname, useRouter } from 'next/navigation';

import { useToggle } from 'react-use';

import AppBar from '@/components/atoms/app-bar/AppBar';
import Drawer from '@/components/atoms/drawer/Drawer';
import Heading from '@/components/atoms/heading/Heading';
import IconButton from '@/components/atoms/icon-button/IconButton';
import Icon from '@/components/atoms/icon/Icon';
import Toolbar from '@/components/atoms/toolbar/Toolbar';
import Wrapper from '@/components/atoms/wrapper/Wrapper';
import NavDrawer from '@/components/molecules/nav-drawer/NavDrawer';
import UserProfileCard from '@/components/molecules/user-profile-card/UserProfileCard';
import { useAuth } from '@/contexts/AuthContext';

import { DRAWER_WIDTH } from './app-shell.constants';

const AppShell: FC<{ children: ReactNode }> = ({ children }) => {
  const [mobileOpen, toggleMobileOpen] = useToggle(false);
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isAdmin = user?.role === 'admin';

  const userProfile = (
    <UserProfileCard fullName={user?.fullName} email={user?.email} isAdmin={isAdmin} onSignOut={signOut} />
  );

  const drawerContent = (
    <NavDrawer
      pathname={pathname}
      onNavigate={(path) => {
        router.push(path);
        toggleMobileOpen(false);
      }}
      isAdmin={isAdmin}
      userProfile={userProfile}
    />
  );

  return (
    <Wrapper sx={{ display: 'flex', minBlockSize: '100vh' }}>
      <AppBar
        position="fixed"
        sx={{
          inlineSize: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          marginInlineStart: { sm: `${DRAWER_WIDTH}px` },
          display: { sm: 'none' },
        }}
      >
        <Toolbar>
          <IconButton color="inherit" aria-label="open navigation menu" edge="start" onClick={() => toggleMobileOpen()}>
            <Icon name="Menu" />
          </IconButton>
          <Heading tag="h6" noWrap>
            Accessibility Auditor
          </Heading>
        </Toolbar>
      </AppBar>

      <Wrapper
        component="nav"
        sx={{ inlineSize: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
        aria-label="main navigation"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => toggleMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', inlineSize: DRAWER_WIDTH },
          }}
        >
          {drawerContent}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', inlineSize: DRAWER_WIDTH },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Wrapper>

      <Wrapper
        component="main"
        sx={{
          flexGrow: 1,
          padding: 3,
          inlineSize: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          marginBlockStart: { xs: '64px', sm: 0 },
          backgroundColor: 'background.default',
          minBlockSize: '100vh',
        }}
      >
        {children}
      </Wrapper>
    </Wrapper>
  );
};

export default AppShell;
