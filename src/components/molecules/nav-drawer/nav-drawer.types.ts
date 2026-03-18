import type { ReactNode } from 'react';

export interface NavDrawerProps {
  pathname: string;
  onNavigate: (path: string) => void;
  isAdmin: boolean;
  userProfile: ReactNode;
}
