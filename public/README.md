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
