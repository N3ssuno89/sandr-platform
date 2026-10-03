import { setRequestLocale, getTranslations } from 'next-intl/server';
import { OrganizeForm } from '@/components/open/OrganizeForm';
import { DEMO_CONTENT } from '@/config/features';

// "Organizza" (volto OPEN): come proporre un torneo di club/Open su SANDR.
// Pagina informativa + form dimostrativo (vedi OrganizeForm: nessun invio).
export default async function OpenOrganizzaPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations('OpenOrganize');
  const steps = t.raw('steps') as { title: string; desc: string }[];

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-10 md:px-10">
      <h1 className="font-display text-4xl uppercase tracking-tight">{t('title')}</h1>
      <p className="mt-1 max-w-2xl font-barlow text-[color:var(--face-muted)]">{t('intro')}</p>

      {/* Come funziona */}
      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {steps.map((s, i) => (
          <div
            key={i}
            className="rounded-xl border p-5"
            style={{ backgroundColor: 'var(--face-surface)', borderColor: 'var(--face-border)' }}
          >
            <span className="font-display text-2xl text-[color:var(--face-accent)]">{i + 1}</span>
            <h3 className="mt-2 font-narrow text-lg font-bold uppercase tracking-wide">{s.title}</h3>
            <p className="mt-1 font-barlow text-sm text-[color:var(--face-muted)]">{s.desc}</p>
          </div>
        ))}
      </section>

      {/* Richiesta: il modulo è DIMOSTRATIVO (nessun invio reale), quindi è
          mostrato solo con i contenuti demo attivi. A flag spento mostriamo una
          nota "prossimamente" invece del form finto. */}
      <section className="mt-10 max-w-2xl">
        <h2 className="mb-4 font-narrow text-[26px] font-bold uppercase tracking-wide">{t('formTitle')}</h2>
        {DEMO_CONTENT ? (
          <OrganizeForm />
        ) : (
          <div
            className="rounded-2xl border p-6"
            style={{ backgroundColor: 'var(--face-surface)', borderColor: 'var(--face-border)' }}
          >
            <p className="font-barlow text-[color:var(--face-muted)]">{t('closedNote')}</p>
          </div>
        )}
      </section>
    </div>
  );
}
