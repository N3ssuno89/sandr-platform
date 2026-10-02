import type { ReactNode } from 'react';

// Contenitore delle pagine interne OPEN (diretta, profilo). Il tema chiaro e
// l'header/footer del volto Open sono forniti dalla chrome globale (SiteChrome):
// qui resta solo il wrapper di larghezza/padding del contenuto.
export function OpenThemeShell({ children }: { children: ReactNode }) {
  return <div className="mx-auto max-w-5xl px-4 py-8 md:px-10">{children}</div>;
}
