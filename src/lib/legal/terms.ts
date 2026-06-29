import type { LocalizedDoc } from './types';

// Termini di Servizio (bozza tecnica). Modellati su termini tipo DAZN.
export const termsContent: LocalizedDoc = {
  it: {
    title: 'Termini di Servizio',
    updated: 'Ultimo aggiornamento: [DA COMPLETARE CON IL LEGALE: data]',
    intro: [
      'I presenti Termini di Servizio ("Termini") regolano l’accesso e l’utilizzo della piattaforma di streaming sportivo SANDR ("Piattaforma"), disponibile su sandr.tv. Utilizzando la Piattaforma accetti i presenti Termini.',
    ],
    sections: [
      {
        heading: 'Oggetto del servizio',
        blocks: [
          'SANDR offre un servizio di streaming di contenuti sportivi (dirette, replay, highlights, interviste e contenuti correlati), con contenuti gratuiti, in abbonamento (premium) e ad acquisto singolo (pay-per-view).',
          'Alcuni contenuti possono includere widget informativi di scommesse sportive forniti da terze parti, riservati a un pubblico adulto.',
        ],
      },
      {
        heading: 'Registrazione e account',
        blocks: [
          'Per accedere a determinate funzionalità è necessario registrare un account fornendo dati veritieri e aggiornati. L’età minima per la registrazione è 18 anni.',
          'Sei responsabile della riservatezza delle credenziali e di ogni attività svolta tramite il tuo account. Notificaci tempestivamente qualsiasi uso non autorizzato.',
        ],
      },
      {
        heading: 'Abbonamenti e pagamenti',
        blocks: [
          {
            list: [
              'Abbonamento premium: consente l’accesso ai contenuti premium per la durata del periodo sottoscritto.',
              'Pay-per-view (PPV): consente l’accesso a un singolo evento per il periodo indicato.',
              'Prova gratuita 24h: ove offerta, consente l’accesso premium per 24 ore; al termine, salvo disdetta, l’abbonamento prosegue a pagamento.',
              'Rinnovo automatico: gli abbonamenti si rinnovano automaticamente alla scadenza salvo disdetta nei termini indicati.',
              'Recesso: puoi esercitare il diritto di recesso nei termini di legge. [DA COMPLETARE CON IL LEGALE: modalità e termini di recesso, rimborsi].',
            ],
          },
          'I pagamenti sono gestiti tramite fornitore terzo. I prezzi e le condizioni economiche sono indicati nella sezione abbonamenti. [DA COMPLETARE CON IL LEGALE: condizioni economiche, IVA, fatturazione].',
        ],
      },
      {
        heading: 'Uso consentito e divieti',
        blocks: [
          'Ti impegni a utilizzare la Piattaforma in modo lecito. In particolare è vietato:',
          {
            list: [
              'Registrare, riprodurre, ridistribuire o comunicare al pubblico i contenuti senza autorizzazione.',
              'Eludere misure tecniche di protezione o di controllo accessi.',
              'Condividere le credenziali o l’accesso con soggetti terzi oltre i limiti consentiti.',
              'Utilizzare strumenti automatizzati per estrarre dati o contenuti.',
            ],
          },
        ],
      },
      {
        heading: 'Proprietà intellettuale',
        blocks: [
          'I contenuti, i marchi, i loghi e il software della Piattaforma sono protetti da diritti di proprietà intellettuale di SANDR o dei rispettivi titolari. L’abbonamento concede una licenza limitata, personale e non trasferibile all’uso dei contenuti per finalità non commerciali.',
        ],
      },
      {
        heading: 'Contenuti di terzi',
        blocks: [
          'La Piattaforma può includere contenuti, link o widget di terze parti (es. federazioni, organizzatori, partner di scommesse). SANDR non è responsabile dei contenuti e dei servizi di terzi, soggetti ai relativi termini.',
        ],
      },
      {
        heading: 'Limitazione di responsabilità',
        blocks: [
          'La Piattaforma è fornita "così com’è". Nei limiti consentiti dalla legge, SANDR non garantisce la continuità ininterrotta del servizio e non è responsabile per interruzioni, malfunzionamenti o indisponibilità dei contenuti dovuti a cause non imputabili. [DA COMPLETARE CON IL LEGALE: clausole di limitazione e manleva].',
        ],
      },
      {
        heading: 'Sospensione e cessazione dell’account',
        blocks: [
          'Possiamo sospendere o cessare l’account in caso di violazione dei presenti Termini, di legge o di uso fraudolento. Puoi richiedere la cancellazione del tuo account in qualsiasi momento.',
        ],
      },
      {
        heading: 'Legge applicabile e foro competente',
        blocks: [
          'I presenti Termini sono regolati dalla legge italiana. Per ogni controversia è competente il foro di [DA COMPLETARE CON IL LEGALE: foro competente], fatte salve le disposizioni inderogabili a tutela del consumatore.',
        ],
      },
      {
        heading: 'Modifiche ai Termini',
        blocks: [
          'Potremo modificare i presenti Termini per esigenze normative o di servizio. Le modifiche saranno pubblicate su questa pagina; l’uso continuato della Piattaforma dopo la pubblicazione costituisce accettazione.',
        ],
      },
    ],
  },
  en: {
    title: 'Terms of Service',
    updated: 'Last updated: [TO BE COMPLETED WITH LEGAL COUNSEL: date]',
    intro: [
      'These Terms of Service ("Terms") govern access to and use of the SANDR sports streaming platform (the "Platform"), available at sandr.tv. By using the Platform you accept these Terms.',
    ],
    sections: [
      {
        heading: 'Service',
        blocks: [
          'SANDR provides a streaming service for sports content (live, replays, highlights, interviews and related content), with free, subscription (premium) and single-purchase (pay-per-view) content.',
          'Some content may include third-party sports betting information widgets, reserved for an adult audience.',
        ],
      },
      {
        heading: 'Registration and account',
        blocks: [
          'To access certain features you must register an account providing accurate, up-to-date information. The minimum age for registration is 18.',
          'You are responsible for keeping your credentials confidential and for all activity carried out through your account. Notify us promptly of any unauthorised use.',
        ],
      },
      {
        heading: 'Subscriptions and payments',
        blocks: [
          {
            list: [
              'Premium subscription: grants access to premium content for the subscribed period.',
              'Pay-per-view (PPV): grants access to a single event for the indicated period.',
              '24h free trial: where offered, grants premium access for 24 hours; afterwards, unless cancelled, the subscription continues on a paid basis.',
              'Automatic renewal: subscriptions renew automatically on expiry unless cancelled within the stated terms.',
              'Withdrawal: you may exercise your right of withdrawal within the legal terms. [TO BE COMPLETED WITH LEGAL COUNSEL: withdrawal terms, refunds].',
            ],
          },
          'Payments are handled by a third-party provider. Prices and terms are shown in the subscriptions section. [TO BE COMPLETED WITH LEGAL COUNSEL: pricing, VAT, invoicing].',
        ],
      },
      {
        heading: 'Permitted use and prohibitions',
        blocks: [
          'You agree to use the Platform lawfully. In particular, you must not:',
          {
            list: [
              'Record, reproduce, redistribute or communicate content to the public without authorisation.',
              'Circumvent technical protection or access-control measures.',
              'Share credentials or access with third parties beyond permitted limits.',
              'Use automated tools to extract data or content.',
            ],
          },
        ],
      },
      {
        heading: 'Intellectual property',
        blocks: [
          'The content, trademarks, logos and software of the Platform are protected by intellectual property rights of SANDR or their respective owners. The subscription grants a limited, personal, non-transferable licence to use the content for non-commercial purposes.',
        ],
      },
      {
        heading: 'Third-party content',
        blocks: [
          'The Platform may include third-party content, links or widgets (e.g. federations, organisers, betting partners). SANDR is not responsible for third-party content and services, which are subject to their own terms.',
        ],
      },
      {
        heading: 'Limitation of liability',
        blocks: [
          'The Platform is provided "as is". To the extent permitted by law, SANDR does not guarantee uninterrupted service and is not liable for interruptions, malfunctions or content unavailability due to causes beyond its control. [TO BE COMPLETED WITH LEGAL COUNSEL: limitation and indemnity clauses].',
        ],
      },
      {
        heading: 'Suspension and termination',
        blocks: [
          'We may suspend or terminate the account in case of breach of these Terms, of the law or of fraudulent use. You may request deletion of your account at any time.',
        ],
      },
      {
        heading: 'Governing law and jurisdiction',
        blocks: [
          'These Terms are governed by Italian law. Any dispute is subject to the jurisdiction of [TO BE COMPLETED WITH LEGAL COUNSEL: competent court], without prejudice to mandatory consumer protection provisions.',
        ],
      },
      {
        heading: 'Changes to the Terms',
        blocks: [
          'We may amend these Terms for regulatory or service reasons. Changes will be published on this page; continued use of the Platform after publication constitutes acceptance.',
        ],
      },
    ],
  },
};
