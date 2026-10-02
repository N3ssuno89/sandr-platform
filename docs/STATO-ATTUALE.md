# SANDR — Stato attuale del codice (fotografia)

> Documento di sola analisi. **Nessun file di codice è stato modificato** per produrlo.
> Data: 2026-10-02 · Branch fotografato: **`origin/main`** (HEAD `f0fb6c0`, PR #72).
> Metodo: audit read-only, ogni affermazione è citata con `file:riga`.
> Legenda stato: **[IMPLEMENTATO]** funziona davvero · **[PARZIALE]** · **[SOLO UI]** interfaccia presente ma dati finti/mock/hardcoded · **[ASSENTE]** · *non verificato* quando non confermabile.

> ⚠️ **Nota di scope.** Il container ha fatto checkout del branch di sviluppo `claude/clever-shannon-h9d8wk`, che è uno **scaffold iniziale** (1 migrazione, ~13 rotte) rimasto indietro di 83 commit rispetto a `main`. Su indicazione dell'utente la fotografia è stata fatta sul codice **reale di `main`**, non sullo scaffold.

---

## 1. Stack e struttura

**Framework & linguaggi** — Next.js **14.2.35** (App Router) + TypeScript **5** (`tsconfig.json`, `strict: true`), React **18.3.1**. Build-tool Next nativo. (`package.json`)

**Librerie rilevanti** (`package.json`):
- `next-intl` ^3.20 (3.26 installato) — i18n IT/EN.
- `@supabase/ssr` ^0.5.2 + `@supabase/supabase-js` — Auth + DB + Storage.
- `stripe` ^17.2 (server) + `@stripe/stripe-js` ^4.8 (client) — **solo installati, non cablati** (vedi §6).
- `tailwindcss` ^3.4 — palette/font SANDR in `tailwind.config.ts`.
- Nessun Docker, nessuna libreria di state management (no Redux) — coerente con CLAUDE.md.

**Struttura cartelle** (`src/`, ~13.366 LOC TS/TSX):
- `src/app/layout.tsx` (root pass-through) + `src/app/[locale]/` — **43** `page.tsx`/route localizzate + `src/app/api/stream/` (3 route).
- `src/components/` — **55** componenti: `account/`, `admin/` (15), `auth/`, `cards/`, `layout/`, `legal/`, `live/`, `player/`, `pricing/`, `sections/` (22), `ui/`.
- `src/lib/` — **37** moduli: `access/`, `admin/`, `analytics/`, `cloudflare/` + `cloudflare-stream.ts`, `events/`, `legal/`, `public/`, `reference/`, `storage/`, `stripe/`, `supabase/`, `tracking/`, `user/`, `videos/`, `mock-*.ts`, `env.ts`, `layout.ts`.
- `src/types/` (5: `database.ts`, `athlete.ts`, `federation.ts`, `tags.ts`, `index.ts`), `src/config/site.ts`, `src/i18n/`, `src/middleware.ts`.
- `supabase/migrations/` — **12** migrazioni (`0001`→`0012`). `messages/` — `it.json` + `en.json`.

**Build/deploy**: `netlify.toml` → `@netlify/plugin-nextjs`, `NODE_VERSION=20`; preview automatici su branch; **produzione manuale** (`[context.production]` vuoto di proposito). README/CLAUDE.md coerenti.

### 1b. Variabili d'ambiente e script

Tutte le env usate sono dichiarate in `.env.example` (nessun mismatch). `src/lib/env.ts` centralizza gli accessi con helper `required(name,value)` che lancia errore esplicito (regola #9 CLAUDE.md); `siteUrl` ha fallback `https://sandr.tv`.

**NEXT_PUBLIC_* (client, 6)**: `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID`¹, `NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_SUBDOMAIN`¹ (`src/lib/env.ts:14-48`).
**Server-only (6)**: `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`², `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_STREAM_TOKEN`, `CLOUDFLARE_STREAM_API_TOKEN`¹ (`src/lib/env.ts:21-44`).
¹ definite ma **mai consumate** · ² mai usata (nessun webhook Stripe).

**Osservazioni**: centralizzazione env incompleta — molti file (`supabase/admin.ts`, `middleware.ts`, `guard.ts`, `storage/actions.ts`, `cloudflare-stream.ts`, pagine dashboard, API route) leggono `process.env.*` direttamente invece di `@/lib/env`.

**npm scripts**: `dev`, `build`, `start`, `lint`, `type-check` (`tsc --noEmit`). **Nessuno script di test.**

---

## 2. Pagine e rotte

Ogni rotta pubblica è prefissata da `[locale]` (`it` default, `en`) — `src/i18n/routing.ts:5-8`.

### Routing / protezione
- **`src/middleware.ts`**: intl → `updateSession` Supabase (refresh sessione) → redirect a `/{locale}/login?redirect=…` se `!user` e rotta protetta (`:46-55`). Protegge **solo** `protectedRoutes = ['/dashboard','/broadcast']` (`src/config/site.ts:16`). Tutto il resto (inclusi `/live`, `/vod`, `/interviews`, `/athletes`, `/federations`) è pubblico (modello DAZN: paywall sul contenuto, non sulla navigazione). **Senza env Supabase `user=null` → nessuna protezione** (`:46`).
- **`roleRestrictedRoutes`** (`site.ts:19-22`) è **dichiarato ma MAI usato**. Nessun enforcement di ruolo nel middleware.
- **Admin**: gate in `src/app/[locale]/dashboard/admin/layout.tsx:16` via `requireAdminPage` (`src/lib/supabase/guard.ts:24-28`); in demo (Supabase non configurato) **non blocca** (`guard.ts:25`).
- **`/broadcast`**: protetto solo da login, **nessun check del ruolo broadcaster** applicativo (`broadcast/page.tsx`).
- **`auth/callback/route.ts`** (AREA CRITICA): `exchangeCodeForSession(code)` → `/dashboard/home` o `/login?error=auth` (`:23-35`).

### Tabella rotte
| Rotta | Accesso | Mostra | Dati | Stato | File:riga |
|---|---|---|---|---|---|
| `/{locale}` landing | Pubblico | Hero, circuiti, coverage, preview live/interviste, atleti, pricing | Copy i18n; circuiti hardcoded; sezioni live/atleti reali da Supabase con fallback mock | [PARZIALE] | `page.tsx:10,28` |
| `/login` | Pubblico | Form login/registrazione | Reale `signUp`/`signInWithPassword` | [IMPLEMENTATO] | `login/page.tsx:38`; `AuthForm.tsx:72,93` |
| `/pricing` | Pubblico | Piani Free/Premium/PPV, FAQ | Prezzi da i18n; **no Stripe**, CTA→`/login` | [SOLO UI] | `pricing/page.tsx:9`; `PricingBoard.tsx:168` |
| `/live` | Pubblico | Board eventi live | **Array hardcoded**, nessun fetch | [SOLO UI] | `live/page.tsx:6`; `LiveBoard.tsx:7-13` |
| `/live/[id]` | Pubblico | Player live + chat/stats/odds/upcoming | Tutto mock; player placeholder (no HLS) | [SOLO UI] | `live/[id]/page.tsx:6,54,96-117` |
| `/vod` | Pubblico | Libreria VOD | Reale `getVideosForDisplay()`; mock fallback | [IMPLEMENTATO] c/fallback | `vod/page.tsx:27,41` |
| `/vod/[id]` | Pubblico (paywall sul contenuto) | Player VOD + tracking | Reale + Cloudflare uid; **access check server-side** nega l'uid ai non autorizzati | [IMPLEMENTATO] | `vod/[id]/page.tsx:47,73` |
| `/athletes`, `/athletes/[id]` | Pubblico | Indice/profilo atleta + video | Reale Supabase; mock fallback | [IMPLEMENTATO] c/fallback | `athletes/[id]/page.tsx:50,141` |
| `/federations`, `/federations/[id]` | Pubblico | Indice/hero circuito + video/atleti/eventi | Reale Supabase; mock fallback | [IMPLEMENTATO] c/fallback | `federations/[id]/page.tsx:34,66` |
| `/interviews` | Pubblico | PageHeader + EmptyState | Nessun fetch, placeholder | [ASSENTE] | `interviews/page.tsx:15` |
| `/privacy`, `/terms`, `/cookie-policy` | Pubblico | Testi legali bilingue | Statici da `lib/legal/*` (**bozze**, placeholder `[DA COMPLETARE]`) | [SOLO UI] | `privacy/page.tsx:8` |
| `/broadcast` | Login (no check ruolo) | Solo PageHeader | Placeholder | [ASSENTE] | `broadcast/page.tsx:15` |
| `/dashboard` | Autenticato | Solo PageHeader | Placeholder | [ASSENTE] | `dashboard/page.tsx:15` |
| `/dashboard/home` | Autenticato | Hero carousel, continue watching, righe video/atleti | Reale Supabase; mock fallback | [IMPLEMENTATO] c/fallback | `dashboard/home/page.tsx:21-53` |
| `/dashboard/profile` | Autenticato | Profilo | Reale `getMyProfile()` | [IMPLEMENTATO] | `profile/page.tsx:14` |
| `/dashboard/settings` | Autenticato | Form impostazioni | Profilo reale; toggle notifiche MOCK | [PARZIALE] | `settings/page.tsx:20` |
| `/dashboard/subscription` | Autenticato (CRITICA) | Stato abbonamento + storico PPV | Reale subscriptions/ppv_purchases; **prezzo "9,99€" MOCK**, no checkout | [PARZIALE] | `subscription/page.tsx:66,135` |
| `/dashboard/payment` | Autenticato (CRITICA) | Metodo pagamento | **Interamente MOCK** ("•••• 4242") | [SOLO UI] | `payment/page.tsx:5,30` |
| `/dashboard/ppv-history` | Autenticato | — | `redirect()`→subscription | n/a | `ppv-history/page.tsx:6` |
| `/dashboard/favorites` | Autenticato | Preferiti | **MOCK** (feature non in schema) | [ASSENTE] | `favorites/page.tsx:4` |
| `/dashboard/watch-history` | Autenticato | Cronologia visione | Reale `getMyWatchHistory()` | [IMPLEMENTATO] | `watch-history/page.tsx:9` |
| `/dashboard/reminders` | Autenticato | Reminder + elimina | Reale `getMyReminders()` | [IMPLEMENTATO] | `reminders/page.tsx:8` |
| `/dashboard/admin` | Admin | 4 stat card + video | Reale `getAdminDashboard()` (conteggi Supabase) | [IMPLEMENTATO] | `admin/page.tsx:15` |
| `/dashboard/admin/videos` (+ `add`, `[id]/edit`) | Admin | Lista/crea/modifica video | Reale; salva via `saveVideo` (service role) | [IMPLEMENTATO] | `videos/add/page.tsx:12` |
| `/dashboard/admin/videos/upload` | Admin | — | `redirect()`→`add` | n/a | `videos/upload/page.tsx:6` |
| `/dashboard/admin/live` | Admin | Dirette programmate + crea | `getLiveVideos()` reale; **"Crea diretta" MOCK/disabilitato** | [PARZIALE] | `admin/live/page.tsx:36` |
| `/dashboard/admin/users` | Admin | Gestione utenti + ruolo | Reale `getUsers()` (service role) | [IMPLEMENTATO] | `admin/users/page.tsx:10` |
| `/dashboard/admin/subscriptions` | Admin | Overview abbonamenti | Conteggi reali; **MRR/Churn MOCK** (Stripe pending) | [PARZIALE] | `admin/subscriptions/page.tsx:18` |
| `/dashboard/admin/athletes` (+ `new`, `[id]/edit`) | Admin | CRUD atleti | Reale Supabase | [IMPLEMENTATO] | `admin/athletes/page.tsx:16` |
| `/dashboard/admin/events` (+ `new`, `[id]/edit`) | Admin | CRUD eventi | Reale Supabase | [IMPLEMENTATO] | `admin/events/page.tsx:20` |
| `/dashboard/admin/federations` (+ `new`, `[id]/edit`) | Admin | CRUD federazioni | Reale Supabase | [IMPLEMENTATO] | `admin/federations/page.tsx:19` |
| `/api/stream/*` (3) | **Non protette dal middleware** (`/api` escluso dal matcher) | Vedi §5 | — | — | `api/stream/*/route.ts` |

**Note**: commenti in `live`/`interviews` dicono "rotta autenticata" ma **non lo sono**. In demo mode (Supabase assente) il middleware non protegge nulla e l'admin gate non blocca (ma le action richiedono comunque `getAdminContext`).

---

## 3. Database Supabase

RLS abilitata su **tutte** le tabelle (`0001:417-438`, `0009:46`). Estensione `pgcrypto` (`0001:16`). Fonte: migrazioni `0001`→`0012` + `src/types/database.ts`.

### 3.1 Tabelle (per area) — [IMPLEMENTATO]
- **Auth/utenti**: `profiles` (`0001:50-61`, estende `auth.users`; `role user_role default 'viewer'`, `stripe_customer_id`…) + 10 colonne GDPR (`0009:11-21`).
- **Anagrafiche sportive**: `sports` (`0001:64`), `federations` (`0001:73`), `athletes` (`0001:122`; +`is_featured` `0005`, +`birth_date` `0008`), `events` (tornei/competizioni, `0001:139`).
- **Broadcaster/revenue**: `broadcasters` (`0001:89`, revenue-share/referral), `broadcaster_federations` M:N (`0001:115`).
- **Video**: `videos` (`0001:157`; `cloudflare_uid`, `access_level`, `ppv_price`, `is_live`, `status`, `view_count`; +`quality_level` `0009`, +`thumbnail_mobile_url` `0012`), `video_broadcasters`/`video_athletes`/`video_tags` (M:N, `0001:182-201`).
- **Match/scorekeeping live**: `matches` (`0001:204`; `team_a/b_name`, `score_a/b`, **`scorekeeper_token`**), `match_athletes` (`0001:224`), `score_events` (source of truth stats: point/ace/error/block… `0001:232`).
- **Pagamenti**: `subscriptions` (`0001:243`; +`trial_ends_at`/`is_trial` `0006` — logica Stripe NON implementata), `ppv_purchases` (`0001:257`), `referrals` (`0001:269`).
- **Engagement/varie**: `reminders` (`0001:280`), `watch_history` (`0001:291`; +`dismissed` `0011`), `platform_settings` (`0001:302`, formule revenue in jsonb), `fantasy_teams`/`fantasy_team_athletes` (`0001:310`), `analytics_events` (append-only, `0009:27`).

### 3.2 ENUM (`0001:21-28`)
`user_role`(viewer/broadcaster/admin/organizer), `content_type`(live/replay/interview/highlights/behind_scenes/documentary), `access_level`(free/premium/ppv), `video_status`, `subscription_plan`(free/premium), `subscription_status`, `match_status`, `score_event_type`. Gli **sport sono una tabella, non un enum** (`0002:7-9`).

### 3.3 RLS — [IMPLEMENTATO]
- `profiles`: self read/update + admin manage (`0001:447-454`); insert solo via trigger.
- Anagrafiche (sports/federations/broadcasters/athletes/events): **public read + admin write** (`0001:458-480`).
- `videos` (`0001:486-530`): free+ready pubblici; **premium** leggibili se subscription attiva; **ppv** se `ppv_purchase` valido; admin manage; broadcaster solo i **propri** (via `video_broadcasters`).
- `matches/score_events`: public read + admin manage; scritture scorekeeper via **service role** (bypassa RLS).
- Dati personali (subscriptions/ppv/referrals/watch_history/reminders/fantasy): self (scritti da webhook/service role).
- `analytics_events`: insert own/anon, select solo admin (`0009:49-60`).

### 3.4 RPC / trigger — [IMPLEMENTATO]
- `handle_updated_at()` trigger su 8 tabelle (`0001:33-41,601-616`).
- `is_admin()` / `current_user_role()` SECURITY DEFINER (anti-ricorsione RLS, `0001:330-350`).
- `handle_new_user()` trigger su `auth.users` (`0001:621`, **ridefinito** `0009:71-105` per persistere i consensi GDPR).
- `admin_add_enum_value()` (`0002:14-40`, whitelist `content_type`), `increment_video_view()` (`0010:9-18`).

### 3.5 Storage & seed
- 3 bucket pubblici: `video-thumbnails`, `athlete-photos`, `federation-logos` (`0002`, `0004`, `0007`) — **public read**, write solo admin (`0007:27-63`).
- Seed (`0003`): 4 sport; 7 federazioni (FIPAV, AIBVC, AVP, BPT, CEV, King & Queen, Marathon); 8 atleti reali; `platform_settings` revenue/ppv split.

### 3.6 Mappatura dominio
| Area | Stato | Tabella reale |
|---|---|---|
| Federazioni | [IMPLEMENTATO] | `federations` (+7 seed) |
| Circuiti/Tour | [PARZIALE] | Nessuna tabella `circuits`; modellati come `federations` e/o `events.stage` |
| Eventi/tornei | [IMPLEMENTATO] | `events` |
| Campi/courts | **[ASSENTE]** | Nessuna tabella campo; i match hanno solo `team_a/b_name` |
| Partite/match | [IMPLEMENTATO] | `matches` + `match_athletes` + `score_events` |
| Atleti | [IMPLEMENTATO] | `athletes` (+8 seed) |
| Statistiche | [IMPLEMENTATO] (derivate) | Nessuna tabella `stats`; derivate da `score_events` |
| Fantasy | [PARZIALE] | `fantasy_teams*` esistono, nessuna logica punteggio |

### 3.7 Divergenza CLAUDE.md ↔ schema reale (IMPORTANTE)
CLAUDE.md dichiara tabelle **che non corrispondono** al reale: `tournaments` **non esiste** (→ `events`); `stats` **non esiste** (→ derivate da `score_events`); `users` **non esiste** (→ `profiles`); `matches` esiste ma con struttura diversa (no `stream_key`/`access_type` sul match — lo stream vive su `videos`); `athletes` ha `ranking/season_points` non `fivb_ranking/current_partner`. **CLAUDE.md è disallineato e va aggiornato.**

### 3.8 `src/types/database.ts`
File **scritto a mano** (non generato), **allineato** a tutte le migrazioni 0001-0012 (colonne, `analytics_events`, 8 enum, 2 RPC). Rischio **drift** manuale su migrazioni future; `match_athletes.team`/`score_events.team` tipizzati `string` invece di `char(1) in ('A','B')`.

---

## 4. Utenti e accesso

### 4.1 Registrazione / Login — [IMPLEMENTATO]
Email+password reale: `signInWithPassword` (`AuthForm.tsx:93`), `signUp` con conferma email (`AuthForm.tsx:72-86`), callback `exchangeCodeForSession` (`auth/callback/route.ts:29`). Logout (`Navbar.tsx:147`), reset password (`SettingsForm.tsx:59`). **OAuth Google/Apple = [SOLO UI]** (bottoni `disabled` "coming soon", `AuthForm.tsx:145-167`); nessun magic link. Password: solo `minLength=6`. Flusso auth gira **lato client** (accettabile per Supabase Auth; token nei cookie, riletto da middleware/server).

**Client Supabase**: `server.ts:14` (SSR cookie), `client.ts:12` (browser), `admin.ts:9` (service-role, `server-only`, bypassa RLS), `middleware.ts:11` (refresh sessione).

### 4.2 Ruoli — [IMPLEMENTATO]
Enum `user_role` + `profiles.role default 'viewer'`. Profilo creato al signup dal trigger `handle_new_user()` (sempre `viewer` → broadcaster/admin assegnati manualmente). Verifica server-side: `getCurrentUserRole()`, `requireAdminPage()`, `getAdminContext()` (`guard.ts:9-55`). **Attenzione**: `broadcaster` ha **bypass completo del paywall** su tutto il catalogo (commento "per ora sviluppo", `check.ts:28-30`).

### 4.3 Consensi / GDPR
- **Consensi signup su DB** [IMPLEMENTATO]: colonne consenso+timestamp (`0009:11-21`); form passa i consensi (`AuthForm.tsx:76-83`), trigger li persiste (`0009:97-101`); privacy+termini bloccanti.
- **Cookie banner** [PARZIALE]: `CookieBanner.tsx` salva la scelta **solo in un cookie** `sandr_cookie_consent` (180gg), **non su DB** → gap di accountability rispetto al consenso signup. Montato globalmente (`layout.tsx:79`).
- **Gating tracking** [IMPLEMENTATO lato server]: `analytics_events` scritto solo se `profiles.consent_profiling=true` (`tracking/actions.ts:97-103`) — usa il campo DB, non il cookie.
- **Pagine legali**: contenuto presente ma con placeholder `[DA COMPLETARE CON IL LEGALE]` (`terms.ts:70`, `privacy.ts:233`) → bozze non validate.
- **Age gate 18+ bloccante**: **non trovato** (disclaimer betting presente in `live/[id]/page.tsx:325`, ma nessun gate d'età) — *non verificato altrove*.

### 4.4 Paywall free/premium/ppv — DOVE è controllato
Logica pura `canAccessVideo()` (`check.ts:40-67`): admin/broadcaster bypass; free + `highlights` sempre liberi; premium→subscription attiva; ppv→acquisto valido; default nega.

- **VOD: enforcement SERVER-SIDE corretto** [IMPLEMENTATO]: `checkVideoAccess()` è `server-only` (`access/server.ts:1`); `vod/[id]/page.tsx:73` passa il `cloudflare_uid` al player **solo se `access.allowed`**, altrimenti stringa vuota → `<Paywall>`. **L'uid non raggiunge mai il client non autorizzato.** Demo mode (no Supabase) → sempre allowed (`server.ts:14-17`).
- **⚠️ Embed Cloudflare NON firmato** [PARZIALE — sicurezza]: l'embed è `https://iframe.cloudflarestream.com/{uid}` **pubblico, senza signed token** (`cloudflare-stream.ts:67-69`); nessun `requireSignedURLs`. Chi ottiene un `uid` (da contenuto free, log, enumerazione) può riprodurre il video su Cloudflare **aggirando il paywall**. La barriera applicativa è corretta ma manca la protezione al layer Cloudflare.
- **⚠️ Paywall LIVE ASSENTE** [ASSENTE — critico]: `live/[id]/page.tsx` è `'use client'` interamente mock, nessun `checkVideoAccess`, nessun uid.
- **Bypass broadcaster** [PARZIALE]: accesso totale applicativo (`check.ts:28-30`) **incoerente** con la RLS che lo limita ai propri video (`0001:517-530`).
- **Acquisto PPV nel Paywall** [SOLO UI]: bottone `disabled` "Disponibile a breve" (`Paywall.tsx:33-40`).
- **Rotte**: middleware protegge `/dashboard/*` e `/broadcast`; VOD/live pubblici (gating demandato alla pagina — ok VOD, assente live).

---

## 5. Video e dirette

### Cloudflare Stream
- **`src/lib/cloudflare-stream.ts`** [IMPLEMENTATO — quello usato]: `listVideos()`/`getVideo()` GET reali all'API CF con `Bearer CLOUDFLARE_STREAM_TOKEN` (`:32-61`), build-safe; `getEmbedUrl()` → iframe pubblico (`:67-69`); `getThumbnailUrl()` → `videodelivery.net` (`:72-74`). **Nessun signed token.**
- **`src/lib/cloudflare/stream.ts`** [ASSENTE/orfano]: helper HLS (`hlsManifestUrl`) **mai importato** → codice morto; usa env diverse (`CLOUDFLARE_STREAM_API_TOKEN`, subdomain).
- **RTMP / live ingest: [ASSENTE]** — nessun Live Input/stream key. Solo VOD.

### Player — [IMPLEMENTATO]
- `StreamPlayer.tsx` iframe via `getEmbedUrl`; `TrackingPlayer.tsx` carica l'SDK `embed.cloudflarestream.com/embed/sdk.latest.js`, eventi play/timeupdate/ended → `recordWatchProgress`/`recordEvent`, resume via `?startTime=Ns` (`:13,61,98-113`). Embed costruito **server-side dopo access check** (vedi §4.4).

### VOD — [IMPLEMENTATO]
`src/lib/videos/actions.ts`: source of truth = Supabase (`getVideosForDisplay`, `getVideoForPlayer`, `getVideosForAdmin`, `getAdminDashboard`); write admin-gated via `getAdminContext()`.
- **Upload a Cloudflare in-app** [PARZIALE/SOLO UI]: il workflow attuale è **upload esterno + link dell'UID** (`AddVideoFlow.tsx:94-96`); le thumbnail vanno su **Supabase Storage**, non CF. Le route `api/stream/upload-url` e `upload-thumbnail` sono **implementate ma ORFANE** (0 reference). `api/stream/list-with-status` è usata (admin).

### LIVE — [SOLO UI / MOCK]
- `/live` (`LiveBoard.tsx:7-13`) e `/live/[id]` interamente mock: nessun player CF (foto sfocata + overlay), chat seed statica, stats fittizie, quote Bet365 mock, play/pause via `useState`. Dati da `mockContent` type='live'.
- Admin live [PARZIALE]: "Dirette programmate" reali (`is_live`); "Crea diretta" `disabled` ("Cloudflare Live Input integration pending").

**Sintesi**: VOD = integrazione Cloudflare reale con gating server-side. **Live = interamente mock, nessun RTMP.** Upload CF non cablato.

---

## 6. Pagamenti

**Stripe = solo boilerplate, zero integrazione operativa** [ASSENTE funzionalmente].
- SDK istanziato (`stripe/server.ts:6`, `stripe/client.ts:7`) ma **nessun file importa `@/lib/stripe`** (0 reference). Nessun `checkout`/`subscriptions`/`customers`/`webhooks.constructEvent`. **Nessuna route webhook.** `STRIPE_WEBHOOK_SECRET` mai usata.
- **Pricing** [SOLO UI]: prezzi **hardcoded in i18n**, CTA→`/login`. Esatti: Free €0; **Premium €9,99/mese** (annuale €99,99/anno; landing mostra €7,99/mese equiv.); **PPV €2,99/evento** (`messages/*.json:199-229,384-407`).
- **Dashboard**: `payment` interamente MOCK ("•••• 4242"); `subscription` legge subscriptions/ppv_purchases reali ma prezzo "9,99€" MOCK e **nessun checkout**; admin/subscriptions conteggi reali ma **MRR/Churn MOCK**.
- **Acquisto PPV**: il **modello di accesso** PPV funziona in lettura (`ppv_purchases` → `canAccessVideo`), ma **non esiste flusso di acquisto** (bottone disabilitato). Accesso premium/PPV dipende quindi da **righe DB inserite manualmente**, non da Stripe.

---

## 7. Contenuti e promesse visibili

| Claim | Dove (file:riga) | Esiste davvero? | Stato |
|---|---|---|---|
| Beach Pro Tour / BPT | `page.tsx:16`; `it.json:162`; seed `0003:31` | Federazione reale in DB; sulla landing solo label | [PARZIALE] |
| AVP | `page.tsx:17`; `it.json:163` | **Nessuna** federazione AVP nel seed; solo copy | [SOLO UI] |
| CEV | `it.json:163` | Solo marketing | [SOLO UI] |
| Mondiali / World Champ. | `it.json:163` | Solo marketing | [SOLO UI] |
| Altri circuiti (FIPAV, AIBVC, K&Q, Marathon…) | `page.tsx:10-23`; seed `0003` | FIPAV/AIBVC/BPT/ecc. reali in DB; Freestyle/Snow Volley solo copy | [PARZIALE] |
| **Scommesse / Bet365** | `BettingPartnerSection.tsx`; `live/[id]/page.tsx:293-326` (logo + odds hardcoded `:43`) | **Nessuna integrazione**: quote hardcoded dietro gate, nessun feed/link affiliato/chiamata esterna. Il "widget Bet365" di CLAUDE.md **non esiste**. Disclaimer 18+ presenti | [SOLO UI] |
| Multi-view | `FeatureTabs.tsx:78-88` | Solo illustrazione (griglia copertine) | [SOLO UI] |
| Statistiche live | `FeatureTabs.tsx:108-137`; `live/[id]:270-289` | Hardcoded; **nessun Supabase Realtime** (0 occorrenze `realtime/channel`) | [SOLO UI] |
| Chat | `live/[id]/page.tsx:8-10,69` | Seed statico + stato locale, nessun backend | [SOLO UI] |
| Sondaggi / polls | `it.json:182` (solo copy) | Nessun componente/tabella/logica | [ASSENTE] |
| Voto MVP | `it.json:182` (solo copy) | Nessun componente/tabella/logica | [ASSENTE] |

---

## 8. Integrazioni esterne

**Realmente integrate**: **Supabase** [IMPLEMENTATO] (auth/query/tracking/RLS); **Cloudflare Stream** [IMPLEMENTATO] (fetch reali API, solo VOD); **Stripe** [PARZIALE] (SDK istanziato, **nessun call-site** — vedi §6).

**Grep richiesti**:
- **FIVB** — solo nome/tag di circuito (`it.json:163`, `tags.ts:9`, seed) e colonna `athletes.fivb_ranking`; **nessuna API FIVB**. [SOLO UI / dato statico]
- **FantaBeach** — [ASSENTE]: schema conservato "for future FantaBeach integration — UI intentionally removed" (`user/types.ts:26`, `Navbar.tsx:156`).
- **ScoutAI** — [ASSENTE] (0 occorrenze). **FIVBeach** — [ASSENTE] (0 occorrenze).
- Nessun'altra `fetch()` a terze parti (solo Cloudflare + `/api/stream/*`); nessun `axios`.

---

## 9. Lingue, SEO, analytics, cookie

- **Lingue** [IMPLEMENTATO]: next-intl IT default + EN (`routing.ts:5-8`). **Parità chiavi perfetta** (it.json/en.json stesso numero di chiavi, 0 drift).
- **SEO** [PARZIALE]: `metadata` statico con `metadataBase` + `openGraph` (`layout.tsx:30-47`). **Nessun `generateMetadata`** (no OG/titoli per-pagina), **nessun `sitemap`/`robots`**, nessun `openGraph.images`/twitter card.
- **Analytics** [PARZIALE]: **first-party DB**, nessuno script di terze parti (no gtag/plausible/posthog). `recordEvent()` inserisce in `analytics_events` **gated su consent_profiling** (`tracking/actions.ts:83-111`); `view_count` via RPC. Cablato nel player VOD (`TrackingPlayer.tsx`). Solo utenti loggati. (Nota: commento datato in `analytics/events.ts:6` "nessuna logica attiva" è fuorviante — quel file è solo tipi.)
- **Cookie banner** [IMPLEMENTATO]: renderizzato globalmente, cookie reale 180gg, 4 categorie opt-in, link a privacy/cookie-policy (vedi gap DB in §4.3).

---

## 10. Qualità (test, build, lint, TODO, dipendenze)

- **Test — [ASSENTE]**: nessun `*.test.*`/`*.spec.*`, nessun runner (vitest/jest/playwright), nessuna dep di testing. (`test.md` in root = stub orfano "Test Review Agent".)
- **TODO/FIXME/HACK/XXX — 0 occorrenze** in `src/`.
- **Build — ✅** `npm run build`: `✓ Compiled successfully`, `✓ Generating static pages (76/76)`, nessun warning/errore (dopo `npm install` — node_modules assente).
- **Lint — ✅** `npm run lint`: `✔ No ESLint warnings or errors`.
- **Type-check — ✅** `npm run type-check` (`tsc --noEmit`, strict): 0 errori.
- **Dead code / debito**: doppio modulo Cloudflare (`cloudflare/stream.ts` orfano), 2 API route orfane (`upload-url`, `upload-thumbnail`), 3 accessor env mai usati, `test.md` stub, CLAUDE.md disallineato. 28 `eslint-disable` (27 = `no-img-element`, scelta deliberata `<img>`; 1 `exhaustive-deps`). Nessun `@ts-ignore`.
- **⚠️ Dipendenze — `npm install` segnala 12 vulnerabilità (1 critica, 8 high, 3 moderate)** (non è stato eseguito `audit fix`). Major indietro: `stripe` 17→23 e `@stripe/stripe-js` 4→10 (**rilevante per l'area critica pagamenti**), `next-intl` 3→4, `@supabase/ssr` 0.5→0.12, `react` 18→19, `tailwind` 3→4 (3 coerente con CLAUDE.md), `eslint` 8 (EOL). `next` 14.2.35 è una patch recente.

---

## Tabella riassuntiva

| Area | Stato | File principali | Note |
|---|---|---|---|
| Stack & struttura | [IMPLEMENTATO] | `package.json`, `next.config.mjs`, `src/lib/env.ts` | Next 14.2.35, no Docker/Redux; env centralizzate a metà |
| Pagine pubbliche | [PARZIALE] | `src/app/[locale]/*` | VOD/athletes/federations reali; live/interviews mock/vuote |
| Dashboard utente | [PARZIALE] | `dashboard/*` | profile/watch-history/reminders reali; payment/favorites mock |
| Dashboard admin | [IMPLEMENTATO] | `dashboard/admin/*`, `lib/admin`, `lib/videos` | CRUD completo video/atleti/eventi/federazioni/utenti |
| Database | [IMPLEMENTATO] | `supabase/migrations/0001-0012`, `types/database.ts` | Schema media-network ricco; types hand-maintained |
| Auth & ruoli | [IMPLEMENTATO] | `lib/supabase/*`, `components/auth/AuthForm.tsx`, `lib/supabase/guard.ts` | Email/password reale; OAuth placeholder |
| Consenso/GDPR | [PARZIALE] | `0009`, `CookieBanner.tsx`, `lib/legal/*` | Consenso signup su DB; cookie non su DB; legali in bozza |
| Paywall VOD | [IMPLEMENTATO] | `lib/access/server.ts`, `vod/[id]/page.tsx` | Server-side ok; **embed CF non firmato** |
| Paywall LIVE | [ASSENTE] | `live/[id]/page.tsx` | Pagina mock |
| Video VOD | [IMPLEMENTATO] | `cloudflare-stream.ts`, `player/*` | Reale; upload CF in-app non cablato |
| Live / RTMP | [ASSENTE] | `live/*`, `admin/live` | Nessun Live Input |
| Pagamenti Stripe | [ASSENTE funz.] | `lib/stripe/*`, `pricing/*`, `subscription` | Solo boilerplate; prezzi hardcoded |
| Betting/Bet365 | [SOLO UI] | `BettingPartnerSection.tsx`, `live/[id]` | Nessuna integrazione |
| Multi-view/chat/stats live/polls/MVP | [SOLO UI]/[ASSENTE] | `FeatureTabs.tsx`, `live/[id]` | Tutto mock/copy |
| Integrazioni | [PARZIALE] | `lib/supabase`, `lib/cloudflare-stream` | Supabase+CF reali; Stripe no; FantaBeach/ScoutAI/FIVBeach assenti |
| i18n | [IMPLEMENTATO] | `i18n/*`, `messages/*` | IT/EN, 0 drift |
| SEO | [PARZIALE] | `layout.tsx`, `config/site.ts` | No sitemap/robots/metadata per-pagina |
| Analytics | [PARZIALE] | `lib/tracking/*`, `0009` | First-party DB, gated su consenso |
| Qualità/build | [IMPLEMENTATO] | — | build/lint/type-check ✅; 0 test; 12 vuln npm |

---

## I 10 problemi più gravi (in ordine di priorità)

1. **Live streaming inesistente** [ASSENTE] — `/live` e `/live/[id]` sono interamente mock (nessun player, nessun HLS, nessun RTMP/Cloudflare Live Input, nessun paywall). È la promessa core "streaming live" ma non c'è nulla di funzionante. (`live/[id]/page.tsx`, `admin/live/page.tsx:36`)
2. **Paywall VOD aggirabile — embed Cloudflare non firmato** [sicurezza ALTA] — manca `requireSignedURLs`/signed token; chi ottiene un `uid` riproduce il video su Cloudflare bypassando il gating. (`cloudflare-stream.ts:67-69`)
3. **Stripe non integrato** [business-critical] — nessun checkout/webhook/portale/creazione customer; nessun flusso d'acquisto PPV. Impossibile incassare; premium/PPV dipendono da righe DB inserite a mano. (`lib/stripe/*`, `Paywall.tsx:33`)
4. **12 vulnerabilità npm (1 critica, 8 high)** + SDK Stripe molti major indietro (17→23 / 4→10) proprio nell'area critica pagamenti. (`package.json`, output `npm install`)
5. **Compliance betting/age-gate** [ALTO] — widget Bet365 mostrato come vetrina ma CLAUDE.md impone age gate 18+ e disclaimer; **nessun age gate 18+ bloccante trovato** (solo disclaimer testuale). (`live/[id]/page.tsx:293-326`; regola #5 CLAUDE.md)
6. **Accountability GDPR cookie** [MEDIO-ALTO] — il consenso cookie è salvato **solo in un cookie**, non su DB (nessun versioning/revoca tracciata); testi legali ancora `[DA COMPLETARE CON IL LEGALE]`. (`CookieBanner.tsx`, `lib/legal/*`)
7. **Incoerenza accesso broadcaster** [MEDIO] — la logica applicativa dà al broadcaster accesso a **tutto** il catalogo, la RLS solo ai **propri** contenuti; inoltre `/broadcast` non verifica il ruolo broadcaster e `roleRestrictedRoutes` è inutilizzato. (`check.ts:28-30`, `middleware`/`site.ts:19`)
8. **Zero test automatici** [MEDIO] — nessun test/runner su una piattaforma con pagamenti, accessi e RLS; `src/types/database.ts` è hand-maintained (rischio drift non rilevato dal type system).
9. **CLAUDE.md disallineato dalla realtà** [MEDIO] — documenta tabelle (`tournaments`/`stats`/`users`) e feature (widget Bet365) che non esistono così; fuorviante per chi sviluppa seguendo le regole del file.
10. **Debito tecnico / codice morto** [BASSO-MEDIO] — doppio modulo Cloudflare (`cloudflare/stream.ts` orfano), 2 API route orfane (`upload-url`/`upload-thumbnail`), 3 env accessor non usati, `test.md` stub, SEO incompleto (no sitemap/robots/metadata per-pagina), demo-mode che disattiva ogni protezione se Supabase non è configurato.

---

## Domande prima di pianificare le modifiche

1. **Priorità #1**: live streaming reale (Cloudflare Live Inputs + player HLS + paywall live) **oppure** completamento Stripe (checkout/webhook/PPV)? Qual è il blocco maggiore per il lancio?
2. **Cloudflare signed URLs**: abilitiamo `requireSignedURLs` + token firmati server-side per chiudere il bypass del paywall VOD? (cambia anche il modo di mostrare le card "bloccate").
3. **Broadcaster**: l'accesso corretto è "tutto il catalogo" (come la logica app) o "solo i propri contenuti" (come la RLS)? E il pannello `/broadcast` va implementato con check di ruolo?
4. **Betting/Bet365**: resta vetrina statica o è prevista un'integrazione reale (feed quote/affiliazione)? Serve un **age gate 18+ bloccante**?
5. **CLAUDE.md**: lo aggiorniamo per riflettere lo schema reale (`videos/profiles/federations/events/score_events…`) e rimuovere le feature non esistenti?
6. **Dipendenze**: procediamo con l'aggiornamento delle 12 vulnerabilità e dei major Stripe/next-intl/supabase? (va pianificato, soprattutto Stripe prima di cablarlo).
7. **Branch**: il branch di sviluppo `claude/clever-shannon-h9d8wk` è uno scaffold indietro di 83 commit rispetto a `main`. Va riallineato a `main` (consigliato) o ha uno scopo separato?
8. **Compliance legale**: chi valida i testi privacy/termini/cookie attualmente in bozza?

---

*Fine fotografia. Nessuna soluzione o piano proposti, come richiesto.*
