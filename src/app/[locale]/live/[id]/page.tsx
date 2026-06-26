'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { mockContent } from '@/lib/mock-content';

type ChatMessage = { id: number; user: string; time: string; text: string };

const SEED_CHAT: ChatMessage[] = [
  { id: 1, user: 'beachfan_88', time: '15:02', text: 'Che punto!' },
  { id: 2, user: 'marco_vb', time: '15:03', text: 'Vai Lupo!' },
  { id: 3, user: 'sand_queen', time: '15:04', text: 'Incredibile difesa' },
  { id: 4, user: 'norge_fan', time: '15:05', text: 'Mol is unstoppable' },
  { id: 5, user: 'lella_92', time: '15:06', text: 'Che muro!' },
  { id: 6, user: 'volleynerd', time: '15:07', text: 'Ace pazzesco' },
  { id: 7, user: 'giank', time: '15:08', text: 'Set combattutissimo' },
  { id: 8, user: 'beachfan_88', time: '15:09', text: 'Forza ragazzi!!' },
];

const UPCOMING = [
  { id: 'u1', date: '28 Jun · 18:00', teams: 'Mol / Sørum vs Ranghieri / Carambula', circuit: 'BPT' },
  { id: 'u2', date: '29 Jun · 20:30', teams: 'Gori / Cattaneo vs Benede / Ramos', circuit: 'AIBVC' },
  { id: 'u3', date: '01 Jul · 17:15', teams: 'Nicolai / Cottafava vs Åhman / Hellvig', circuit: 'FIPAV' },
];

const STATS = [
  { a: '3', label: 'ACE', b: '1' },
  { a: '5', label: 'ERRORI', b: '7' },
  { a: '62%', label: 'ATT', b: '58%' },
  { a: '2', label: 'MURI', b: '3' },
];

// Stats della sidebar (etichette estese).
const SIDEBAR_STATS = [
  { a: '3', label: 'Ace', b: '1' },
  { a: '5', label: 'Errori', b: '7' },
  { a: '62%', label: 'Attacco%', b: '58%' },
  { a: '2', label: 'Muri', b: '3' },
];

// Quote mock (non reali). Gioco riservato ai maggiorenni — vedi disclaimer.
const ODDS = [
  { k: '1', v: '1.85' },
  { k: 'X', v: '12.00' },
  { k: '2', v: '2.10' },
];

