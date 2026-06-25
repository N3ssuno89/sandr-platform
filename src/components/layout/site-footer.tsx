import { useTranslations } from 'next-intl';
import { siteConfig } from '@/config/site';

// Footer placeholder. Il disclaimer betting e l'age gate 18+ NON vanno mai
// rimossi (CLAUDE.md): qui resta lo spazio dedicato.
export function SiteFooter() {
  const tc = useTranslations('Common');

  return (
    <footer className="border-t border-white/10 bg-sandr-black">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-sandr-muted">
        <p className="font-condensed uppercase tracking-wide text-sandr-text">
          {tc('tagline')}
        </p>
        <p className="mt-2">
          © {siteConfig.name} — {siteConfig.domain}
        </p>
        {/* Disclaimer 18+ / betting: placeholder, da non rimuovere. */}
        <p className="mt-4 text-xs">18+</p>
      </div>
    </footer>
  );
}
