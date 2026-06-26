import { useTranslations } from 'next-intl';

// Anteprima partnership scommesse: SOLO statico. Nessun link, nessun URL
// esterno, nessuna funzionalità reale. AREA CRITICA (CLAUDE.md): il widget
// betting/compliance richiede review umana prima di qualsiasi integrazione.
// Disclaimer e age gate 18+ sono parte integrante e non vanno rimossi.
export function BettingPartnerSection() {
  const t = useTranslations('Betting');

  const odds = [
    { label: '1 — Mol/Sørum', value: '1.85' },
    { label: `X — ${t('draw')}`, value: '12.00' },
    { label: '2 — Plavins/Tocs', value: '2.10' },
  ];

  return (
    <section className="border-y border-white/[0.06] bg-[#1C1C1C]">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-[60px] md:flex-row md:px-20">
        {/* Sinistra (60%) */}
        <div className="md:w-3/5">
          <p className="font-condensed font-bold uppercase tracking-[3px] text-[#888888]" style={{ fontSize: '11px' }}>
            {t('label')}
          </p>
          <h2 className="mt-3 font-condensed text-3xl font-extrabold text-white md:text-4xl">{t('heading')}</h2>
          <p className="mt-3 max-w-xl text-[15px] text-[#C0BDB8]">{t('subline')}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            <span className="rounded-full border border-sandr-orange px-3 py-1 text-xs font-bold uppercase tracking-wide text-sandr-orange">
              {t('badgeLive')}
            </span>
            <span className="rounded-full border border-sandr-orange px-3 py-1 text-xs font-bold uppercase tracking-wide text-sandr-orange">
              {t('badgeInplay')}
            </span>
            <span className="rounded-full border border-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#888888]">
              {t('badgeSoon')}
            </span>
          </div>

          <p className="mt-4 text-[11px] text-[#555555]">{t('disclaimer')}</p>
        </div>

        {/* Destra (40%): mock widget quote (non funzionale) */}
        <div className="md:w-2/5">
          <div className="rounded-xl bg-[#242424] p-5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wide text-[#888888]">{t('widgetTitle')}</span>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sandr-orange opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-sandr-orange" />
              </span>
            </div>

            <p className="mt-3 font-condensed text-sm font-bold text-white">Mol / Sørum vs Plavins / Tocs</p>

            {/* Quote offuscate + overlay "prossimamente" */}
            <div className="relative mt-3">
              <div className="grid grid-cols-3 gap-2" style={{ filter: 'blur(4px)' }}>
                {odds.map((o) => (
                  <div key={o.label} className="rounded border border-white/10 bg-[#2a2a2a] p-2 text-center">
                    <p className="text-[10px] text-[#888888]">{o.label}</p>
                    <p className="mt-1 font-condensed text-base font-bold text-white">{o.value}</p>
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-condensed text-sm font-bold uppercase tracking-wide text-white">
                  {t('comingSoon')}
                </span>
              </div>
            </div>

            <p className="mt-3 text-[12px] text-[#888888]">{t('setStatus')}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
