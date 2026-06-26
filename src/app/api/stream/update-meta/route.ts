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
    return Response.json(data);
  } catch {
    return Response.json({ success: false, error: 'fetch-failed' });
  }
}
