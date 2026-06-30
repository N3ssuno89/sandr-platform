// Costanti statiche del sito SANDR.

export const siteConfig = {
  name: 'SANDR',
  domain: 'sandr.tv',
  description: 'Media network e piattaforma streaming per beach volley e sand sports.',
  tagline: 'Built for the arena. Not the stands.',
  // URL pubblico: da env (https://sandr.tv in produzione). Fallback al dominio
  // HTTPS reale, mai un http:// hardcoded (evita mixed content nei meta tag).
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sandr.tv',
} as const;

// Rotte che richiedono autenticazione (vedi src/middleware.ts).
// Per ora /live, /vod e /interviews sono pubbliche: solo i pannelli
// admin/broadcaster restano protetti.
export const protectedRoutes = ['/dashboard', '/broadcast'] as const;

// Rotte riservate per ruolo (controllo applicato anche via RLS lato DB).
export const roleRestrictedRoutes = {
  admin: ['/dashboard'],
  broadcaster: ['/broadcast'],
} as const;
