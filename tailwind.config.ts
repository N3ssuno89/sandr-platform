import type { Config } from 'tailwindcss';

// Palette e font SANDR — vedi CLAUDE.md, sezione "Identità visiva".
// Non modificare i valori senza approvazione del founder.
const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Background
        'sandr-black': '#0C0C0C',
        'sandr-surface': '#1A1A1A',
        // Accento principale (arancione SANDR)
        // NB: aggiornato a #F04E00 su richiesta del founder (era #E8500A in
        // CLAUDE.md). Allineare CLAUDE.md/FACTORY.md di conseguenza.
        'sandr-orange': '#F04E00',
        // Testo
        'sandr-text': '#F7F5F2',
        'sandr-muted': '#888888',
      },
      fontFamily: {
        // Headlines: Archivo Black / Barlow Condensed — body: DM Sans
        display: ['var(--font-archivo-black)', 'sans-serif'],
        condensed: ['var(--font-barlow-condensed)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
