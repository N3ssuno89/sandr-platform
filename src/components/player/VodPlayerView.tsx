'use client';

// Vista VOD player (client). Player reale Cloudflare Stream; metadati da Supabase.
// AREA CRITICA (CLAUDE.md): integrazione Cloudflare Stream, review umana.

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { StreamPlayer } from '@/components/player/StreamPlayer';
import { Paywall } from '@/components/player/Paywall';
import { VodCard } from '@/components/cards/VodCard';
import { PhotoFill } from '@/components/ui/PhotoFill';
import type { VideoAthlete } from '@/lib/videos/types';
import type { AccessReason } from '@/lib/access/check';

export type PlayerVideoView = {
  cloudflareUid: string; // id Cloudflare (per il player) — '' se accesso negato
  title: string;
  durationLabel: string;
  dateLabel: string;
  description?: string | null;
};

export type OtherVideo = {
  id: string; // id Supabase (per il link /vod/[id])
  title: string;
  durationLabel: string;
  thumbnailUrl?: string;
  access: 'free' | 'premium' | 'ppv';
};

export type AccessView = { allowed: boolean; reason: AccessReason; ppvPrice?: number | null };

export function VodPlayerView({
  video,
  others,
  athletes,
  access,
}: {
  video: PlayerVideoView;
  others: OtherVideo[];
  athletes: VideoAthlete[];
  access: AccessView;
}) {
  const t = useTranslations('Vod');
  const [tab, setTab] = useState<'info' | 'athletes' | 'other'>('info');

  const info = [
    { label: t('player.info.duration'), value: video.durationLabel || '—' },
    { label: t('player.info.published'), value: video.dateLabel || '—' },
  ];

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-[#0a0a0a]">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-6 lg:flex-row">
        {/* ===== LEFT ===== */}
        <div className="min-w-0 flex-1">
          {/* Accesso consentito → player Cloudflare. Negato → paywall (il
              cloudflare_uid NON viene mai passato al player: gating server-side). */}
          {access.allowed ? (
            <StreamPlayer videoId={video.cloudflareUid} title={video.title} />
          ) : (
            <Paywall reason={access.reason} ppvPrice={access.ppvPrice} />
          )}

          {/* Info bar */}
          <div className="mt-2 rounded-lg bg-[#141414] p-4">
            <p className="font-condensed text-lg font-bold uppercase tracking-wide text-white">{video.title}</p>
            <p className="text-sm text-[#C0BDB8]">
              {video.durationLabel} · {video.dateLabel}
            </p>
            {video.description ? <p className="mt-2 text-sm text-[#888888]">{video.description}</p> : null}
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
                    tab === tb ? 'border-sandr-orange text-white' : 'border-transparent text-sandr-muted hover:text-white'
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
                athletes.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
                    {athletes.map((a) => (
                      <Link
                        key={a.id}
                        href={`/athletes/${a.id}`}
                        className="group block overflow-hidden rounded-xl border border-white/[0.08] transition-colors hover:border-sandr-orange"
                      >
                        <div className="relative w-full" style={{ aspectRatio: '1 / 1' }}>
                          <PhotoFill src={a.photo} name={a.name} />
                        </div>
                        <div className="p-2">
                          <p className="truncate font-condensed text-[13px] font-bold uppercase text-white">{a.name}</p>
                          <p className="truncate text-[11px] uppercase tracking-wide text-[#888888]">{a.nation ?? ''}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-sandr-muted">{t('player.noAthletes')}</p>
                )
              ) : null}

              {tab === 'other' ? (
                others.length > 0 ? (
                  <div className="flex flex-wrap gap-5">
                    {others.map((v) => (
                      <Link key={v.id} href={`/vod/${v.id}`} className="shrink-0">
                        <VodCard
                          title={v.title}
                          date=""
                          duration={v.durationLabel}
                          access={v.access}
                          thumbnailUrl={v.thumbnailUrl}
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
                  key={v.id}
                  href={`/vod/${v.id}`}
                  className="flex h-20 gap-3 overflow-hidden rounded-lg border border-white/[0.06] bg-[#141414] transition-colors hover:border-sandr-orange/50"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={v.thumbnailUrl ?? ''} alt={v.title} className="h-full w-20 shrink-0 object-cover" />
                  <div className="min-w-0 flex-1 py-2 pr-2">
                    <p className="mt-1 truncate font-condensed text-[12px] font-bold uppercase text-white">{v.title}</p>
                    <p className="truncate text-[11px] text-[#888888]">{v.durationLabel}</p>
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
