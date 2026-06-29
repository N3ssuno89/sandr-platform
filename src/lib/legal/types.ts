// Tipi per i documenti legali (privacy, termini, cookie). Contenuto bilingue
// renderizzato da LegalDocument. I segnaposto [DA COMPLETARE ...] vanno
// compilati dal legale prima della pubblicazione.
export type LegalBlock = string | { list: string[] };

export type LegalSection = {
  heading: string;
  blocks: LegalBlock[];
};

export type LegalDoc = {
  title: string;
  updated: string;
  intro: string[];
  sections: LegalSection[];
};

export type LocalizedDoc = Record<'it' | 'en', LegalDoc>;
