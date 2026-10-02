// Feature flags del sito. UNICO punto di verità per attivare/disattivare feature.
// I flag NEXT_PUBLIC_* sono leggibili anche lato client (inlined a build-time).

// Contenuti DIMOSTRATIVI (dirette/interviste di prova): ACCESO in anteprima
// Netlify e in locale, SPENTO in produzione (vedi netlify.toml). Quando è spento
// il sito NON mostra nulla di finto.
export const DEMO_CONTENT = process.env.NEXT_PUBLIC_DEMO_CONTENT === 'true';

// Integrazioni esterne future: tenute dietro flag (oggi spente). Nessuna sezione
// FantaBeach/ScoutAI/Fivbeach viene mostrata finché non vengono accese.
export const FANTABEACH = process.env.NEXT_PUBLIC_FEATURE_FANTABEACH === 'true';
export const SCOUTAI = process.env.NEXT_PUBLIC_FEATURE_SCOUTAI === 'true';
export const FIVBEACH = process.env.NEXT_PUBLIC_FEATURE_FIVBEACH === 'true';

export const features = {
  demoContent: DEMO_CONTENT,
  fantabeach: FANTABEACH,
  scoutai: SCOUTAI,
  fivbeach: FIVBEACH,
} as const;
