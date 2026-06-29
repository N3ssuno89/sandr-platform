import type { LocalizedDoc } from './types';

// Cookie Policy (bozza tecnica). Le righe sui cookie di terze parti specifici
// vanno completate con i provider effettivamente attivi.
export const cookiesContent: LocalizedDoc = {
  it: {
    title: 'Cookie Policy',
    updated: 'Ultimo aggiornamento: [DA COMPLETARE CON IL LEGALE: data]',
    intro: [
      'Questa Cookie Policy spiega cosa sono i cookie, come SANDR li utilizza sulla Piattaforma sandr.tv e come puoi gestire le tue preferenze. Per il trattamento dei dati personali si rimanda all’Informativa sulla Privacy.',
      'I cookie sono piccoli file di testo memorizzati sul dispositivo. Utilizziamo cookie tecnici necessari e, previo consenso, cookie analitici, di profilazione e di marketing.',
    ],
    sections: [
      {
        heading: 'Cookie necessari',
        blocks: [
          'Indispensabili al funzionamento della Piattaforma: autenticazione, mantenimento della sessione, sicurezza e memorizzazione delle preferenze di consenso. Non richiedono consenso e non possono essere disattivati.',
          { list: ['Finalità: erogazione del servizio.', 'Durata: sessione / [DA COMPLETARE: durata].'] },
        ],
      },
      {
        heading: 'Cookie funzionali',
        blocks: [
          'Migliorano l’esperienza ricordando scelte come lingua e impostazioni di riproduzione.',
          { list: ['Finalità: personalizzazione di base.', 'Durata: [DA COMPLETARE: durata].'] },
        ],
      },
      {
        heading: 'Cookie analitici',
        blocks: [
          'Raccolgono informazioni aggregate su come gli utenti utilizzano la Piattaforma, per migliorarne le prestazioni. Attivati solo previo consenso.',
          { list: ['Finalità: statistiche e miglioramento.', 'Provider: [DA COMPLETARE: provider analytics].', 'Durata: [DA COMPLETARE].'] },
        ],
      },
      {
        heading: 'Cookie di profilazione',
        blocks: [
          'Utilizzati per fornire contenuti e suggerimenti personalizzati in base agli interessi. Attivati solo previo consenso.',
          { list: ['Finalità: raccomandazioni personalizzate.', 'Durata: [DA COMPLETARE].'] },
        ],
      },
      {
        heading: 'Cookie di marketing',
        blocks: [
          'Utilizzati per mostrare comunicazioni promozionali pertinenti, anche di terze parti. Attivati solo previo consenso.',
          { list: ['Finalità: marketing.', 'Provider terzi: [DA COMPLETARE: elenco cookie di terze parti].', 'Durata: [DA COMPLETARE].'] },
        ],
      },
      {
        heading: 'Come gestire le preferenze',
        blocks: [
          'Puoi gestire le tue preferenze tramite il banner dei cookie al primo accesso e in qualsiasi momento riaprendo le impostazioni. Puoi inoltre configurare il browser per bloccare o eliminare i cookie; la disattivazione dei cookie necessari può compromettere il funzionamento della Piattaforma.',
        ],
      },
    ],
  },
  en: {
    title: 'Cookie Policy',
    updated: 'Last updated: [TO BE COMPLETED WITH LEGAL COUNSEL: date]',
    intro: [
      'This Cookie Policy explains what cookies are, how SANDR uses them on the sandr.tv Platform and how you can manage your preferences. For the processing of personal data, please refer to the Privacy Policy.',
      'Cookies are small text files stored on your device. We use necessary technical cookies and, subject to consent, analytics, profiling and marketing cookies.',
    ],
    sections: [
      {
        heading: 'Necessary cookies',
        blocks: [
          'Essential for the Platform to function: authentication, session maintenance, security and storing consent preferences. They do not require consent and cannot be disabled.',
          { list: ['Purpose: service delivery.', 'Duration: session / [TO BE COMPLETED: duration].'] },
        ],
      },
      {
        heading: 'Functional cookies',
        blocks: [
          'Improve the experience by remembering choices such as language and playback settings.',
          { list: ['Purpose: basic personalisation.', 'Duration: [TO BE COMPLETED: duration].'] },
        ],
      },
      {
        heading: 'Analytics cookies',
        blocks: [
          'Collect aggregated information about how users use the Platform, to improve performance. Enabled only with consent.',
          { list: ['Purpose: statistics and improvement.', 'Provider: [TO BE COMPLETED: analytics provider].', 'Duration: [TO BE COMPLETED].'] },
        ],
      },
      {
        heading: 'Profiling cookies',
        blocks: [
          'Used to provide personalised content and recommendations based on interests. Enabled only with consent.',
          { list: ['Purpose: personalised recommendations.', 'Duration: [TO BE COMPLETED].'] },
        ],
      },
      {
        heading: 'Marketing cookies',
        blocks: [
          'Used to show relevant promotional communications, including from third parties. Enabled only with consent.',
          { list: ['Purpose: marketing.', 'Third-party providers: [TO BE COMPLETED: list of third-party cookies].', 'Duration: [TO BE COMPLETED].'] },
        ],
      },
      {
        heading: 'How to manage preferences',
        blocks: [
          'You can manage your preferences via the cookie banner on first visit and at any time by reopening the settings. You can also configure your browser to block or delete cookies; disabling necessary cookies may impair the Platform.',
        ],
      },
    ],
  },
};
