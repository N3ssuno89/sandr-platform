import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import type { Federation } from '@/types/federation';

// Card federazione/circuito. Click -> /federations/[id]. Larghezza fissa 200px.
export function FederationCard({ federation }: { federation: Federation }) {
  const t = useTranslations('Federation');

  const counts = [
    { label: t('counts.live'), value: federation.contentCount.live },
    { label: t('counts.replay'), value: federation.contentCount.replay },
    { label: t('counts.interviews'), value: federation.contentCount.interviews },
    { label: t('counts.highlights'), value: federation.contentCount.highlights },
  ];

  return (
    <Link
      href={`/federations/${federation.id}`}
      style={{ width: 200 }}
      className="group block shrink-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#1C1C1C] transition-colors hover:border-white/20"
    >
      {/* Accent bar federazione */}
      <div style={{ height: 4, background: federation.color }} />

      <div className="p-5">
        <p className="font-condensed text-[32px] font-black leading-none text-white">{federation.shortName}</p>
        <p className="mt-1 text-[13px] text-[#888888]">{federation.name}</p>
        <span className="mt-3 inline-block rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-sandr-text">
          {federation.sport}
        </span>

        {/* Conteggio contenuti */}
        <div className="mt-4 grid grid-cols-4 gap-1">
          {counts.map((c) => (
            <div key={c.label} className="text-center">
              <p className="font-condensed text-[12px] font-bold text-white">{c.value}</p>
              <p className="text-[9px] uppercase tracking-wide text-[#555555]">{c.label}</p>
            </div>
          ))}
        </div>

        {/* CTA Esplora */}
        <span className="mt-4 flex h-9 items-center justify-center rounded-md border border-sandr-orange text-[13px] font-bold uppercase tracking-wide text-sandr-orange">
          {t('explore')}
        </span>
      </div>
    </Link>
  );
}
