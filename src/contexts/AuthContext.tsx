'use client';

import type { User, UserRole } from '@/@types/user';
import type { ReactNode } from 'react';

import { createContext, useCallback, useContext, useMemo, useState, useSyncExternalStore } from 'react';

import { AUTH_COOKIE_NAME } from '@/auth/auth.constants';

const FAKE_ADMIN_USER: User = {
  id: 'fake-admin-id',
  email: 'admin@accessibility-auditor.local',
  fullName: 'Admin',
  organization: 'Accessibility Auditor',
  role: 'admin' as UserRole,
  createdAt: new Date().toISOString(),
};

const LOCAL_STORAGE_KEY = 'aa_fake_auth';

const subscribe = (onStoreChange: () => void) => {
  window.addEventListener('storage', onStoreChange);
  return () => window.removeEventListener('storage', onStoreChange);
};

const getSnapshot = (): boolean => {
  try {
    return localStorage.getItem(LOCAL_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

const getServerSnapshot = (): boolean => false;

interface AuthContextValue {
  user: User | null;
  error: string | null;
  isSubmitting: boolean;
  signIn: (username: string, password: string) => Promise<boolean>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    organization: string,
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: Readonly<{ children: ReactNode }>) => {
  const isLoggedIn = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const user: User | null = isLoggedIn ? FAKE_ADMIN_USER : null;

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const signIn = useCallback(async (username: string, password: string) => {
    setError(null);
    setIsSubmitting(true);
    try {
      if (username === 'admin' && password === 'admin') {
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
        } catch {
          /* localStorage unavailable */
        }
        window.dispatchEvent(new StorageEvent('storage'));
        document.cookie = `${AUTH_COOKIE_NAME}=true; path=/; SameSite=Lax`;
        return true;
      }

      setError('Invalid username or password');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const signUp = useCallback(async (_email: string, _password: string, _fullName: string, _organization: string) => {
    return { error: 'Sign up is disabled' };
  }, []);

  const signOut = useCallback(async () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch {
      /* localStorage unavailable */
    }
    window.dispatchEvent(new StorageEvent('storage'));
    document.cookie = `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }, []);

  const value = useMemo(
    () => ({ user, error, isSubmitting, signIn, signUp, signOut }),
    [user, error, isSubmitting, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
