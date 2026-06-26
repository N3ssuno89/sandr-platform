'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

// Showcase interattivo a tab (presentazionale). I pannelli mostrano mock
// statici: nessun dato reale.
type Tab = { key: string; label: string; title: string; desc: string };

export function FeatureTabs() {
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
          <TabMock kind={tab.key} />
        </div>
      </div>
    </section>
  );
}

// Mock visivi per ogni tab (placeholder, niente dati reali).
function TabMock({ kind }: { kind: string }) {
  if (kind === 'multiview') {
    return (
      <div className="grid grid-cols-2 gap-3">
        {['a', 'b', 'c', 'd'].map((k) => (
          <div key={k} className="aspect-video rounded-lg bg-gradient-to-br from-white/10 to-transparent" />
        ))}
      </div>
    );
  }

  if (kind === 'replay') {
    return (
      <div className="flex gap-3">
        {['a', 'b', 'c'].map((k) => (
          <div key={k} className="w-1/3 overflow-hidden rounded-lg border border-white/10">
            <div className="aspect-video bg-gradient-to-br from-white/10 to-transparent" />
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
      <div className="overflow-hidden rounded-lg border border-white/10">
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
    );
  }

  // community
  const bubbles = ['Che punto!', 'Mol / Sørum imbattibili', 'Set point…', 'Pronostico: 2-0'];
  return (
    <div className="space-y-2">
      {bubbles.map((m, i) => (
        <div
          key={m}
          className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
            i % 2 ? 'ml-auto bg-sandr-orange/20 text-white' : 'bg-white/10 text-[#C0BDB8]'
          }`}
        >
          {m}
        </div>
      ))}
    </div>
  );
}
