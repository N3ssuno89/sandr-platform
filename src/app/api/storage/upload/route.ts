import { getAdminContext } from '@/lib/supabase/guard';

// Upload generico su Supabase Storage (bucket pubblici whitelisted).
// AREA CRITICA (CLAUDE.md): scrittura admin via service role (mai lato client).
// Build-safe: { url: null, error } se non configurato / non admin.
const ALLOWED = ['video-thumbnails', 'athlete-photos', 'federation-logos'];

export async function POST(req: Request) {
  const ctx = await getAdminContext();
  const form = await req.formData();
  const file = form.get('file');
  const bucket = (form.get('bucket') as string) || '';

  if (!ctx.ok) return Response.json({ url: null, error: ctx.error });
  if (!ALLOWED.includes(bucket)) return Response.json({ url: null, error: 'bucket-not-allowed' });
  if (!(file instanceof File)) return Response.json({ url: null, error: 'bad-file' });

  try {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const path = `${crypto.randomUUID()}.${ext}`;
    const { error } = await ctx.admin.storage
      .from(bucket)
      .upload(path, file, { contentType: file.type || 'image/jpeg', upsert: true });
    if (error) return Response.json({ url: null, error: error.message });

    const { data } = ctx.admin.storage.from(bucket).getPublicUrl(path);
    return Response.json({ url: data.publicUrl });
  } catch {
    return Response.json({ url: null, error: 'upload-failed' });
  }
}
