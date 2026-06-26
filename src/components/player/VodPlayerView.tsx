'use client';

// Vista VOD player (client). Usa il player reale Cloudflare Stream.
// AREA CRITICA (CLAUDE.md): integrazione Cloudflare Stream, review umana.

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { StreamPlayer } from '@/components/player/StreamPlayer';
import { VodCard } from '@/components/cards/VodCard';
import { AthleteCard } from '@/components/cards/AthleteCard';
import { getThumbnailUrl, type StreamVideo } from '@/lib/cloudflare-stream';
import { mockAthletes } from '@/lib/mock-athletes';

function fmtDuration(seconds: number): string {
  if (!seconds || seconds < 0) return '0:00';
  const s = Math.floor(seconds % 60);
  const m = Math.floor((seconds / 60) % 60);
  const h = Math.floor(seconds / 3600);
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function VodPlayerView({ video, others }: { video: StreamVideo; others: StreamVideo[] }) {
  const t = useTranslations('Vod');
  const [tab, setTab] = useState<'info' | 'athletes' | 'other'>('info');

  const athletes = mockAthletes.slice(0, 6);

  const info = [
    { label: t('player.info.duration'), value: fmtDuration(video.duration) },
    { label: t('player.info.published'), value: fmtDate(video.created) },
    { label: t('player.info.status'), value: video.status?.state ?? '—' },
    {
      label: t('player.info.resolution'),
      value: video.input ? `${video.input.width}×${video.input.height}` : '—',
    },
  ];

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#0a0a0a]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-6 lg:flex-row">
        {/* ===== LEFT ===== */}
        <div className="min-w-0 flex-1">
          <StreamPlayer videoId={video.uid} title={video.meta?.name} />

          {/* Info bar */}
          <div className="mt-2 rounded-lg bg-[#141414] p-4">
            <p className="font-condensed text-lg font-bold uppercase tracking-wide text-white">
              {video.meta?.name ?? 'Video'}
            </p>
            <p className="text-sm text-[#C0BDB8]">
              {fmtDuration(video.duration)} · {fmtDate(video.created)}
            </p>
          </div>

          {/* Tabs */}
          <div className="mt-4">
            <div className="flex gap-6 border-b border-white/10">
              {(['info', 'athletes', 'other'] as const).map((tb) => (
                <button
                  key={tb}
                  type="button"
                  onClick={() => setTab(tb)}
                  className={`-mb-px border-b-2 py-3 font-condensed text-sm font-bold uppercase tracking-wide transition-colors ${
                    tab === tb
                      ? 'border-sandr-orange text-white'
                      : 'border-transparent text-sandr-muted hover:text-white'
                  }`}
                >
                  {t(`player.tabs.${tb}`)}
                </button>
              ))}
            </div>

            <div className="py-4">
              {tab === 'info' ? (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {info.map((i) => (
                    <div key={i.label} className="rounded-lg bg-[#1C1C1C] p-4">
                      <p className="font-condensed text-[11px] uppercase tracking-wide text-[#888888]">{i.label}</p>
                      <p className="mt-1 font-condensed text-base font-bold text-white">{i.value}</p>
                    </div>
                  ))}
                </div>
              ) : null}

              {tab === 'athletes' ? (
                <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
                  {athletes.map((a) => (
                    <AthleteCard key={a.id} athlete={a} />
                  ))}
                </div>
              ) : null}

              {tab === 'other' ? (
                others.length > 0 ? (
                  <div className="flex flex-wrap gap-5">
                    {others.map((v) => (
                      <Link key={v.uid} href={`/vod/${v.uid}`} className="shrink-0">
                        <VodCard
                          title={v.meta?.name ?? 'Video'}
                          date={fmtDate(v.created)}
                          duration={fmtDuration(v.duration)}
                          access="free"
                          thumbnailUrl={getThumbnailUrl(v.uid)}
                          cardWidth={260}
                        />
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sandr-muted">{t('player.noOther')}</p>
                )
              ) : null}
            </div>
          </div>
        </div>

        {/* ===== RIGHT: Altri video ===== */}
        <aside className="hidden w-[320px] shrink-0 lg:block">
          <h2 className="font-condensed text-sm font-bold uppercase text-[#888888]" style={{ letterSpacing: '2px' }}>
            {t('player.otherVideos')}
          </h2>
          {others.length > 0 ? (
            <div className="mt-3 space-y-2">
              {others.slice(0, 4).map((v) => (
                <Link
                  key={v.uid}
                  href={`/vod/${v.uid}`}
                  className="flex h-20 gap-3 overflow-hidden rounded-lg border border-white/[0.06] bg-[#141414] transition-colors hover:border-sandr-orange/50"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getThumbnailUrl(v.uid)}
                    alt={v.meta?.name ?? 'Video'}
                    className="h-full w-20 shrink-0 object-cover"
                  />
                  <div className="min-w-0 flex-1 py-2 pr-2">
                    <p className="mt-1 truncate font-condensed text-[12px] font-bold uppercase text-white">
                      {v.meta?.name ?? 'Video'}
                    </p>
                    <p className="truncate text-[11px] text-[#888888]">{fmtDuration(v.duration)}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-sandr-muted">{t('player.noOther')}</p>
          )}
        </aside>
      </div>
    </div>
  );
}
