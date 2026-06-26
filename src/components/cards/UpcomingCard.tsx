// Card evento in programma (presentazionale). Nessun fetch dati: solo props.
export interface UpcomingCardProps {
  date: string;
  time: string;
  teamA: string;
  teamB: string;
  circuit: string;
}

export function UpcomingCard({ date, time, teamA, teamB, circuit }: UpcomingCardProps) {
  return (
    <article className="rounded-lg border border-white/10 bg-[#1C1C1C] p-5">
      {/* Badge data/ora */}
      <span className="inline-block rounded bg-white/10 px-2 py-1 text-xs font-semibold uppercase tracking-wide text-sandr-text">
        {date} · {time}
      </span>
      <p className="mt-4 font-condensed text-lg uppercase tracking-wide text-sandr-text">
        <span>{teamA}</span> <span className="text-sandr-muted">vs</span> <span>{teamB}</span>
      </p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[#F04E00]">
        {circuit}
      </p>
    </article>
  );
}
