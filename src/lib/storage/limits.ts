// Limite dimensione upload immagini (foto atleti, loghi, copertine).
//
// PERCHÉ: oltre questa soglia il POST della server action viene rifiutato con
// 500 PRIMA di raggiungere il codice (limite bodySizeLimit di Next + il cap
// delle Netlify Functions, ~6MB). Quindi blocchiamo lato client con un messaggio
// chiaro e, per difesa, anche lato server. Modulo puro: nessuna dipendenza
// server-only, importabile sia da client che da server.
export const MAX_UPLOAD_MB = 5;
export const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;
