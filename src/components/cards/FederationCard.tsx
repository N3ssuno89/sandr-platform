import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { Federation } from '@/types/federation';

// Card federazione/circuito. Click -> /federations/[id]. Compatta: mostra solo
// nome, descrizione (nome esteso) e sport, con la CTA "Esplora" ancorata in basso.
export function FederationCard({ federation }: { federation: Federation }) {
  const t = useTranslations('Federation');

  return (
    <Link
      href={`/federations/${federation.id}`}
      style={{ width: 200, height: 160 }}
      className="group relative flex shrink-0 flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1C1C1C] transition-colors hover:border-white/20"
    >
      {/* Accent bar federazione */}
      <div style={{ height: 4, background: federation.color }} />

      {/* Sport tag (angolo in alto a destra) */}
      <span className="absolute right-3 top-4 rounded-full bg-white/[0.06] px-2 py-0.5 font-condensed text-[10px] font-bold uppercase tracking-wide text-sandr-text">
        {federation.sport}
      </span>

      <div className="flex flex-1 flex-col p-4">
        <p className="font-condensed text-[28px] font-black leading-none text-white">{federation.shortName}</p>
        <p className="mt-1 truncate text-[12px] text-[#888888]">{federation.name}</p>

        {/* CTA Esplora (ancorata in basso) */}
        <span className="mt-auto flex h-9 items-center justify-center rounded-md border border-sandr-orange text-[13px] font-bold uppercase tracking-wide text-sandr-orange">
          {t('explore')}
        </span>
      </div>
    </Link>
  );
}
