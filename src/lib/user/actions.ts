'use server';

import { createClient as createServerClient } from '@/lib/supabase/server';
import { isSupabaseConfiguredServer } from '@/lib/supabase/admin';
import { getThumbnailUrl } from '@/lib/cloudflare-stream';
import type { DeleteResult } from '@/lib/reference/types';
import type { ProfileView, WatchHistoryItem, ReminderItem, FantasyTeamItem } from './types';

function fmtDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? '—'
    : d.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
}

// REAL: profilo dell'utente loggato (RLS self-only).
export async function getMyProfile(): Promise<ProfileView | null> {
  if (!isSupabaseConfiguredServer()) return null;
  const sb = createServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return null;
  const { data } = await sb
    .from('profiles')
    .select('id,email,full_name,avatar_url,role,created_at')
    .eq('id', user.id)
    .maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    email: data.email,
    full_name: data.full_name,
    avatar_url: data.avatar_url,
    role: data.role,
    createdAt: fmtDate(data.created_at),
  };
}

// REAL: watch_history dell'utente, join videos.
export async function getMyWatchHistory(): Promise<WatchHistoryItem[]> {
  if (!isSupabaseConfiguredServer()) return [];
  const sb = createServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return [];
  const { data } = await sb
    .from('watch_history')
    .select('watched_seconds,completed,last_watched_at,videos(id,title,thumbnail_card_url,cloudflare_uid,duration_seconds)')
    .eq('user_id', user.id)
    .order('last_watched_at', { ascending: false });
  return (data ?? [])
    .filter((r) => r.videos)
    .map((r) => {
      const v = r.videos!;
      return {
        videoId: v.id,
        title: v.title,
        thumbnailUrl: v.thumbnail_card_url || (v.cloudflare_uid ? getThumbnailUrl(v.cloudflare_uid) : null),
        watchedSeconds: r.watched_seconds,
        durationSeconds: v.duration_seconds,
        completed: r.completed,
        lastWatchedAt: fmtDate(r.last_watched_at),
      };
    });
}

// REAL: reminders dell'utente (join video per il titolo).
export async function getMyReminders(): Promise<ReminderItem[]> {
  if (!isSupabaseConfiguredServer()) return [];
  const sb = createServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return [];
  const { data } = await sb
    .from('reminders')
    .select('id,remind_at,videos(title)')
    .eq('user_id', user.id)
    .eq('sent', false)
    .order('remind_at', { ascending: true });
  return (data ?? []).map((r) => ({
    id: r.id,
    title: r.videos?.title ?? 'Evento',
    remindAt: r.remind_at ? fmtDate(r.remind_at) : null,
  }));
}

export async function deleteReminder(id: string): Promise<DeleteResult> {
  if (!isSupabaseConfiguredServer()) return { ok: false, error: 'not-configured' };
  const sb = createServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return { ok: false, error: 'unauthorized' };
  // RLS: l'utente può cancellare solo i propri reminder.
  const { error } = await sb.from('reminders').delete().eq('id', id).eq('user_id', user.id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// REAL: fantasy_teams dell'utente (join evento).
export async function getMyFantasyTeams(): Promise<FantasyTeamItem[]> {
  if (!isSupabaseConfiguredServer()) return [];
  const sb = createServerClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return [];
  const { data } = await sb
    .from('fantasy_teams')
    .select('id,name,total_points,events(title)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  return (data ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    totalPoints: r.total_points,
    eventTitle: r.events?.title ?? null,
  }));
}
