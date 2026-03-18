import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';

import { AUTH_COOKIE_NAME, LOGGED_IN_REDIRECT, NOT_LOGGED_IN_REDIRECT } from './auth.constants';

/**
 * Middleware handler that protects routes based on the auth cookie.
 * Redirects unauthenticated users to the login page and authenticated users away from /login.
 * @param {NextRequest} request - The incoming Next.js request.
 * @returns {NextResponse} A redirect or pass-through response.
 */
export const updateSession = (request: NextRequest): NextResponse => {
  const { pathname } = request.nextUrl;
  const isLoggedIn = request.cookies.get(AUTH_COOKIE_NAME)?.value === 'true';
  const isLoginPage = pathname === NOT_LOGGED_IN_REDIRECT;

  if (!isLoggedIn && !isLoginPage) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = NOT_LOGGED_IN_REDIRECT;
    return NextResponse.redirect(loginUrl);
  }

  if (isLoggedIn && isLoginPage) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = LOGGED_IN_REDIRECT;
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next({ request });
};
