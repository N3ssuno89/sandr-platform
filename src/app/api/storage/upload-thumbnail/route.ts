import { getAdminContext } from '@/lib/supabase/guard';

// Upload copertina su Supabase Storage (bucket pubblico `video-thumbnails`).
// AREA CRITICA (CLAUDE.md): scrittura admin via service role (mai lato client).
// Build-safe: risponde { url: null, error } se non configurato / non admin.
export async function POST(req: Request) {
  const ctx = await getAdminContext();
  const form = await req.formData();
  const file = form.get('file');
  const kind = (form.get('type') as string) || 'card'; // 'card' | 'featured'

  if (!ctx.ok) return Response.json({ url: null, error: ctx.error });
  if (!(file instanceof File)) return Response.json({ url: null, error: 'bad-file' });

  try {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const path = `${kind}/${crypto.randomUUID()}.${ext}`;
    const { error } = await ctx.admin.storage
      .from('video-thumbnails')
      .upload(path, file, { contentType: file.type || 'image/jpeg', upsert: true });
    if (error) return Response.json({ url: null, error: error.message });

    const { data } = ctx.admin.storage.from('video-thumbnails').getPublicUrl(path);
    return Response.json({ url: data.publicUrl });
  } catch {
    return Response.json({ url: null, error: 'upload-failed' });
  }
}
