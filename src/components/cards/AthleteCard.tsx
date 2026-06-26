import { Link } from '@/i18n/routing';
import type { Athlete } from '@/types/athlete';

// Card atleta (presentazionale). Click -> profilo /athletes/[id].
export function AthleteCard({ athlete, cardWidth }: { athlete: Athlete; cardWidth?: number }) {
  return (
    <Link
      href={`/athletes/${athlete.id}`}
      style={{ width: cardWidth ?? 200 }}
      className="group block overflow-hidden rounded-xl border border-white/[0.08] bg-[#1C1C1C] transition-transform hover:scale-[1.02] hover:border-sandr-orange/60"
    >
      {/* Foto quadrata 1:1 */}
      <div className="relative w-full" style={{ paddingBottom: '100%' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={athlete.photo} alt={athlete.name} className="absolute inset-0 h-full w-full object-cover" />

        {/* Overlay informazioni */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3">
          <span className="inline-block rounded-full bg-sandr-orange px-2 py-0.5 text-[10px] font-bold uppercase text-black">
            {athlete.circuit}
          </span>
          <p className="mt-1 font-condensed text-base font-bold uppercase leading-tight text-white">
            {athlete.name}
          </p>
          <p className="text-[12px] text-[#888888]">
            {athlete.nationFlag} · {athlete.nation}
          </p>
        </div>
      </div>
    </Link>
  );
}
