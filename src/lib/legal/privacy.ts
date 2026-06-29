import type { LocalizedDoc } from './types';

// Informativa privacy GDPR (bozza tecnica). Modellata su informative complete
// tipo DAZN. I segnaposto [DA COMPLETARE …] vanno compilati dal legale.
export const privacyContent: LocalizedDoc = {
  it: {
    title: 'Informativa sulla Privacy',
    updated: 'Ultimo aggiornamento: [DA COMPLETARE CON IL LEGALE: data]',
    intro: [
      'La presente informativa descrive come SANDR ("SANDR", "noi") tratta i dati personali degli utenti della piattaforma di streaming sportivo disponibile su sandr.tv ("Piattaforma"), ai sensi del Regolamento (UE) 2016/679 ("GDPR") e della normativa italiana applicabile (D.lgs. 196/2003 come modificato dal D.lgs. 101/2018).',
      'Ti invitiamo a leggere con attenzione questa informativa prima di registrarti o utilizzare la Piattaforma.',
    ],
    sections: [
      {
        heading: 'Titolare del trattamento',
        blocks: [
          'Il Titolare del trattamento dei dati è [DA COMPLETARE CON IL LEGALE: ragione sociale], con sede legale in [DA COMPLETARE: indirizzo, città, CAP], P.IVA/C.F. [DA COMPLETARE: partita IVA], iscritta al Registro delle Imprese di [DA COMPLETARE].',
          'Contatti del Titolare: email [DA COMPLETARE: email], PEC [DA COMPLETARE: pec], telefono [DA COMPLETARE: telefono].',
          'Responsabile della Protezione dei Dati (DPO), ove nominato: [DA COMPLETARE CON IL LEGALE: nominativo e contatto DPO].',
        ],
      },
      {
        heading: 'Tipologie di dati raccolti',
        blocks: [
          'Trattiamo le seguenti categorie di dati personali:',
          {
            list: [
              'Dati di registrazione e account: nome e cognome, indirizzo email, password (in forma cifrata), preferenze di lingua.',
              'Dati di utilizzo e visualizzazione: contenuti guardati, cronologia di visione, progressi di riproduzione, preferiti, ricerche, interazioni con la Piattaforma.',
              'Dati tecnici e di dispositivo: indirizzo IP, identificativi del dispositivo, tipo di browser e sistema operativo, dati di connessione e log di sistema.',
              'Dati di pagamento (quando attivati): gestiti tramite il fornitore di pagamenti; SANDR non memorizza i dati completi delle carte. [DA COMPLETARE CON IL LEGALE: dettagli sul trattamento pagamenti].',
              'Cookie e tecnologie analoghe: vedi la nostra Cookie Policy.',
            ],
          },
        ],
      },
      {
        heading: 'Finalità del trattamento',
        blocks: [
          'I dati personali sono trattati per le seguenti finalità:',
          {
            list: [
              'Erogazione del servizio e gestione dell’account (registrazione, autenticazione, accesso ai contenuti).',
              'Gestione degli abbonamenti, degli acquisti pay-per-view e dei pagamenti.',
              'Personalizzazione dell’esperienza e suggerimenti di contenuti (profilazione), previo consenso.',
              'Invio di comunicazioni marketing e promozionali, previo consenso.',
              'Analisi statistiche e miglioramento della Piattaforma (analytics).',
              'Adempimenti di obblighi legali, fiscali e contabili.',
              'Sicurezza della Piattaforma, prevenzione frodi e abusi.',
            ],
          },
        ],
      },
      {
        heading: 'Base giuridica del trattamento',
        blocks: [
          'Ogni finalità si fonda su una specifica base giuridica:',
          {
            list: [
              'Esecuzione del contratto (art. 6.1.b GDPR): erogazione del servizio, gestione account, abbonamenti e pagamenti.',
              'Consenso (art. 6.1.a GDPR): marketing, profilazione, condivisione con partner selezionati. Il consenso è revocabile in qualsiasi momento.',
              'Legittimo interesse (art. 6.1.f GDPR): analytics aggregati, sicurezza, prevenzione frodi, miglioramento del servizio.',
              'Obbligo legale (art. 6.1.c GDPR): adempimenti fiscali, contabili e di legge.',
            ],
          },
        ],
      },
      {
        heading: 'Modalità di trattamento e sicurezza',
        blocks: [
          'I dati sono trattati con strumenti elettronici e misure tecniche e organizzative adeguate a garantire sicurezza, riservatezza e integrità, inclusi cifratura in transito, controllo degli accessi basato sui ruoli e Row Level Security a livello di database.',
          'L’accesso ai dati è limitato al personale autorizzato e ai responsabili del trattamento vincolati da obblighi di riservatezza.',
        ],
      },
      {
        heading: 'Conservazione dei dati',
        blocks: [
          'I dati sono conservati per il tempo necessario alle finalità per cui sono raccolti e nei termini di legge:',
          {
            list: [
              'Dati dell’account: per la durata del rapporto e successivamente per [DA COMPLETARE CON IL LEGALE: periodo, es. 12 mesi] dalla cancellazione.',
              'Dati di fatturazione e fiscali: [DA COMPLETARE: es. 10 anni] come da normativa.',
              'Dati di utilizzo e analytics: [DA COMPLETARE: periodo].',
              'Dati raccolti su base consenso: fino a revoca del consenso o [DA COMPLETARE: periodo].',
            ],
          },
        ],
      },
      {
        heading: 'Comunicazione e trasferimento dei dati',
        blocks: [
          'I dati possono essere trattati da fornitori che agiscono come responsabili del trattamento (sub-responsabili), tra cui:',
          {
            list: [
              'Supabase — hosting del database e autenticazione (data center UE/Irlanda).',
              'Cloudflare — streaming video e CDN.',
              'Fornitore di pagamenti (es. Stripe) — gestione pagamenti futuri.',
              'Fornitore di servizi email — invio comunicazioni transazionali e, previo consenso, marketing.',
              '[DA COMPLETARE CON IL LEGALE: eventuali altri fornitori].',
            ],
          },
          'Alcuni fornitori possono trattare dati al di fuori dello Spazio Economico Europeo. In tali casi il trasferimento è assistito da garanzie adeguate ai sensi degli artt. 44 e ss. GDPR, in particolare le Clausole Contrattuali Standard (SCC) approvate dalla Commissione Europea. [DA COMPLETARE CON IL LEGALE: dettaglio garanzie].',
        ],
      },
      {
        heading: 'Diritti dell’interessato',
        blocks: [
          'In qualità di interessato hai diritto, nei limiti di legge, di:',
          {
            list: [
              'Accedere ai tuoi dati personali (art. 15).',
              'Ottenere la rettifica dei dati inesatti (art. 16).',
              'Ottenere la cancellazione dei dati / diritto all’oblio (art. 17).',
              'Ottenere la limitazione del trattamento (art. 18).',
              'Ottenere la portabilità dei dati (art. 20).',
              'Opporti al trattamento (art. 21).',
              'Revocare il consenso in qualsiasi momento, senza pregiudicare la liceità del trattamento basato sul consenso prestato prima della revoca.',
              'Proporre reclamo all’Autorità Garante per la protezione dei dati personali.',
            ],
          },
        ],
      },
      {
        heading: 'Come esercitare i diritti',
        blocks: [
          'Puoi esercitare i tuoi diritti scrivendo a [DA COMPLETARE CON IL LEGALE: email/modalità di contatto per le richieste privacy]. Risponderemo nei termini previsti dal GDPR (di norma entro un mese).',
        ],
      },
      {
        heading: 'Cookie',
        blocks: [
          'La Piattaforma utilizza cookie tecnici necessari e, previo consenso, cookie analitici, di profilazione e di marketing. Per maggiori informazioni consulta la Cookie Policy.',
        ],
      },
      {
        heading: 'Minori e età minima',
        blocks: [
          'La Piattaforma può includere contenuti riservati a un pubblico adulto (es. widget di scommesse sportive). L’età minima per la registrazione è 18 anni. Non raccogliamo consapevolmente dati di minori di 18 anni; qualora venissimo a conoscenza di tale trattamento, provvederemo alla cancellazione.',
        ],
      },
      {
        heading: 'Modifiche all’informativa',
        blocks: [
          'Potremo aggiornare la presente informativa per esigenze normative o di servizio. Le modifiche saranno pubblicate su questa pagina con indicazione della data di aggiornamento; in caso di modifiche sostanziali ne daremo opportuna evidenza.',
        ],
      },
      {
        heading: 'Contatti e DPO',
        blocks: [
          'Per qualsiasi richiesta relativa al trattamento dei dati personali puoi contattare il Titolare ai recapiti sopra indicati o il Responsabile della Protezione dei Dati (DPO): [DA COMPLETARE CON IL LEGALE: contatto DPO].',
        ],
      },
    ],
  },
  en: {
    title: 'Privacy Policy',
    updated: 'Last updated: [TO BE COMPLETED WITH LEGAL COUNSEL: date]',
    intro: [
      'This Privacy Policy describes how SANDR ("SANDR", "we") processes the personal data of users of the sports streaming platform available at sandr.tv (the "Platform"), pursuant to Regulation (EU) 2016/679 ("GDPR") and applicable Italian law.',
      'Please read this policy carefully before registering or using the Platform.',
    ],
    sections: [
      {
        heading: 'Data Controller',
        blocks: [
          'The Data Controller is [TO BE COMPLETED WITH LEGAL COUNSEL: company name], with registered office at [TO BE COMPLETED: address], VAT/Tax ID [TO BE COMPLETED].',
          'Controller contacts: email [TO BE COMPLETED], certified email (PEC) [TO BE COMPLETED], phone [TO BE COMPLETED].',
          'Data Protection Officer (DPO), where appointed: [TO BE COMPLETED WITH LEGAL COUNSEL: DPO name and contact].',
        ],
      },
      {
        heading: 'Categories of data collected',
        blocks: [
          'We process the following categories of personal data:',
          {
            list: [
              'Registration and account data: name, email address, password (encrypted), language preferences.',
              'Usage and viewing data: content watched, viewing history, playback progress, favourites, searches, interactions with the Platform.',
              'Technical and device data: IP address, device identifiers, browser and operating system, connection data and system logs.',
              'Payment data (when enabled): handled by our payment provider; SANDR does not store full card details. [TO BE COMPLETED WITH LEGAL COUNSEL: payment processing details].',
              'Cookies and similar technologies: see our Cookie Policy.',
            ],
          },
        ],
      },
      {
        heading: 'Purposes of processing',
        blocks: [
          'Personal data is processed for the following purposes:',
          {
            list: [
              'Providing the service and managing the account (registration, authentication, content access).',
              'Managing subscriptions, pay-per-view purchases and payments.',
              'Personalising the experience and content recommendations (profiling), subject to consent.',
              'Sending marketing and promotional communications, subject to consent.',
              'Statistical analysis and improvement of the Platform (analytics).',
              'Compliance with legal, tax and accounting obligations.',
              'Platform security, fraud and abuse prevention.',
            ],
          },
        ],
      },
      {
        heading: 'Legal basis',
        blocks: [
          'Each purpose relies on a specific legal basis:',
          {
            list: [
              'Performance of a contract (Art. 6.1.b GDPR): service delivery, account management, subscriptions and payments.',
              'Consent (Art. 6.1.a GDPR): marketing, profiling, sharing with selected partners. Consent can be withdrawn at any time.',
              'Legitimate interest (Art. 6.1.f GDPR): aggregated analytics, security, fraud prevention, service improvement.',
              'Legal obligation (Art. 6.1.c GDPR): tax, accounting and statutory compliance.',
            ],
          },
        ],
      },
      {
        heading: 'Processing methods and security',
        blocks: [
          'Data is processed using electronic tools and appropriate technical and organisational measures to ensure security, confidentiality and integrity, including encryption in transit, role-based access control and database Row Level Security.',
          'Access to data is restricted to authorised personnel and processors bound by confidentiality obligations.',
        ],
      },
      {
        heading: 'Data retention',
        blocks: [
          'Data is retained for as long as necessary for the purposes for which it was collected and within statutory limits:',
          {
            list: [
              'Account data: for the duration of the relationship and thereafter for [TO BE COMPLETED WITH LEGAL COUNSEL: period, e.g. 12 months] after deletion.',
              'Billing and tax data: [TO BE COMPLETED: e.g. 10 years] as required by law.',
              'Usage and analytics data: [TO BE COMPLETED: period].',
              'Consent-based data: until consent is withdrawn or [TO BE COMPLETED: period].',
            ],
          },
        ],
      },
      {
        heading: 'Disclosure and transfer of data',
        blocks: [
          'Data may be processed by providers acting as processors (sub-processors), including:',
          {
            list: [
              'Supabase — database hosting and authentication (EU/Ireland data centres).',
              'Cloudflare — video streaming and CDN.',
              'Payment provider (e.g. Stripe) — future payment processing.',
              'Email service provider — transactional and, subject to consent, marketing communications.',
              '[TO BE COMPLETED WITH LEGAL COUNSEL: any other providers].',
            ],
          },
          'Some providers may process data outside the European Economic Area. In such cases the transfer is supported by appropriate safeguards under Art. 44 et seq. GDPR, in particular the Standard Contractual Clauses (SCC) approved by the European Commission. [TO BE COMPLETED WITH LEGAL COUNSEL: safeguard details].',
        ],
      },
      {
        heading: 'Your rights',
        blocks: [
          'As a data subject you have the right, within the limits of the law, to:',
          {
            list: [
              'Access your personal data (Art. 15).',
              'Rectify inaccurate data (Art. 16).',
              'Erase your data / right to be forgotten (Art. 17).',
              'Restrict processing (Art. 18).',
              'Data portability (Art. 20).',
              'Object to processing (Art. 21).',
              'Withdraw consent at any time, without affecting the lawfulness of processing based on consent before withdrawal.',
              'Lodge a complaint with the supervisory authority (Garante per la protezione dei dati personali).',
            ],
          },
        ],
      },
      {
        heading: 'How to exercise your rights',
        blocks: [
          'You can exercise your rights by writing to [TO BE COMPLETED WITH LEGAL COUNSEL: email/contact method for privacy requests]. We will respond within the timeframes set by the GDPR (generally within one month).',
        ],
      },
      {
        heading: 'Cookies',
        blocks: [
          'The Platform uses necessary technical cookies and, subject to consent, analytics, profiling and marketing cookies. For more information see the Cookie Policy.',
        ],
      },
      {
        heading: 'Minors and minimum age',
        blocks: [
          'The Platform may include content reserved for an adult audience (e.g. sports betting widgets). The minimum age for registration is 18. We do not knowingly collect data from persons under 18; should we become aware of such processing, we will delete the data.',
        ],
      },
      {
        heading: 'Changes to this policy',
        blocks: [
          'We may update this policy for regulatory or service reasons. Changes will be published on this page with the update date; we will give appropriate notice of any material changes.',
        ],
      },
      {
        heading: 'Contacts and DPO',
        blocks: [
          'For any request regarding the processing of personal data you can contact the Controller at the details above or the Data Protection Officer (DPO): [TO BE COMPLETED WITH LEGAL COUNSEL: DPO contact].',
        ],
      },
    ],
  },
};
