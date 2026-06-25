import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';
import { env } from '@/lib/env';

// Client Supabase per i Client Component (browser).
export function createClient() {
  return createBrowserClient<Database>(env.supabase.url(), env.supabase.anonKey());
}
