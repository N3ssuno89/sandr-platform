'use server';

import { getAdminContext } from '@/lib/supabase/guard';
import type { DeleteResult } from '@/lib/reference/types';
import type { UserRow, LiveVideoRow, SubsOverview } from './types';

function fmtDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? ''
    : d.toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' });
}

// REAL: profiles table, admin-only via RLS (qui via service role + check admin).
export async function getUsers(): Promise<UserRow[]> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return [];
  const { data } = await ctx.admin
    .from('profiles')
    .select('id,email,full_name,role,preferred_language,created_at')
    .order('created_at', { ascending: false });
  return (data as UserRow[] | null) ?? [];
}

export async function updateUserRole(
  userId: string,
  role: 'viewer' | 'broadcaster' | 'admin' | 'organizer',
): Promise<DeleteResult> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { ok: false, error: ctx.error };
  const { error } = await ctx.admin.from('profiles').update({ role }).eq('id', userId);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

// REAL: video live / programmati (is_live).
export async function getLiveVideos(): Promise<LiveVideoRow[]> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return [];
  const { data } = await ctx.admin
    .from('videos')
    .select('id,title,is_live,status,created_at')
    .eq('is_live', true)
    .order('created_at', { ascending: false });
  return (data ?? []).map((v) => ({
    id: v.id,
    title: v.title,
    isLive: v.is_live,
    status: v.status,
    date: fmtDate(v.created_at),
  }));
}

// REAL: subscriptions table. MOCK: MRR/revenue calc (Stripe pending).
export async function getSubscriptionsOverview(): Promise<SubsOverview> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { active: 0, cancelled: 0, total: 0, recent: [] };
  const { data } = await ctx.admin
    .from('subscriptions')
    .select('id,plan,status,current_period_end,created_at')
    .order('created_at', { ascending: false });
  const rows = data ?? [];
  return {
    active: rows.filter((r) => r.status === 'active').length,
    cancelled: rows.filter((r) => r.status === 'cancelled').length,
    total: rows.length,
    recent: rows.slice(0, 10).map((r) => ({
      id: r.id,
      plan: r.plan,
      status: r.status,
      periodEnd: r.current_period_end,
      createdAt: fmtDate(r.created_at),
    })),
  };
}
