import type { Metadata } from 'next';
import type { FC, ReactNode } from 'react';

import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import StoreProvider from '@/redux/providers/store-provider';

import './globals.css';

export const metadata: Metadata = {
  title: 'Accessibility Auditor — WCAG-EM 2.0',
  description:
    'WCAG-EM 2.0 based accessibility auditing tool with automated testing, reporting, and dashboard generation.',
};

const RootLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <StoreProvider>
            <ThemeProvider>
              <AuthProvider>{children}</AuthProvider>
            </ThemeProvider>
          </StoreProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
};

export default RootLayout;
