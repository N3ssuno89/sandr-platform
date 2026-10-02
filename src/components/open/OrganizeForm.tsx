'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

// Form "Organizza un torneo" (volto OPEN). DEMO: non invia nulla a un backend —
// mostra una conferma locale. Il backend (salvataggio richiesta) arriverà dopo
// e richiederà review (dati utente). Nessun dato lascia il browser.
export function OrganizeForm() {
  const t = useTranslations('OpenOrganize');
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div
        className="rounded-2xl border p-8 text-center"
        style={{ backgroundColor: 'var(--face-surface)', borderColor: 'var(--face-border)' }}
      >
        <p className="font-narrow text-xl font-bold uppercase tracking-wide">{t('thanksTitle')}</p>
        <p className="mx-auto mt-2 max-w-md font-barlow text-sm text-[color:var(--face-muted)]">
          {t('thanksDesc')}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="rounded-2xl border p-6"
      style={{ backgroundColor: 'var(--face-surface)', borderColor: 'var(--face-border)' }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t('fieldName')} name="name" required />
        <Field label={t('fieldCity')} name="city" required />
        <Field label={t('fieldDate')} name="date" type="date" />
        <Field label={t('fieldEmail')} name="email" type="email" required />
      </div>
      <p className="mt-3 font-barlow text-xs text-[color:var(--face-muted)]">{t('demoNote')}</p>
      <button
        type="submit"
        className="mt-4 rounded-[10px] bg-[color:var(--face-accent)] px-6 py-3 font-barlow font-bold uppercase tracking-wide text-white"
      >
        {t('submit')}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-barlow text-xs font-semibold uppercase tracking-wide text-[color:var(--face-muted)]">
        {label}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-[10px] border px-3 py-2.5 font-barlow outline-none"
        style={{ backgroundColor: 'var(--face-bg)', borderColor: 'var(--face-border)', color: 'var(--face-fg)' }}
      />
    </label>
  );
}
