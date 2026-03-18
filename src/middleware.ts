import { type NextRequest } from 'next/server';

import { updateSession } from '@/auth/auth.middleware';

export const middleware = (request: NextRequest) => {
  return updateSession(request);
};

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
