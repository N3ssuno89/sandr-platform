// Route server-side — CLOUDFLARE_STREAM_TOKEN MAI esposto al client.
// AREA CRITICA (CLAUDE.md): Cloudflare Stream metadata update, richiede review
// umana prima della produzione.
export async function POST(req: Request) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_STREAM_TOKEN;

  const { uid, meta } = await req.json();

  // Senza configurazione o uid: nessuna chiamata, risposta demo.
  if (!accountId || !token || !uid) {
    return Response.json({ success: false, error: 'not-configured' });
  }

  // Cloudflare Stream usa meta.name come TITOLO del video: il body deve sempre
  // includere meta (con name) quando il titolo è fornito.
  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/${uid}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ meta }),
      },
    );
    const data = await res.json();
    // Log di debug (visibile nei log server / Netlify functions).
    console.log('[update-meta] Cloudflare response:', JSON.stringify(data));
    // Ritorna l'oggetto completo così il client può verificare il salvataggio.
    return Response.json(data);
  } catch (err) {
    console.error('[update-meta] fetch error:', err);
    return Response.json({ success: false, error: 'fetch-failed' });
  }
}
