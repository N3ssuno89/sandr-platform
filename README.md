# SANDR Platform

Media network e piattaforma streaming per beach volley e sand sports.

> Leggere sempre [`CLAUDE.md`](./CLAUDE.md) prima di qualsiasi modifica: contiene
> identità visiva, stack obbligatorio e regole di sviluppo non derogabili.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** — palette e font SANDR in `tailwind.config.ts`
- **Supabase** — Auth + PostgreSQL + RLS (`supabase/migrations/`)
- **Cloudflare Stream** — live (RTMP → HLS) + VOD
- **Stripe** — abbonamenti + pay-per-view
- **next-intl** — i18n italiano (default) + inglese

## Struttura

```
src/
  app/[locale]/        Rotte localizzate (App Router)
    page.tsx           Landing pubblica
    pricing/           Abbonamenti (pubblica)
    live/ live/[id]/   Eventi live (auth)
    vod/ vod/[id]/     Libreria VOD (auth)
    interviews/        Interviste (auth)
    dashboard/         Pannello admin (auth)
    broadcast/         Pannello broadcaster (auth)
    login/             Login (placeholder)
  components/          Layout + UI (placeholder)
  config/              Costanti statiche del sito
  i18n/                Configurazione next-intl
  lib/                 Client Supabase / Stripe / Cloudflare + env
  types/               Tipi di dominio e tipi DB
messages/              Traduzioni it / en
supabase/migrations/   Schema + RLS
```

## Ruoli utente

`viewer` · `broadcaster` · `admin` — applicati via Supabase RLS
(vedi `supabase/migrations/0001_initial_schema.sql`).

## Sviluppo

```bash
cp .env.example .env.local   # compilare con i valori reali
npm install
npm run dev
```

## Deploy

- **Staging**: preview automatico Netlify su branch (`netlify.toml`).
- **Produzione**: deploy **manuale**, solo su approvazione del founder.
