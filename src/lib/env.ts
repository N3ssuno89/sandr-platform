// Accesso centralizzato alle variabili d'ambiente.
// Le variabili NEXT_PUBLIC_* sono disponibili anche lato client.

function required(name: string, value: string | undefined): string {
  // Error handling esplicito: una env mancante deve fallire subito e in chiaro.
  if (!value) {
    throw new Error(`Variabile d'ambiente mancante: ${name}`);
  }
  return value;
}

export const env = {
  // Fallback al dominio HTTPS reale, mai un http:// hardcoded.
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sandr.tv',

  supabase: {
    url: () => required('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL),
    anonKey: () =>
      required('NEXT_PUBLIC_SUPABASE_ANON_KEY', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    serviceRoleKey: () =>
      required('SUPABASE_SERVICE_ROLE_KEY', process.env.SUPABASE_SERVICE_ROLE_KEY),
  },

  stripe: {
    publishableKey: () =>
      required(
        'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      ),
    secretKey: () => required('STRIPE_SECRET_KEY', process.env.STRIPE_SECRET_KEY),
    webhookSecret: () =>
      required('STRIPE_WEBHOOK_SECRET', process.env.STRIPE_WEBHOOK_SECRET),
  },

  cloudflare: {
    // AREA CRITICA (CLAUDE.md): Cloudflare Stream richiede review umana.
    accountId: () => required('CLOUDFLARE_ACCOUNT_ID', process.env.CLOUDFLARE_ACCOUNT_ID),
    // Token Stream — SOLO server-side, mai esposto al client.
    streamToken: () => required('CLOUDFLARE_STREAM_TOKEN', process.env.CLOUDFLARE_STREAM_TOKEN),
    // Account ID pubblico per l'embed iframe (lato client).
    publicAccountId: () =>
      required('NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID', process.env.NEXT_PUBLIC_CLOUDFLARE_ACCOUNT_ID),
    streamApiToken: () =>
      required('CLOUDFLARE_STREAM_API_TOKEN', process.env.CLOUDFLARE_STREAM_API_TOKEN),
    streamCustomerSubdomain: () =>
      required(
        'NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_SUBDOMAIN',
        process.env.NEXT_PUBLIC_CLOUDFLARE_STREAM_CUSTOMER_SUBDOMAIN,
      ),
  },
} as const;
