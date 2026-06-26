'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { mockContent } from '@/lib/mock-content';
import type { ContentItem } from '@/types/tags';

// Slide in evidenza: live, replay (Beach Pro Tour finale), intervista.
const slides = ['live-1', 'replay-1', 'interview-1']
  .map((id) => mockContent.find((c) => c.id === id))
  .filter(Boolean) as ContentItem[];

export function HeroCarousel() {
  const t = useTranslations('AuthHome');
  const [index, setIndex] = useState(0);

  const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), []);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  // Auto-avanzamento ogni 5 secondi.
  useEffect(() => {
    const id = setInterval(next, 5000);
    return () => clearInterval(id);
  }, [next]);

  const slide = slides[index];

  return (
    <section className="relative h-[500px] w-full overflow-hidden bg-[#1C1C1C]">
      {/* Sfondo con gradiente sottile */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#141414] via-[#1C1C1C] to-[#242424]" />
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(20,20,20,0.95), transparent 60%)' }}
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
          href={`/live/${slide.id}`}
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
              i === index ? 'w-6 bg-sandr-orange' : 'w-2 bg-white/40'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
