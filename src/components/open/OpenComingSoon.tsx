import { getTranslations } from 'next-intl/server';

// Pagina segnaposto del volto OPEN ("prossimamente"). Tematizzata via variabili
// CSS del volto. Usata per le voci di menu OPEN la cui pagina dedicata non è
// ancora stata realizzata (Vicino a te, Organizza): così la navigazione resta
// sempre dentro il volto OPEN.
export async function OpenComingSoon({ title }: { title: string }) {
  const t = await getTranslations('OpenPlaceholder');
  return (
    <div className="mx-auto max-w-[1360px] px-4 py-16 md:px-10">
      <h1 className="font-display text-4xl uppercase tracking-tight">{title}</h1>
      <div
        className="mt-6 rounded-2xl border p-10 text-center"
        style={{ backgroundColor: 'var(--face-surface)', borderColor: 'var(--face-border)' }}
      >
        <p className="font-narrow text-[22px] font-bold uppercase tracking-wide">{t('soon')}</p>
        <p className="mx-auto mt-2 max-w-md font-barlow text-sm text-[color:var(--face-muted)]">
          {t('soonDesc')}
        </p>
      </div>
    </div>
  );
}
