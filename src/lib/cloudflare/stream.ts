import { env } from '@/lib/env';

// Helper Cloudflare Stream (live RTMP->HLS e VOD).
// AREA CRITICA: stream key, RTMP e player HLS richiedono review umana (CLAUDE.md).

const CLOUDFLARE_API_BASE = 'https://api.cloudflare.com/client/v4';

// Base URL delle API Stream per l'account configurato.
export function streamApiBase() {
  return `${CLOUDFLARE_API_BASE}/accounts/${env.cloudflare.accountId()}/stream`;
}

// Header di autenticazione per le chiamate server-side alle API Stream.
export function streamAuthHeaders() {
  return {
    Authorization: `Bearer ${env.cloudflare.streamApiToken()}`,
    'Content-Type': 'application/json',
  };
}

// URL pubblico del manifest HLS per un dato video/live (delivery).
export function hlsManifestUrl(videoUid: string) {
  const subdomain = env.cloudflare.streamCustomerSubdomain();
  return `https://${subdomain}.cloudflarestream.com/${videoUid}/manifest/video.m3u8`;
}
