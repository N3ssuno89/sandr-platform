// =====================================================================
// SANDR — Controllo accesso contenuti (Opzione B)
// AREA CRITICA (CLAUDE.md): controllo accesso free/premium/ppv. Questa logica
// DEVE essere invocata SOLO server-side (vedi ./server.ts): un utente free non
// deve mai poter ottenere l'embed URL Cloudflare di un contenuto premium.
//
// Modello: gli utenti free vedono solo contenuti `free` e gli `highlights`.
// Tutto il resto (replay, interview, behind_scenes, documentary, live) richiede
// Premium attivo. I contenuti `ppv` richiedono un acquisto valido.
// =====================================================================

export type AccessLevel = 'free' | 'premium' | 'ppv';

// Solo i campi necessari al controllo (niente embed URL/segreti qui).
export type AccessVideo = {
  accessLevel: AccessLevel;
  type: string | null; // content_type enum DB (es. 'highlights')
};

export type AccessUser = { id: string } | null;
export type AccessSubscription = { plan: string; status: string } | null;

export type AccessReason = 'free' | 'needs-premium' | 'needs-purchase' | 'allowed';
export type AccessResult = { allowed: boolean; reason: AccessReason };

// Abbonamento Premium considerato valido se piano premium e stato attivo.
export function hasActivePremium(subscription: AccessSubscription): boolean {
  return !!subscription && subscription.plan === 'premium' && subscription.status === 'active';
}

// Funzione PURA: decide se l'utente può guardare il video.
// `ppvPurchased` è un acquisto PPV valido per QUESTO video (lookup separato
// lato server, vedi ./server.ts) — di default false.
export function canAccessVideo(
  video: AccessVideo,
  user: AccessUser,
  subscription: AccessSubscription,
  ppvPurchased = false,
): AccessResult {
  // Contenuto free → sempre visibile.
  if (video.accessLevel === 'free') return { allowed: true, reason: 'free' };
  // Highlights → sempre liberi (free highlights), a prescindere dal livello.
  if (video.type === 'highlights') return { allowed: true, reason: 'free' };

  if (video.accessLevel === 'premium') {
    return hasActivePremium(subscription)
      ? { allowed: true, reason: 'allowed' }
      : { allowed: false, reason: 'needs-premium' };
  }

  if (video.accessLevel === 'ppv') {
    return ppvPurchased
      ? { allowed: true, reason: 'allowed' }
      : { allowed: false, reason: 'needs-purchase' };
  }

  // Fallback prudente: nega.
  return { allowed: false, reason: 'needs-premium' };
}

// Livello mostrato dal badge sulle card: gli highlights appaiono come FREE
// (l'utente può guardarli) anche se marcati premium/ppv.
export function badgeTier(accessLevel: AccessLevel, type: string | null): AccessLevel {
  if (type === 'highlights') return 'free';
  return accessLevel;
}
