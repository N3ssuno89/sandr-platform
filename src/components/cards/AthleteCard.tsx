import { Link } from '@/i18n/routing';
import type { Athlete } from '@/types/athlete';
import { PhotoFill } from '@/components/ui/PhotoFill';

// Card atleta verticale stile "stories". Click -> profilo /athletes/[id].
// Con cardWidth: larghezza fissa (px). Senza: riempie la cella (grid).
export function AthleteCard({ athlete, cardWidth }: { athlete: Athlete; cardWidth?: number }) {
  return (
    <Link
      href={`/athletes/${athlete.id}`}
      style={{ width: cardWidth, aspectRatio: '2 / 3' }}
      className={`group relative block overflow-hidden rounded-xl border border-white/[0.08] transition-transform hover:scale-[1.03] hover:border-sandr-orange ${
        cardWidth ? '' : 'w-full'
      }`}
    >
      {/* Foto full-bleed (placeholder con iniziali se assente/errore) */}
      <PhotoFill src={athlete.photo} name={athlete.name} />

      {/* Overlay gradiente scuro (parte bassa) */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)' }}
      />

      {/* Tag sport in alto a destra */}
      <span className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-sandr-text">
        {athlete.sport}
      </span>

      {/* Contenuto in basso */}
      <div className="absolute inset-x-0 bottom-0 p-3">
        <p className="font-condensed font-bold uppercase text-sandr-orange" style={{ fontSize: '10px', letterSpacing: '2px' }}>
          {athlete.nationFlag}
        </p>
        <p className="font-condensed text-sm font-extrabold uppercase leading-[1.1] text-white">
          {athlete.name}
        </p>
        <span className="mt-1 inline-block rounded-full bg-sandr-orange px-1.5 py-0.5 text-[9px] font-bold uppercase text-black">
          {athlete.circuit}
        </span>
      </div>
    </Link>
  );
}
