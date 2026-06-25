import createNextIntlPlugin from 'next-intl/plugin';

// next-intl: il file di request config vive in src/i18n/request.ts
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Cloudflare Stream thumbnails
      { protocol: 'https', hostname: 'customer-*.cloudflarestream.com' },
      { protocol: 'https', hostname: 'videodelivery.net' },
      // Supabase Storage
      { protocol: 'https', hostname: '*.supabase.co' },
    ],
  },
};

export default withNextIntl(nextConfig);
