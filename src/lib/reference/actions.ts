'use server';

import { revalidatePath } from 'next/cache';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { isSupabaseConfiguredServer } from '@/lib/supabase/admin';
import { getAdminContext, getReadClient } from '@/lib/supabase/guard';
import type {
  SportRef,
  FederationRef,
  AthleteRef,
  AthleteFull,
  AthleteInput,
  FederationFull,
  FederationInput,
  ActionResult,
  DeleteResult,
} from './types';

const ATHLETE_COLS = 'id,full_name,nation,nation_code,photo_url,sport_id,federation_id,bio,ranking,season_points,is_featured,birth_date';
const FEDERATION_COLS = 'id,name,short_name,slug,sport_id,nation,color,logo_url,description';

// Invalida la cache delle rotte che mostrano atleti/federazioni dopo una
// scrittura (forma '/[locale]/...' type 'page' per coprire tutte le locale).
function revalidateAthletePaths() {
  revalidatePath('/[locale]/dashboard/admin/athletes', 'page');
  revalidatePath('/[locale]/athletes', 'page');
  revalidatePath('/[locale]/dashboard/home', 'page');
  // Landing pubblica: riga "Atleti in evidenza" (is_featured).
  revalidatePath('/[locale]', 'page');
}

function revalidateFederationPaths() {
  revalidatePath('/[locale]/dashboard/admin/federations', 'page');
  revalidatePath('/[locale]/dashboard/admin/events', 'page');
  revalidatePath('/[locale]/dashboard/home', 'page');
}

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

// ----- READ admin (tutte le righe, bypassa RLS via service role) -----
export async function getAthletesFull(): Promise<AthleteFull[]> {
  const db = getReadClient();
  if (!db) return [];
  const { data } = await db.from('athletes').select(ATHLETE_COLS).order('full_name');
  return (data as AthleteFull[] | null) ?? [];
}

export async function getAthleteById(id: string): Promise<AthleteFull | null> {
  const db = getReadClient();
  if (!db) return null;
  const { data } = await db.from('athletes').select(ATHLETE_COLS).eq('id', id).maybeSingle();
  return (data as AthleteFull | null) ?? null;
}

export async function getFederationsFull(): Promise<FederationFull[]> {
  const db = getReadClient();
  if (!db) return [];
  const { data } = await db.from('federations').select(FEDERATION_COLS).order('name');
  return (data as FederationFull[] | null) ?? [];
}

export async function getFederationById(id: string): Promise<FederationFull | null> {
  const db = getReadClient();
  if (!db) return null;
  const { data } = await db.from('federations').select(FEDERATION_COLS).eq('id', id).maybeSingle();
  return (data as FederationFull | null) ?? null;
}

// ----- WRITE (admin) ------------------------------------------------
export async function createFederation(input: FederationInput): Promise<ActionResult<FederationRef>> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { ok: false, error: ctx.error };

  console.log('saving federation with logo_url:', input.logo_url ?? null);
  const { data, error } = await ctx.admin
    .from('federations')
    .insert({
      name: input.name,
      short_name: input.short_name || null,
      slug: slugify(input.short_name || input.name),
      sport_id: input.sport_id || null,
      nation: input.nation || null,
      color: input.color || null,
      description: input.description || null,
      logo_url: input.logo_url || null,
    })
    .select('id,name,short_name,slug,sport_id,nation,color')
    .single();

  if (error || !data) return { ok: false, error: error?.message ?? 'insert-failed' };
  revalidateFederationPaths();
  return { ok: true, data };
}

export async function updateFederation(id: string, input: FederationInput): Promise<DeleteResult> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { ok: false, error: ctx.error };
  console.log('saving federation with logo_url:', input.logo_url ?? null);
  const { error } = await ctx.admin
    .from('federations')
    .update({
      name: input.name,
      short_name: input.short_name || null,
      slug: slugify(input.short_name || input.name),
      sport_id: input.sport_id || null,
      nation: input.nation || null,
      color: input.color || null,
      description: input.description || null,
      logo_url: input.logo_url || null,
    })
    .eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidateFederationPaths();
  return { ok: true };
}

export async function deleteFederation(id: string): Promise<DeleteResult> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { ok: false, error: ctx.error };
  const { error } = await ctx.admin.from('federations').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidateFederationPaths();
  return { ok: true };
}

export async function createAthlete(input: AthleteInput): Promise<ActionResult<AthleteRef>> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { ok: false, error: ctx.error };

  console.log('saving athlete with photo_url:', input.photo_url ?? null);
  const { data, error } = await ctx.admin
    .from('athletes')
    .insert({
      full_name: input.full_name,
      nation: input.nation || null,
      nation_code: input.nation_code || null,
      photo_url: input.photo_url || null,
      sport_id: input.sport_id || null,
      federation_id: input.federation_id || null,
      bio: input.bio || null,
      ranking: input.ranking ?? null,
      season_points: input.season_points ?? null,
      is_featured: input.is_featured ?? false,
      birth_date: input.birth_date || null,
    })
    .select('id,full_name,nation,sport_id,federation_id')
    .single();

  if (error || !data) return { ok: false, error: error?.message ?? 'insert-failed' };
  revalidateAthletePaths();
  return { ok: true, data };
}

export async function updateAthlete(id: string, input: AthleteInput): Promise<DeleteResult> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { ok: false, error: ctx.error };
  console.log('saving athlete with photo_url:', input.photo_url ?? null);
  const { error } = await ctx.admin
    .from('athletes')
    .update({
      full_name: input.full_name,
      nation: input.nation || null,
      nation_code: input.nation_code || null,
      photo_url: input.photo_url || null,
      sport_id: input.sport_id || null,
      federation_id: input.federation_id || null,
      bio: input.bio || null,
      ranking: input.ranking ?? null,
      season_points: input.season_points ?? null,
      is_featured: input.is_featured ?? false,
      birth_date: input.birth_date || null,
    })
    .eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidateAthletePaths();
  return { ok: true };
}

// Toggle rapido "in evidenza" dalla lista admin atleti.
export async function setAthleteFeatured(id: string, value: boolean): Promise<DeleteResult> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { ok: false, error: ctx.error };
  const { error } = await ctx.admin.from('athletes').update({ is_featured: value }).eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidateAthletePaths();
  return { ok: true };
}

export async function deleteAthlete(id: string): Promise<DeleteResult> {
  const ctx = await getAdminContext();
  if (!ctx.ok) return { ok: false, error: ctx.error };
  const { error } = await ctx.admin.from('athletes').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  revalidateAthletePaths();
  return { ok: true };
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
  revalidateAthletePaths();
  revalidateFederationPaths();
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
