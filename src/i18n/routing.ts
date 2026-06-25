import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

// SANDR è bilingue: italiano (default) e inglese.
export const routing = defineRouting({
  locales: ['it', 'en'],
  defaultLocale: 'it',
});

export type Locale = (typeof routing.locales)[number];

// Wrapper di navigazione locale-aware (Link, redirect, router, ...)
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
