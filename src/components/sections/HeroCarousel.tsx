'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { mockContent } from '@/lib/mock-content';
import type { ContentItem } from '@/types/tags';

// Slide mock di fallback: live, replay (Beach Pro Tour finale), intervista.
const mockSlides = ['live-1', 'replay-1', 'interview-1']
  .map((id) => mockContent.find((c) => c.id === id))
  .filter(Boolean) as ContentItem[];

export function HeroCarousel({ featuredVideos }: { featuredVideos?: ContentItem[] }) {
  const t = useTranslations('AuthHome');
  const [index, setIndex] = useState(0);

  // Video reali in evidenza se presenti (length > 0), altrimenti slide mock.
  // NON deve mai cadere sul mock quando ci sono video in evidenza.
  const slides = featuredVideos && featuredVideos.length > 0 ? featuredVideos : mockSlides;
  const usingFeatured = slides !== mockSlides;

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), [slides.length]);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  // Auto-avanzamento ogni 6 secondi.
  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, [next]);

  // Clamp: la sorgente può cambiare numero di slide tra i render.
  const active = index % slides.length;
  const slide = slides[active];
  const href = usingFeatured ? `/vod/${slide.id}` : `/live/${slide.id}`;

  return (
    <section className="relative w-full overflow-hidden bg-[#1C1C1C] h-[64vh] min-h-[440px] md:h-[78vh] md:min-h-[560px] md:max-h-[900px]">
      {/* OPTION B (modello DAZN): altezza fissa alta, immagine SEMPRE a tutta
          larghezza/altezza con object-cover + object-center → riempie il
          contenitore senza barre nere, ritagliando dal centro ciò che eccede.
          Immagine vivida: il testo è leggibile grazie al solo gradiente in basso.
          Le slide sono impilate con crossfade morbido (opacity) al cambio. */}
      {slides.map((s, i) => {
        const sbg = s.thumbnailFeatured || s.thumbnail;
        return (
          <div
            key={s.id}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === active ? 1 : 0 }}
            aria-hidden={i === active ? undefined : true}
          >
            {sbg ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={sbg} alt="" className="absolute inset-0 h-full w-full object-cover object-center" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-tr from-[#141414] via-[#1C1C1C] to-[#242424]" />
            )}
          </div>
        );
      })}
      {/* Gradiente solo in basso (dove stanno titolo/CTA): immagine luminosa sopra. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 40%, transparent 65%)',
        }}
      />

      {/* Info overlay in basso a sinistra */}
      <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-16">
        <span className="inline-block w-fit rounded bg-sandr-orange px-2 py-1 text-xs font-bold uppercase tracking-wide text-black">
          {slide.circuit}
        </span>
        <h2 className="mt-3 max-w-2xl font-condensed text-3xl font-extrabold uppercase leading-tight text-white md:text-5xl">
          {slide.title}
        </h2>
        {slide.teams ? <p className="mt-2 text-[#C0BDB8]">{slide.teams}</p> : null}
        <Link
          href={href}
          className="mt-5 w-fit rounded-lg bg-sandr-orange px-7 py-3 font-condensed font-bold uppercase tracking-wide text-black"
        >
          {t('watchNow')}
        </Link>
      </div>

      {/* Frecce prev/next */}
      <button
        type="button"
        aria-label="Previous"
        onClick={prev}
        className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-2xl text-white hover:bg-black/70"
      >
        ‹
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={next}
        className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-2xl text-white hover:bg-black/70"
      >
        ›
      </button>

      {/* Dot di navigazione */}
      <div className="absolute inset-x-0 bottom-5 flex justify-center gap-2">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all ${
              i === active ? 'w-6 bg-sandr-orange' : 'w-2 bg-white/40'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
