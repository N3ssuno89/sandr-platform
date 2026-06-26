'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

// Pulsante reminder (demo): al click mostra la conferma inline. Nessuna logica.
export function ReminderButton() {
  const t = useTranslations('Athlete');
  const [set, setSet] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setSet(true)}
      aria-pressed={set}
      className="rounded-md border border-sandr-orange/30 px-3 py-1 text-[12px] text-sandr-orange hover:bg-sandr-orange/10"
    >
      {set ? (
        <span className="inline-flex items-center gap-1.5">
          {/* check in CSS, niente emoji */}
          <span className="inline-block h-2.5 w-1.5 rotate-45 border-b-2 border-r-2 border-sandr-orange" />
          {t('reminderSet')}
        </span>
      ) : (
        t('reminder')
      )}
    </button>
  );
}
