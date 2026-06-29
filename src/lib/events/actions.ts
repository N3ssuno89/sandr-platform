'use server';

import { revalidatePath } from 'next/cache';
import { getAdminContext, getReadClient } from '@/lib/supabase/guard';
import type { ActionResult, DeleteResult } from '@/lib/reference/types';
import type { EventRow, EventInput } from './types';

// Invalida la cache delle rotte che mostrano gli eventi dopo una scrittura.
function revalidateEventPaths() {
  revalidatePath('/[locale]/dashboard/admin/events', 'page');
}

const COLS = 'id,title,slug,federation_id,sport_id,location,nation,start_date,end_date,stage';

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function getEvents(): Promise<EventRow[]> {
  const db = getReadClient();
  if (!db) return [];
  const { data } = await db.from('events').select(COLS).order('start_date', { ascending: false });
  return (data as EventRow[] | null) ?? [];
}

export async function getEventById(id: string): Promise<EventRow | null> {
  const db = getReadClient();
  if (!db) return null;
  const { data } = await db.from('events').select(COLS).eq('id', id).maybeSingle();
  return (data as EventRow | null) ?? null;
}

function toRow(input: EventInput) {
  return {
    title: input.title,
    slug: slugify(input.title),
    federation_id: input.federation_id || null,
    sport_id: input.sport_id || null,
    location: input.location || null,
    nation: input.nation || null,
    start_date: input.start_date || null,
    end_date: input.end_date || null,
    stage: input.stage || null,
  };
}

export async function createEvent(input: EventInput): Promise<ActionResult<{ id: string }>> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { ok: false, error: ctx.error };
  const { data, error } = await ctx.admin.from('events').insert(toRow(input)).select('id').single();
  if (error || !data) return { ok: false, error: error?.message ?? 'insert-failed' };
  revalidateEventPaths();
  return { ok: true, data: { id: data.id } };
}

export async function updateEvent(id: string, input: EventInput): Promise<DeleteResult> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { ok: false, error: ctx.error };
  const { error } = await ctx.admin.from('events').update(toRow(input)).eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidateEventPaths();
  return { ok: true };
}

export async function deleteEvent(id: string): Promise<DeleteResult> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { ok: false, error: ctx.error };
  const { error } = await ctx.admin.from('events').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidateEventPaths();
  return { ok: true };
}
