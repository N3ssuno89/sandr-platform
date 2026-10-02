import Image from 'next/image';

// Copertina 16:9 riutilizzabile. Se c'è un'immagine reale usa next/image
// (ottimizzata, lazy, host già configurati in next.config). Altrimenti mostra un
// placeholder CURATO coerente col volto (gradiente + glifo sport), invece di un
// box vuoto. `label` opzionale in sovraimpressione (es. sigla circuito).
export function Thumb({
  src,
  alt = '',
  label,
  rounded = false,
}: {
  src?: string | null;
  alt?: string;
  label?: string | null;
  rounded?: boolean;
}) {
  return (
    <div
      className={`relative aspect-video w-full overflow-hidden ${rounded ? 'rounded-xl' : ''}`}
      style={{ backgroundColor: 'var(--face-img)' }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px"
          className="object-cover"
        />
      ) : (
        <>
          {/* Gradiente morbido + glifo sport centrato (placeholder curato). */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(120% 120% at 20% 0%, rgba(240,78,0,0.18), transparent 55%)',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-40">
            <BallGlyph />
          </div>
          {label ? (
            <span className="absolute bottom-2 left-2 rounded bg-black/55 px-1.5 py-0.5 font-barlow text-[9px] font-bold uppercase tracking-wide text-white">
              {label}
            </span>
          ) : null}
        </>
      )}
    </div>
  );
}

function BallGlyph() {
  return (
    <svg width="46" height="46" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M12 3c3 2.5 4.5 6 4.5 9S15 18.5 12 21M12 3C9 5.5 7.5 9 7.5 12S9 18.5 12 21M3.2 10.5c3 .8 7 .6 10-1 2.3-1.2 4.2-3 5.4-5.2M3.5 14.5c3.5-.2 7 .8 9.7 3 1.7 1.4 3 3.3 3.6 5.2"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  );
}
