import { type NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { routing } from '@/i18n/routing';
import { env } from '@/lib/env';
import { protectedRoutes } from '@/config/site';

const intlMiddleware = createIntlMiddleware(routing);

// Rimuove il prefisso di locale (/it, /en) per ottenere il path "logico".
function stripLocale(pathname: string): string {
  const segments = pathname.split('/');
  if (routing.locales.includes(segments[1] as (typeof routing.locales)[number])) {
    return '/' + segments.slice(2).join('/');
  }
  return pathname;
}

// Pagine dashboard pubbliche in demo (finché non c'è auth reale).
const demoPublicRoutes = [
  '/dashboard/home',
  '/dashboard/subscription',
  '/dashboard/payment',
  '/dashboard/ppv-history',
  '/dashboard/settings',
];

function isProtected(pathname: string): boolean {
  const path = stripLocale(pathname);
  if (demoPublicRoutes.includes(path)) return false;
  // Player live pubblico in demo (nessun controllo accesso reale ancora).
  if (path === '/live' || path.startsWith('/live/')) return false;
  // Pannello admin pubblico in demo. PRODUZIONE: gating ruolo admin via
  // Supabase RLS obbligatorio (AREA CRITICA, CLAUDE.md).
  if (path === '/dashboard/admin' || path.startsWith('/dashboard/admin/')) return false;
  return protectedRoutes.some(
    (route) => path === route || path.startsWith(`${route}/`),
  );
}

export async function middleware(request: NextRequest) {
  // 1. i18n routing: genera la response con gestione della locale.
  const response = intlMiddleware(request);

  // 2. Supabase: refresh della sessione propagando i cookie sulla response.
  //    AREA CRITICA: Auth/sessioni richiedono review umana (CLAUDE.md).
  const supabase = createServerClient(env.supabase.url(), env.supabase.anonKey(), {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 3. Protezione rotte autenticate: redirect al login se non autenticato.
  if (!user && isProtected(request.nextUrl.pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = `/${routing.defaultLocale}/login`;
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // Esegue il middleware su tutte le rotte tranne asset statici e API.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
