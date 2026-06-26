// =====================================================================
// Cloudflare Stream — client API
// AREA CRITICA (CLAUDE.md): stream key, RTMP, HLS player. Richiede review
// umana prima della produzione.
//
// - listVideos/getVideo: SOLO server-side (usano CLOUDFLARE_STREAM_TOKEN,
//   che NON deve mai essere esposto al client).
// - getEmbedUrl/getThumbnailUrl: client-safe (usano solo l'account ID
//   pubblico / URL di delivery pubblici).
//
// Build-safe: se le variabili non sono configurate o l'API è irraggiungibile,
// i fetch ritornano un fallback vuoto invece di far fallire la build.
// =====================================================================

const ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const API_TOKEN = process.env.CLOUDFLARE_STREAM_TOKEN;
const BASE_URL = `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/stream`;

export interface StreamVideo {
  uid: string;
  thumbnail: string;
  preview: string;
  readyToStream: boolean;
  status: { state: string };
  meta: { name: string };
  duration: number;
  input: { width: number; height: number };
  playback: { hls: string; dash: string };
  created: string;
}

export async function listVideos(): Promise<StreamVideo[]> {
  // Senza configurazione: nessuna chiamata di rete, fallback vuoto.
  if (!ACCOUNT_ID || !API_TOKEN) return [];
  try {
    const res = await fetch(BASE_URL, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.result ?? [];
  } catch {
    return [];
  }
}

export async function getVideo(uid: string): Promise<StreamVideo | null> {
  if (!ACCOUNT_ID || !API_TOKEN) return null;
  try {
    const res = await fetch(`${BASE_URL}/${uid}`, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.result ?? null;
  } catch {
    return null;
  }
}

// Client-safe: usa solo l'account ID pubblico per l'embed iframe.
export function getEmbedUrl(uid: string): string {
  return `https://iframe.mediadelivery.net/embed/${process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID}/${uid}?autoplay=false&loop=false&muted=false&preload=true&responsive=true`;
}

// Client-safe: URL di thumbnail pubblico.
export function getThumbnailUrl(uid: string): string {
  return `https://videodelivery.net/${uid}/thumbnails/thumbnail.jpg?time=1s&height=400`;
}
