// Route server-side — CLOUDFLARE_STREAM_TOKEN MAI esposto al client.
// AREA CRITICA (CLAUDE.md): Cloudflare Stream direct upload, richiede review
// umana prima della produzione.
export async function POST() {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const token = process.env.CLOUDFLARE_STREAM_TOKEN;

  // Senza configurazione: nessuna chiamata, risposta vuota (demo).
  if (!accountId || !token) {
    return Response.json({ uploadURL: null, uid: null, error: 'not-configured' });
  }

  try {
    const res = await fetch(
      `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/direct_upload`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ maxDurationSeconds: 21600 }), // 6 ore max
      },
    );
    const data = await res.json();
    return Response.json({ uploadURL: data.result?.uploadURL ?? null, uid: data.result?.uid ?? null });
  } catch {
    return Response.json({ uploadURL: null, uid: null, error: 'fetch-failed' });
  }
}
