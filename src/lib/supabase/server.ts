import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';
import { env } from '@/lib/env';

// Client Supabase per Server Component, Server Action e Route Handler.
export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(env.supabase.url(), env.supabase.anonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Chiamato da un Server Component: i cookie sono di sola lettura.
          // Il refresh della sessione è gestito dal middleware.
        }
      },
    },
  });
}
