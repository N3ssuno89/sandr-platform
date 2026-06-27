import { type NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { updateSession } from '@/lib/supabase/middleware';
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

// Locale corrente dalla URL (fallback al default).
function localeOf(pathname: string): string {
  const seg = pathname.split('/')[1];
  return routing.locales.includes(seg as (typeof routing.locales)[number])
    ? seg
    : routing.defaultLocale;
}

// Rotte protette: tutto sotto /dashboard (home, admin, subscription, payment,
// settings, ppv-history, ...) e /broadcast. Pubbliche: landing, /pricing,
// /live, /vod, /athletes, /federations (non sotto /dashboard né /broadcast).
function isProtected(pathname: string): boolean {
  const path = stripLocale(pathname);
  return protectedRoutes.some((route) => path === route || path.startsWith(`${route}/`));
}

export async function middleware(request: NextRequest) {
  // 1. i18n routing: genera la response con gestione della locale.
  const response = intlMiddleware(request);

  // 2. Supabase: refresh della sessione, propagando i cookie sulla response.
  //    AREA CRITICA (CLAUDE.md): Auth/sessioni richiedono review umana.
  //    Build-safe: senza env Supabase, user resta null (nessuna protezione).
  const { user } = await updateSession(request, response);

  // 3. Protezione rotte autenticate: redirect al login se non autenticato.
  if (!user && isProtected(request.nextUrl.pathname)) {
    const locale = localeOf(request.nextUrl.pathname);
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    url.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  // Esegue il middleware su tutte le rotte tranne asset statici e API.
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
