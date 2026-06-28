import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { env } from '@/lib/env';

// Client Supabase per Server Component, Server Action e Route Handler.
//
// NOTA tipi: @supabase/ssr@0.5 tipa il ritorno con la VECCHIA firma generica di
// SupabaseClient, mentre supabase-js@2.108 ne usa una nuova (ClientServerOptions).
// Lo skew fa risolvere lo schema a `never` (query non tipizzate). Riallineiamo
// il tipo a `SupabaseClient<Database>` (forma a 1 generico) in UN solo punto,
// così tutte le query a valle sono correttamente tipizzate (niente cast sparsi).
export function createClient(): SupabaseClient<Database> {
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
  }) as unknown as SupabaseClient<Database>;
}
