'use server';

import { createClient as createServerClient } from '@/lib/supabase/server';
import { isSupabaseConfiguredServer } from '@/lib/supabase/admin';
import { getAdminContext } from '@/lib/supabase/guard';
import type { SportRef, FederationRef, AthleteRef, ActionResult } from './types';

// slug semplice da nome (lowercase, trattini).
function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// ----- READ (pubblici: dropdown admin) ------------------------------
export async function getSports(): Promise<SportRef[]> {
  if (!isSupabaseConfiguredServer()) return [];
  const sb = createServerClient();
  const { data } = await sb.from('sports').select('id,name,slug').order('sort_order');
  return data ?? [];
}

export async function getFederations(): Promise<FederationRef[]> {
  if (!isSupabaseConfiguredServer()) return [];
  const sb = createServerClient();
  const { data } = await sb
    .from('federations')
    .select('id,name,short_name,slug,sport_id,nation,color')
    .order('name');
  return data ?? [];
}

export async function getAthletes(): Promise<AthleteRef[]> {
  if (!isSupabaseConfiguredServer()) return [];
  const sb = createServerClient();
  const { data } = await sb
    .from('athletes')
    .select('id,full_name,nation,sport_id,federation_id')
    .order('full_name');
  return data ?? [];
}

// Tag distinti già usati (per i suggerimenti dell'autocomplete).
export async function getExistingTags(): Promise<string[]> {
  if (!isSupabaseConfiguredServer()) return [];
  const sb = createServerClient();
  const { data } = await sb.from('video_tags').select('tag');
  const set = new Set<string>();
  (data ?? []).forEach((r) => set.add(r.tag));
  return Array.from(set).sort();
}

// ----- WRITE (admin) ------------------------------------------------
export async function createFederation(input: {
  name: string;
  short_name?: string;
  sport_id?: string;
  nation?: string;
  color?: string;
}): Promise<ActionResult<FederationRef>> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { ok: false, error: ctx.error };

  const { data, error } = await ctx.admin
    .from('federations')
    .insert({
      name: input.name,
      short_name: input.short_name || null,
      slug: slugify(input.short_name || input.name),
      sport_id: input.sport_id || null,
      nation: input.nation || null,
      color: input.color || null,
    })
    .select('id,name,short_name,slug,sport_id,nation,color')
    .single();

  if (error || !data) return { ok: false, error: error?.message ?? 'insert-failed' };
  return { ok: true, data };
}

export async function createAthlete(input: {
  full_name: string;
  nation?: string;
  sport_id?: string;
  federation_id?: string;
}): Promise<ActionResult<AthleteRef>> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { ok: false, error: ctx.error };

  const { data, error } = await ctx.admin
    .from('athletes')
    .insert({
      full_name: input.full_name,
      nation: input.nation || null,
      sport_id: input.sport_id || null,
      federation_id: input.federation_id || null,
    })
    .select('id,full_name,nation,sport_id,federation_id')
    .single();

  if (error || !data) return { ok: false, error: error?.message ?? 'insert-failed' };
  return { ok: true, data };
}

// Gli SPORT sono una TABELLA (non un enum): "aggiungi sport" inserisce una riga.
export async function createSport(input: { name: string }): Promise<ActionResult<SportRef>> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { ok: false, error: ctx.error };

  const { data, error } = await ctx.admin
    .from('sports')
    .insert({ name: input.name, slug: slugify(input.name) })
    .select('id,name,slug')
    .single();

  if (error || !data) return { ok: false, error: error?.message ?? 'insert-failed' };
  return { ok: true, data };
}

// content_type È un enum: estenderlo MODIFICA lo schema (ADMIN-ONLY).
// ⚠️ ATTENZIONE: ALTER TYPE ... ADD VALUE è irreversibile e cambia lo schema DB.
export async function addContentTypeEnum(value: string): Promise<ActionResult<string>> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { ok: false, error: ctx.error };

  const { error } = await ctx.admin.rpc('admin_add_enum_value', {
    enum_name: 'content_type',
    new_value: value,
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: value };
}
