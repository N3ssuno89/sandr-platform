# SANDR — AI Context File
> Questo file è letto da Claude prima di qualsiasi task.
> Non modificare senza aggiornare anche FACTORY.md.

## Cos'è SANDR
Media network e piattaforma streaming per beach volley e sand sports.
Posizionamento: sport-tech premium. NON lifestyle, NON beach party.
Dominio: sandr.tv | Founder: Emanuele Giartosio (zioema)

## Stack obbligatorio
- Frontend: Next.js (React) + Tailwind CSS
- Backend/DB: Supabase (PostgreSQL + Auth + Realtime + Storage)
  → NEXT STEP: auth/sessioni/ruoli non ancora collegati. In demo le rotte
    protette (incl. /dashboard/admin) sono pubbliche via eccezioni middleware.
    Prima della produzione: gating ruolo via Supabase Auth + RLS (AREA CRITICA).
- Video: Cloudflare Stream (RTMP ingest → HLS delivery)
  → COLLEGATO: src/lib/cloudflare-stream.ts (listVideos/getVideo server-side,
    getEmbedUrl/getThumbnailUrl client-safe). Token CLOUDFLARE_STREAM_TOKEN
    SOLO server-side. Build-safe se non configurato (fallback vuoto/mock).
- Pagamenti: Stripe (abbonamenti + PPV)
- Deploy staging: Netlify (preview branch automatico)
- Deploy produzione: MANUALE, solo su approvazione founder

## Identità visiva — rispettare sempre
- Background: #0C0C0C o #1A1A1A
- Accento principale: #F04E00 (arancione SANDR ufficiale, token `sandr-orange`)
- Testo principale: #F7F5F2
- Testo secondario: #888888
- Font headlines: Archivo Black o Barlow Condensed
- Font body: DM Sans
- MAI usare: Inter, Roboto, Arial, emoji da spiaggia

## Struttura database Supabase (tabelle principali)
- matches (id, tournament_id, athlete1_id, athlete2_id, 
  status, stream_key, access_type, scheduled_at)
- athletes (id, name, photo_url, fivb_ranking, current_partner)
- tournaments (id, name, circuit, category, location, dates)
- stats (id, match_id, athlete_id, aces, blocks, errors, points)
- users (id, email, subscription_tier, stripe_customer_id)
- subscriptions (id, user_id, plan, status, expires_at)

## Regole di sviluppo — NON derogare mai
1. MAI toccare il branch main direttamente
2. Ogni feature = branch separato (naming: feature/nome-feature)
3. MAI deploy automatico in produzione
4. MAI modificare schema Supabase senza migration file
5. MAI togliere age gate 18+ o disclaimer betting
6. YAGNI: non aggiungere features non richieste
7. KISS: soluzione più semplice che funziona
8. Nessuna astrazione prematura
9. Error handling esplicito su ogni chiamata API esterna
10. Commenti in italiano per logica di business, inglese per codice

## Aree critiche — richiedono review umana obbligatoria
- Tutto ciò che tocca Stripe (pagamenti, abbonamenti, PPV)
- Tutto ciò che tocca Supabase Auth (login, sessioni, ruoli)
- Supabase Realtime (punteggio live, WebSocket)
- Widget betting Bet365 (compliance, link affiliati, disclaimer)
- Cloudflare Stream (stream key, RTMP, HLS player)

## Circuiti gestiti
BPT Futures / Challenge / Elite, AIBVC Tour, FIPAV, 
Campionato Italiano, Marathon, King & Queen

## Tipi di accesso contenuti
- free: visibile a tutti
- premium: richiede abbonamento attivo
- ppv: richiede acquisto singolo evento

## Pannello admin (content management)
Rotte sotto /dashboard/admin (tool interno staff, etichette in italiano):
- /dashboard/admin — dashboard (stat + video recenti + video in evidenza)
- /dashboard/admin/videos — gestione video (lista, ricerca, azioni)
- /dashboard/admin/videos/upload — upload video + metadata (2 step)
- /dashboard/admin/videos/[id]/edit — modifica metadata
- /dashboard/admin/athletes — gestione atleti (mock, DB nella prossima versione)
- /dashboard/admin/live | /users | /subscriptions — placeholder
AREA CRITICA: in produzione richiede gating ruolo admin (Supabase Auth + RLS).

## Metadati video (Cloudflare Stream `meta`)
Campi custom scritti dal pannello admin nel `meta` del video:
- name, circuit, type, sport, event, athletes, country, eventDate
- access (free/premium/ppv), description, tags
- thumbnailCard — copertina 16:9 per le righe a scorrimento
- thumbnailFeatured — copertina 21:9 per l'hero "in evidenza"
- featured — 'true' se il video è in evidenza (hero homepage)

## Copy corretto
✅ "Live on SANDR" | "SANDR Replay" | "SANDR Rankings"
✅ "Built for the arena. Not the stands."
❌ Mai toni entusiastici, emoji, "la community dei fan"

## Cosa NON fare mai
- Non proporre soluzioni con Docker/Kubernetes
- Non aggiungere dipendenze npm non necessarie
- Non usare librerie di state management complesse (no Redux)
- Non modificare la palette colori
- Non bypassare il controllo accesso free/premium/ppv
- Non scrivere logica di business nei componenti React 
  (va nei Server Actions o nelle API routes)
