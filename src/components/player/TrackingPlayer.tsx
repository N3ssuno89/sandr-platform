'use client';

// Player Cloudflare Stream con tracking visione (watch_history + analytics).
// AREA CRITICA (CLAUDE.md): integrazione Cloudflare Stream + privacy.
// Il tracking NON deve MAI rompere la riproduzione: tutte le chiamate sono
// fire-and-forget verso server action che falliscono in silenzio. Si traccia
// solo se l'utente è loggato (loggedIn). L'iframe usa solo l'account pubblico.

import { useEffect, useRef, useState } from 'react';
import { getEmbedUrl } from '@/lib/cloudflare-stream';
import { recordWatchProgress, recordEvent } from '@/lib/tracking/actions';

const SDK_SRC = 'https://embed.cloudflarestream.com/embed/sdk.latest.js';

// API minima del player esposta dall'SDK Stream.
type StreamApi = {
  addEventListener: (type: string, cb: () => void) => void;
  currentTime: number;
  duration: number;
};

declare global {
  interface Window {
    Stream?: (el: HTMLIFrameElement) => StreamApi;
  }
}

// Id di sessione stabile per raggruppare gli eventi (sessionStorage).
function getSessionId(): string {
  try {
    const key = 'sandr_session_id';
    let v = sessionStorage.getItem(key);
    if (!v) {
      v = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `s-${Date.now()}`;
      sessionStorage.setItem(key, v);
    }
    return v;
  } catch {
    return 'anon';
  }
}

export function TrackingPlayer({
  cloudflareUid,
  videoId,
  title,
  loggedIn,
  resumeSeconds = 0,
}: {
  cloudflareUid: string;
  videoId: string;
  title?: string;
  loggedIn: boolean;
  resumeSeconds?: number;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loaded, setLoaded] = useState(false);

  // Resume: l'embed Cloudflare accetta ?startTime=Ns.
  const base = getEmbedUrl(cloudflareUid);
  const src = resumeSeconds > 0 ? `${base}?startTime=${Math.floor(resumeSeconds)}s` : base;

  useEffect(() => {
    if (!loggedIn) return; // solo utenti loggati vengono tracciati
    const el = iframeRef.current;
    if (!el) return;

    const sessionId = getSessionId();
    let player: StreamApi | null = null;
    let started = false;
    let completed = false;
    let lastSent = 0;
    let safety: ReturnType<typeof setInterval> | null = null;

    const flush = () => {
      try {
        if (!player) return;
        const cur = Math.floor(player.currentTime || 0);
        const dur = Math.floor(player.duration || 0);
        if (cur <= 0) return;
        const pct = dur > 0 ? Math.round((cur / dur) * 100) : 0;
        void recordWatchProgress(videoId, cur, dur);
        void recordEvent({ type: 'progress', videoId, sessionId, payload: { watched_seconds: cur, completion_percent: pct } });
        if (!completed && dur > 0 && cur / dur >= 0.9) {
          completed = true;
          void recordEvent({ type: 'complete', videoId, sessionId, payload: { watched_seconds: cur, completion_percent: pct } });
        }
      } catch {
        // mai propagare errori di tracking
      }
    };

    const attach = () => {
      try {
        if (!window.Stream || !el) return;
        player = window.Stream(el);
        if (!player) return;
        player.addEventListener('play', () => {
          if (!started) {
            started = true;
            void recordEvent({ type: 'play', videoId, sessionId, payload: { source: 'vod' } });
          }
        });
        player.addEventListener('timeupdate', () => {
          const cur = player?.currentTime ?? 0;
          if (cur - lastSent >= 10) {
            lastSent = cur;
            flush();
          }
        });
        player.addEventListener('pause', flush);
        player.addEventListener('ended', flush);
        safety = setInterval(flush, 20000); // rete di sicurezza
      } catch {
        // SDK non disponibile: nessun tracking, la riproduzione continua.
      }
    };

    // Carica l'SDK Stream se non presente, poi aggancia i listener.
    if (window.Stream) {
      attach();
    } else {
      let script = document.querySelector<HTMLScriptElement>(`script[src="${SDK_SRC}"]`);
      if (!script) {
        script = document.createElement('script');
        script.src = SDK_SRC;
        script.async = true;
        document.body.appendChild(script);
      }
      script.addEventListener('load', attach);
    }

    const onHide = () => {
      if (document.visibilityState === 'hidden') flush();
    };
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', flush);

    return () => {
      flush();
      if (safety) clearInterval(safety);
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', flush);
    };
    // resumeSeconds è applicato via URL al mount: non rientra nelle dipendenze.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loggedIn, videoId]);

  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-black" style={{ aspectRatio: '16 / 9' }}>
      {!loaded ? (
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="SANDR" className="h-12 w-12 animate-pulse object-contain" />
        </div>
      ) : null}

      <iframe
        ref={iframeRef}
        src={src}
        title={title ?? 'SANDR Stream'}
        onLoad={() => setLoaded(true)}
        style={{ border: 'none', width: '100%', height: '100%' }}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
