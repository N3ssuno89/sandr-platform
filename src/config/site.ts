// Costanti statiche del sito SANDR.

export const siteConfig = {
  name: 'SANDR',
  domain: 'sandr.tv',
  description: 'Media network e piattaforma streaming per beach volley e sand sports.',
  tagline: 'Built for the arena. Not the stands.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
} as const;

// Rotte che richiedono autenticazione (vedi src/middleware.ts).
export const protectedRoutes = [
  '/live',
  '/vod',
  '/interviews',
  '/dashboard',
  '/broadcast',
] as const;

// Rotte riservate per ruolo (controllo applicato anche via RLS lato DB).
export const roleRestrictedRoutes = {
  admin: ['/dashboard'],
  broadcaster: ['/broadcast'],
} as const;
