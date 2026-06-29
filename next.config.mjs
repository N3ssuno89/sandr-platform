import createNextIntlPlugin from 'next-intl/plugin';

// next-intl: il file di request config vive in src/i18n/request.ts
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Security headers applicati a tutte le rotte.
const securityHeaders = [
  // Previene il clickjacking impedendo il framing cross-origin.
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  // Blocca il MIME-sniffing del browser.
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Limita le informazioni di referrer inviate ad altre origini.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Gli upload immagine (foto atleti, loghi, copertine) passano per le server
    // action: alza il limite del body oltre il default di 1MB.
    serverActions: { bodySizeLimit: '8mb' },
  },
  images: {
    remotePatterns: [
      // Cloudflare Stream thumbnails
      { protocol: 'https', hostname: 'customer-*.cloudflarestream.com' },
      { protocol: 'https', hostname: 'videodelivery.net' },
      // Supabase Storage
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default withNextIntl(nextConfig);
