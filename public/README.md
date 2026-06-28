# public/

Asset statici serviti alla radice del sito.

## logo.png

Navbar e Footer referenziano `/logo.png` tramite `next/image`.
Caricare qui manualmente il file `logo.png` (sfondo trasparente consigliato).

- Navbar: renderizzato a 32px di altezza (`h-8 w-auto`)
- Footer: renderizzato a 28px di altezza (`h-7 w-auto`)

Finché il file non è presente l'immagine restituirà 404, ma il layout
è già predisposto.

## Cloudflare Stream — variabili Netlify

AREA CRITICA (CLAUDE.md): integrazione Cloudflare Stream, richiede review umana.

Su Netlify (Environment variables) impostare:

- `CLOUDFLARE_ACCOUNT_ID` — `c1b5a9ac7f7e4d9f801d21e2e008cc54` (server-side)
- `CLOUDFLARE_STREAM_TOKEN` — token API Stream (server-side, MAI esporre al client)
- `NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID` — **stesso valore** di `CLOUDFLARE_ACCOUNT_ID`
  (`c1b5a9ac7f7e4d9f801d21e2e008cc54`), necessario lato client per l'embed iframe.

Senza queste variabili il sito funziona comunque: la libreria VOD usa dati
mock e le pagine video mostrano "Video non disponibile".

## Supabase — video, tag e storage copertine

AREA CRITICA (CLAUDE.md): Supabase Auth/ruoli e accesso contenuti, review umana.

I video e i loro metadati/tag sono ora la **source of truth su Supabase**
(tabelle `videos`, `video_tags`, `video_athletes`, `sports`, `federations`,
`athletes`). Cloudflare Stream conserva SOLO il file video (via `cloudflare_uid`).

Migrazioni da applicare (Supabase SQL editor, in ordine):
- `supabase/migrations/0001_complete_schema.sql`
- `supabase/migrations/0002_enum_helpers.sql` (RPC enum + bucket storage)

### Storage bucket copertine

Creare un bucket **pubblico** chiamato `video-thumbnails` (lo fa anche la
migration 0002):

1. Supabase → Storage → New bucket → nome `video-thumbnails`, **Public** = ON.
2. Le copertine (card 16:9 + in evidenza 21:9) vengono caricate server-side con
   la **service role** (`SUPABASE_SERVICE_ROLE_KEY`, MAI esposta al client) e
   servite via URL pubblico `…/storage/v1/object/public/video-thumbnails/…`.

### Variabili Netlify (Supabase)

- `NEXT_PUBLIC_SUPABASE_URL` — URL del progetto (client + server)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon key (client + server)
- `SUPABASE_SERVICE_ROLE_KEY` — service role (SOLO server: scritture admin,
  upload copertine, lettura completa per il display). MAI esporre al client.

Senza queste variabili il sito builda comunque: le sezioni video usano dati
mock (dev mode) e le scritture admin rispondono `not-configured`.
