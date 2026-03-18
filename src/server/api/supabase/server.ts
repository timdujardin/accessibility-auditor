import type { SupabaseClient } from '@supabase/supabase-js';

import { cookies } from 'next/headers';

import { createServerClient } from '@supabase/ssr';

const createEmptyDbResult = (): {
  single: () => Promise<{ data: null; error: null }>;
  order: () => { limit: () => Promise<{ data: never[]; error: null }> };
} => {
  return {
    single: () => Promise.resolve({ data: null, error: null }),
    order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }),
  };
};

const createSelectChain = (): {
  eq: () => ReturnType<typeof createEmptyDbResult>;
  order: () => { limit: () => Promise<{ data: never[]; error: null }> };
} => {
  return {
    eq: () => createEmptyDbResult(),
    order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }),
  };
};

const createInsertChain = (): { select: () => { single: () => Promise<{ data: null; error: null }> } } => {
  return {
    select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }),
  };
};

const createUpdateOrDeleteChain = (): { eq: () => Promise<{ data: null; error: null }> } => {
  return {
    eq: () => Promise.resolve({ data: null, error: null }),
  };
};

const createAuthMockMethod = (): (() => Promise<{
  data: { user: null; session: null; subscription: { unsubscribe: () => void } };
  error: null;
}>) => {
  return () =>
    Promise.resolve({
      data: { user: null, session: null, subscription: { unsubscribe: () => {} } },
      error: null,
    });
};

const createAuthProxyHandler = (): ProxyHandler<object> => {
  return {
    get() {
      return createAuthMockMethod();
    },
  };
};

const createFromHandler = (): (() => {
  select: () => ReturnType<typeof createSelectChain>;
  order: () => { limit: () => Promise<{ data: never[]; error: null }> };
  insert: () => ReturnType<typeof createInsertChain>;
  update: () => ReturnType<typeof createUpdateOrDeleteChain>;
  delete: () => ReturnType<typeof createUpdateOrDeleteChain>;
}) => {
  return () => ({
    select: () => createSelectChain(),
    order: () => ({ limit: () => Promise.resolve({ data: [], error: null }) }),
    insert: () => createInsertChain(),
    update: () => createUpdateOrDeleteChain(),
    delete: () => createUpdateOrDeleteChain(),
  });
};

const createUnavailableServerProxy = (): SupabaseClient => {
  const handler: ProxyHandler<object> = {
    get(_target, prop: string | symbol) {
      if (prop === 'auth') {
        return new Proxy({}, createAuthProxyHandler());
      }
      if (prop === 'from') {
        return createFromHandler();
      }

      return undefined;
    },
  };

  return new Proxy({} as SupabaseClient, handler as ProxyHandler<SupabaseClient>);
};

export const createClient = async (): Promise<SupabaseClient> => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return createUnavailableServerProxy();
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Ignored in Server Component context
        }
      },
    },
  });
};