export default function LivePlayerPage({ params }: { params: { locale: string; id: string } }) {
  const t = useTranslations('Player');
  const tc = useTranslations('Common');

  // Dati live: da mock-content (type live) o fallback.
  const event = mockContent.find((c) => c.type === 'live' && c.id === params.id);
  const data = event
    ? { title: event.title, teams: event.teams ?? '', circuit: event.circuit }
    : { title: 'BPT Elite — Finale', teams: 'Mol / Sørum vs Plavins / Tocs', circuit: 'BPT' };

  const otherLive = mockContent.filter((c) => c.type === 'live' && c.id !== params.id).slice(0, 3);

  // Sfondo player: foto atleta deterministica (no Math.random).
  const photoIndex = (Array.from(params.id).reduce((s, ch) => s + ch.charCodeAt(0), 0) % 6) + 1;
  const blurPhoto = `/athletes/${photoIndex}.png`;

  const [tab, setTab] = useState<'chat' | 'stats' | 'upcoming'>('chat');
  const [playing, setPlaying] = useState(true);
  const [cast, setCast] = useState(false);
  const [reminder, setReminder] = useState(false);
  const [chat, setChat] = useState<ChatMessage[]>(SEED_CHAT);
  const [input, setInput] = useState('');

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    setChat((prev) => [...prev, { id: prev.length + 1, user: 'tu', time: '15:10', text }]);
    setInput('');
  };

  const goFullscreen = () => {
    document.documentElement.requestFullscreen?.().catch(() => {});
  };

  const showCastTooltip = () => {
    setCast(true);
    setTimeout(() => setCast(false), 3000);
  };

  const ctrlPill = 'rounded bg-white/[0.08] px-2 py-1 font-condensed text-[11px] font-bold text-white';

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#0a0a0a]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-6 lg:flex-row">
        {/* ===== LEFT COLUMN ===== */}
        <div className="min-w-0 flex-1">
          {/* Player */}
          <div className="relative aspect-video overflow-hidden rounded-lg bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={blurPhoto}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: 'blur(20px) brightness(0.3)' }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1a1a1a, #0a0a0a)', opacity: 0.6 }} />

            {/* Contenuto centrale */}
            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
              <span className="inline-flex items-center gap-2 rounded bg-red-600 px-2 py-1 text-xs font-bold uppercase tracking-wide text-white">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                Live
              </span>
              <h1 className="mt-4 font-condensed text-2xl font-extrabold uppercase text-white">{data.title}</h1>
              <p className="mt-1 text-base text-[#C0BDB8]">{data.teams}</p>
            </div>

            {/* Controlli */}
            <div className="absolute inset-x-0 bottom-0 flex h-12 items-center gap-4 bg-black/80 px-4">
              <div className="flex items-center gap-3 font-condensed text-sm font-bold text-white">
                <button type="button" aria-label="Play/Pause" onClick={() => setPlaying((v) => !v)}>
                  {playing ? '▐▐' : '▶'}
                </button>
                <button type="button" aria-label="Back 10s">«10</button>
                <button type="button" aria-label="Forward 10s">10»</button>
              </div>

              {/* Progress (live: nessun fill) */}
              <div className="relative flex-1">
                <div className="h-1 w-full rounded-full bg-white/20" />
                <span className="absolute -top-1 right-0 flex items-center gap-1">
                  <span className="h-3 w-3 rounded-full bg-red-600" />
                  <span className="font-condensed text-[10px] font-bold uppercase text-red-500">Live</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={ctrlPill}>VOL</span>
                <button type="button" onClick={goFullscreen} className={ctrlPill} aria-label="Fullscreen">
                  [ ]
                </button>
                <div className="relative">
                  <button type="button" onClick={showCastTooltip} className={ctrlPill} aria-label="TV">
                    TV
                  </button>
                  {cast ? (
                    <span className="absolute bottom-9 right-0 whitespace-nowrap rounded bg-black/90 px-2 py-1 text-[10px] text-white">
                      {t('cast')}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

          {/* Match info bar */}
          <div className="mt-2 flex flex-col gap-3 rounded-lg bg-[#141414] p-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <span className="inline-block rounded-full bg-sandr-orange px-2 py-0.5 text-[10px] font-bold uppercase text-black">
                {data.circuit}
              </span>
              <p className="mt-2 font-condensed text-lg font-bold uppercase tracking-wide text-white">{data.title}</p>
              <p className="text-sm text-[#C0BDB8]">{data.teams}</p>
              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setReminder(true)}
                  className="rounded-md border border-sandr-orange/30 px-3 py-1 text-[12px] text-sandr-orange hover:bg-sandr-orange/10"
                >
                  {reminder ? t('reminderSet') : t('reminder')}
                </button>
                <button
                  type="button"
                  className="rounded-md border border-white/15 px-3 py-1 text-[12px] text-white hover:bg-white/5"
                >
                  {t('share')}
                </button>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <span className="inline-flex items-center gap-2 rounded bg-black/60 px-2 py-1 text-xs font-bold uppercase text-white">
                <span className="h-2 w-2 rounded-full bg-red-600" />
                Live
              </span>
              <p className="mt-1 text-[12px] text-[#888888]">{t('startedAt')}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-4">
            <div className="flex gap-6 border-b border-white/10">
              {(['chat', 'stats', 'upcoming'] as const).map((tb) => (
                <button
                  key={tb}
                  type="button"
                  onClick={() => setTab(tb)}
                  className={`-mb-px border-b-2 py-3 font-condensed text-sm font-bold uppercase tracking-wide transition-colors ${
                    tab === tb ? 'border-sandr-orange text-white' : 'border-transparent text-sandr-muted hover:text-white'
                  }`}
                >
                  {t(`tabs.${tb}`)}
                </button>
              ))}
            </div>

            <div className="py-4">
              {tab === 'chat' ? (
                <div>
                  <div className="no-scrollbar h-[200px] space-y-2 overflow-y-auto">
                    {chat.map((m) => (
                      <p key={m.id} className="text-sm">
                        <span className="font-semibold text-sandr-orange">{m.user}</span>{' '}
                        <span className="text-[10px] text-[#555555]">{m.time}</span>{' '}
                        <span className="text-[#C0BDB8]">{m.text}</span>
                      </p>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') sendMessage();
                      }}
                      placeholder={t('chatPlaceholder')}
                      className="flex-1 rounded border border-white/[0.08] bg-[#242424] px-3 py-2 text-sm text-sandr-text placeholder:text-sandr-muted focus:border-sandr-orange focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={sendMessage}
                      className="rounded bg-sandr-orange px-4 py-2 font-condensed text-sm font-bold uppercase text-black"
                    >
                      {t('send')}
                    </button>
                  </div>
                </div>
              ) : null}

              {tab === 'stats' ? (
                <div className="overflow-hidden rounded-lg border border-white/10">
                  {STATS.map((s) => (
                    <div key={s.label} className="grid grid-cols-3 items-center px-4 py-2 font-condensed">
                      <span className="text-left text-base font-bold text-white">{s.a}</span>
                      <span className="text-center text-xs uppercase tracking-wide text-sandr-muted">{s.label}</span>
                      <span className="text-right text-base font-bold text-white">{s.b}</span>
                    </div>
                  ))}
                </div>
              ) : null}

              {tab === 'upcoming' ? (
                <div className="space-y-3">
                  {UPCOMING.map((u) => (
                    <div key={u.id} className="rounded-lg border border-white/[0.06] bg-[#141414] p-4">
                      <span className="text-[11px] font-bold uppercase text-sandr-orange">{u.date}</span>
                      <p className="mt-1 font-condensed text-[15px] font-bold uppercase tracking-wide text-white">{u.teams}</p>
                      <p className="text-[12px] text-[#888888]">{u.circuit}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        {/* ===== RIGHT COLUMN ===== */}
        <aside className="hidden w-[320px] shrink-0 lg:block">
          {/* SEZIONE 1 — Statistiche live */}
          <h2 className="font-condensed text-[11px] font-bold uppercase text-[#888888]" style={{ letterSpacing: '2px' }}>
            {t('statsTitle')}
          </h2>
          <div className="mt-3 flex items-center">
            <span className="flex-1 text-right font-condensed text-[13px] font-bold text-white">Lupo / Nicolai</span>
            <span className="px-4 text-center font-condensed text-[28px] font-black text-sandr-orange">1 — 0</span>
            <span className="flex-1 text-left font-condensed text-[13px] font-bold text-white">Ranghieri / Carambula</span>
          </div>
          <p className="mt-2 text-center text-[11px] text-[#888888]">{t('set1')}</p>
          <p className="text-center text-[11px] text-[#888888]">{t('set2')}</p>

          <div className="mt-3 rounded-lg bg-[#1C1C1C] p-3">
            {SIDEBAR_STATS.map((s) => (
              <div key={s.label} className="grid grid-cols-3 items-center py-0.5 font-condensed text-[12px] font-bold">
                <span className="text-left text-sandr-orange">{s.a}</span>
                <span className="text-center text-[#888888]">{s.label}</span>
                <span className="text-right text-white">{s.b}</span>
              </div>
            ))}
          </div>

          <div className="my-4 h-px bg-white/10" />

          {/* SEZIONE 2 — Widget betting bet365 (AREA CRITICA, vedi CLAUDE.md:
              compliance, link affiliati e disclaimer richiedono review umana) */}
          <div className="mb-3 rounded-[10px] border border-[#1a3a1a] bg-[#0d1f0d] p-3">
            <div className="flex items-center justify-between">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/partners/bet365-logo.png" alt="bet365" style={{ height: 20 }} />
              <span className="text-[11px] text-[#888888]">{t('quoteLive')}</span>
            </div>
            <p className="mt-3 font-condensed text-[12px] font-bold text-white">Lupo/Nicolai vs Ranghieri/Carambula</p>
            <p className="text-[10px] text-[#888888]">{t('bettingTime')}</p>

            {/* Quote offuscate dietro gate di accesso (nessuna quota reale mostrata) */}
            <div className="relative mt-2">
              <div className="flex gap-2">
                {ODDS.map((o) => (
                  <div
                    key={o.k}
                    className="flex-1 rounded-md border border-[#2a3a2a] bg-[#1a2a1a] p-2 text-center transition-colors hover:border-[#4CAF50] hover:bg-[#4CAF50]/10"
                  >
                    <p className="text-[10px] text-[#888888]">{o.k}</p>
                    <p className="font-condensed text-base font-extrabold text-white">{o.v}</p>
                  </div>
                ))}
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center rounded-md bg-[#0d1f0d]/30 backdrop-blur-[6px]">
                <p className="font-condensed text-[13px] font-bold text-white">{t('oddsGate')}</p>
                <Link href="/login" className="mt-2 rounded bg-sandr-orange px-3 py-1 text-[11px] font-bold uppercase text-black">
                  {tc('signIn')}
                </Link>
              </div>
            </div>

            <p className="mt-2 text-center text-[9px] text-[#555555]">{t('bettingDisclaimer')}</p>
          </div>

          {/* SEZIONE 3 — Banner pubblicitario */}
          <p className="mb-1 text-center text-[9px] uppercase text-[#444444]" style={{ letterSpacing: '1px' }}>
            {t('adLabel')}
          </p>
          <div
            className="mb-5 flex h-[120px] flex-col items-center justify-center rounded-lg border border-white/[0.06]"
            style={{ background: 'linear-gradient(135deg, #1C1C1C, #242424)' }}
          >
            <p className="font-condensed text-[14px] font-bold text-[#555555]">{t('adSpace')}</p>
            <p className="text-[11px] text-sandr-orange">advertising@sandr.tv</p>
          </div>

          {/* SEZIONE 4 — Altri live + prossimi eventi */}
          <h2 className="font-condensed text-sm font-bold uppercase text-[#888888]" style={{ letterSpacing: '2px' }}>
            {t('liveNow')}
          </h2>
          <div className="mt-3 space-y-2">
            {otherLive.map((c) => (
              <Link
                key={c.id}
                href={`/live/${c.id}`}
                className="flex h-20 gap-3 overflow-hidden rounded-lg border border-white/[0.06] bg-[#141414] transition-colors hover:border-sandr-orange/50"
              >
                <div className="h-full w-20 shrink-0 bg-gradient-to-br from-white/10 to-transparent" />
                <div className="min-w-0 flex-1 py-2 pr-2">
                  <span className="inline-flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold uppercase text-white">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                    Live
                  </span>
                  <p className="mt-1 truncate font-condensed text-[12px] font-bold uppercase text-white">{c.title}</p>
                  <p className="truncate text-[11px] text-[#888888]">{c.teams}</p>
                </div>
              </Link>
            ))}
          </div>

          <div className="my-5 h-px bg-white/10" />

          <h2 className="font-condensed text-sm font-bold uppercase text-[#888888]" style={{ letterSpacing: '2px' }}>
            {t('upcoming')}
          </h2>
          <div className="mt-3 space-y-2">
            {UPCOMING.slice(0, 2).map((u) => (
              <div key={u.id} className="rounded-lg border border-white/[0.06] bg-[#141414] p-3">
                <span className="text-[10px] font-bold uppercase text-sandr-orange">{u.date}</span>
                <p className="mt-1 truncate font-condensed text-[12px] font-bold uppercase text-white">{u.teams}</p>
                <p className="text-[11px] text-[#888888]">{u.circuit}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
