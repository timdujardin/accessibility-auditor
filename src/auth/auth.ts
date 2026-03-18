'use server';

import 'server-only';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { AUTH_COOKIE_NAME, LOGGED_IN_REDIRECT, NOT_LOGGED_IN_REDIRECT } from './auth.constants';

/**
 * Checks whether the current user is logged in by reading the auth cookie.
 * @returns {Promise<boolean>} True if the auth cookie is present and set to "true".
 */
export const getIsLoggedIn = async (): Promise<boolean> => {
  const cookieStore = await cookies();

  return cookieStore.get(AUTH_COOKIE_NAME)?.value === 'true';
};

/**
 * Server-side guard that redirects to the login page if the user is not authenticated.
 * @returns {Promise<void>} Resolves if the user is logged in, otherwise redirects.
 */
export const requireLoggedIn = async (): Promise<void> => {
  const isLoggedIn = await getIsLoggedIn();
  if (!isLoggedIn) {
    redirect(NOT_LOGGED_IN_REDIRECT);
  }
};

/**
 * Server-side guard that redirects to the dashboard if the user is already authenticated.
 * @returns {Promise<void>} Resolves if the user is anonymous, otherwise redirects.
 */
export const requireAnonymous = async (): Promise<void> => {
  const isLoggedIn = await getIsLoggedIn();
  if (isLoggedIn) {
    redirect(LOGGED_IN_REDIRECT);
  }
};
