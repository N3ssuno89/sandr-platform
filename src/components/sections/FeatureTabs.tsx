'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

// Showcase interattivo a tab. Le illustrazioni usano IMMAGINI REALI della
// piattaforma (copertine video + foto atleti) passate via prop `media`. Se non
// ci sono immagini reali (Supabase vuoto/non configurato) si ricade su un
// gradiente elegante, mai un box vuoto che sembra finto.
type Tab = { key: string; label: string; title: string; desc: string };

export type FeatureMedia = { thumbnails: string[]; athletePhotos: string[] };

export function FeatureTabs({ media }: { media: FeatureMedia }) {
  const t = useTranslations('Landing.showcase');
  const tabs = t.raw('tabs') as Tab[];
  const [active, setActive] = useState(0);
  const tab = tabs[active];

  return (
    <section className="bg-[#1C1C1C] px-4 py-20">
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-2xl font-condensed text-4xl font-extrabold text-white sm:text-5xl">
          {t('heading')}
        </h2>

        {/* Tab bar */}
        <div className="mt-8 flex gap-6 overflow-x-auto border-b border-white/10">
          {tabs.map((tb, i) => (
            <button
              key={tb.key}
              type="button"
              onClick={() => setActive(i)}
              className={`-mb-px whitespace-nowrap border-b-2 pb-3 font-condensed text-sm font-bold uppercase tracking-wide transition-colors ${
                active === i
                  ? 'border-sandr-orange text-white'
                  : 'border-transparent text-sandr-muted hover:text-white'
              }`}
            >
              {tb.label}
            </button>
          ))}
        </div>

        {/* Pannello */}
        <div
          className="mt-8 grid items-center gap-8 rounded-xl border border-white/[0.06] bg-[#242424] p-6 md:grid-cols-2 md:p-10"
          style={{ minHeight: '300px' }}
        >
          <div>
            <h3 className="font-condensed text-2xl font-bold uppercase tracking-wide text-white">{tab.title}</h3>
            <p className="mt-3 text-[#C0BDB8]">{tab.desc}</p>
          </div>
          <TabVisual kind={tab.key} media={media} />
        </div>
      </div>
    </section>
  );
}

// Riquadro immagine reale con fallback a gradiente (mai vuoto/finto).
function Cover({ src, className = '' }: { src?: string; className?: string }) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="" className={`h-full w-full object-cover ${className}`} />
    );
  }
  return <div className={`h-full w-full bg-gradient-to-br from-white/10 to-transparent ${className}`} />;
}

// Illustrazioni dei tab con copertine/foto reali della piattaforma.
function TabVisual({ kind, media }: { kind: string; media: FeatureMedia }) {
  const { thumbnails, athletePhotos } = media;
  // Per multiview/replay usiamo le copertine video; in mancanza, foto atleti.
  const covers = thumbnails.length > 0 ? thumbnails : athletePhotos;

  if (kind === 'multiview') {
    return (
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="aspect-video overflow-hidden rounded-lg">
            <Cover src={covers[i]} />
          </div>
        ))}
      </div>
    );
  }

  if (kind === 'replay') {
    return (
      <div className="flex gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="w-1/3 overflow-hidden rounded-lg border border-white/10">
            <div className="aspect-video overflow-hidden">
              <Cover src={covers[i]} />
            </div>
            <div className="space-y-1 p-2">
              <div className="h-2 w-3/4 rounded bg-white/15" />
              <div className="h-2 w-1/2 rounded bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (kind === 'stats') {
    const rows = [
      { label: 'Ace', a: 6, b: 4 },
      { label: 'Attacco %', a: 58, b: 51 },
      { label: 'Muri', a: 3, b: 5 },
      { label: 'Errori', a: 7, b: 9 },
    ];
    return (
      <div className="flex gap-3">
        {/* Foto atleta reale accanto alla tabella statistiche */}
        <div className="hidden w-1/3 shrink-0 overflow-hidden rounded-lg sm:block" style={{ aspectRatio: '3 / 4' }}>
          <Cover src={athletePhotos[0] ?? covers[0]} className="object-top" />
        </div>
        <div className="flex-1 overflow-hidden rounded-lg border border-white/10">
          <div className="grid grid-cols-3 bg-white/5 px-4 py-2 text-xs uppercase tracking-wide text-sandr-muted">
            <span>Stat</span>
            <span className="text-right">A</span>
            <span className="text-right">B</span>
          </div>
          {rows.map((r) => (
            <div key={r.label} className="grid grid-cols-3 px-4 py-2 text-sm text-[#C0BDB8]">
              <span>{r.label}</span>
              <span className="text-right text-white">{r.a}</span>
              <span className="text-right text-white">{r.b}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // community — bolle chat con avatar atleti reali
  const bubbles = ['Che punto!', 'Mol / Sørum imbattibili', 'Set point…', 'Pronostico: 2-0'];
  return (
    <div className="space-y-2">
      {bubbles.map((m, i) => (
        <div key={m} className={`flex items-center gap-2 ${i % 2 ? 'flex-row-reverse' : ''}`}>
          <span className="h-7 w-7 shrink-0 overflow-hidden rounded-full">
            <Cover src={athletePhotos[i % Math.max(athletePhotos.length, 1)]} className="object-top" />
          </span>
          <div
            className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
              i % 2 ? 'bg-sandr-orange/20 text-white' : 'bg-white/10 text-[#C0BDB8]'
            }`}
          >
            {m}
          </div>
        </div>
      ))}
    </div>
  );
}
