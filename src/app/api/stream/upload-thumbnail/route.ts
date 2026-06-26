// Route server-side — CLOUDFLARE_STREAM_TOKEN MAI esposto al client.
// AREA CRITICA (CLAUDE.md): Cloudflare Stream custom thumbnail upload.
// NOTA per la review umana: validare l'endpoint esatto contro l'API Cloudflare
// Stream prima della produzione (la generazione thumbnail può differire dal
// semplice POST custom qui implementato secondo specifica).
export async function POST(req: Request) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_STREAM_TOKEN;

  const form = await req.formData();
  const file = form.get('file');
  const videoUid = form.get('videoUid');
  const type = form.get('type'); // 'card' | 'featured'

  // Senza configurazione o input mancante: nessuna chiamata, risposta demo.
  if (!accountId || !token || !videoUid || !(file instanceof File)) {
    return Response.json({ url: null, type, error: 'not-configured' });
  }

  try {
    const upstream = new FormData();
    upstream.append('file', file);

    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/${videoUid}/thumbnail`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: upstream,
      },
    );
    const data = await res.json();
    return Response.json({ url: data.result?.url ?? null, type });
  } catch {
    return Response.json({ url: null, type, error: 'fetch-failed' });
  }
}
