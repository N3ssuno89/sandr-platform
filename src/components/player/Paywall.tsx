import { Link } from '@/i18n/routing';
import type { AccessReason } from '@/lib/access/check';

// Paywall mostrato al posto del player quando l'utente non ha accesso (TASK 4c).
// AREA CRITICA (CLAUDE.md): il controllo accesso avviene SERVER-SIDE; qui è solo
// la UI — il cloudflare_uid non viene mai passato al player se l'accesso è negato.
export function Paywall({ reason, ppvPrice }: { reason: AccessReason; ppvPrice?: number | null }) {
  const isPpv = reason === 'needs-purchase';
  const price = typeof ppvPrice === 'number' ? ppvPrice.toFixed(2) : null;

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-lg">
      {/* Sfondo scuro/sfocato dell'area video con lucchetto */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1C1C1C] to-black" />
      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center">
        <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-sandr-orange/40 bg-sandr-orange/10">
          {/* Lucchetto */}
          <svg viewBox="0 0 24 24" className="h-7 w-7 text-sandr-orange" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="11" width="16" height="9" rx="2" />
            <path d="M8 11V8a4 4 0 0 1 8 0v3" />
          </svg>
        </span>

        <h2 className="font-condensed text-2xl font-extrabold uppercase tracking-wide text-white sm:text-3xl">
          {isPpv ? 'Contenuto PPV' : 'Contenuto Premium'}
        </h2>

        {isPpv ? (
          <>
            <p className="mt-2 max-w-md text-sm text-[#C0BDB8]">
              Acquista questo evento per guardarlo on demand.
            </p>
            <button
              type="button"
              disabled
              className="mt-5 cursor-not-allowed rounded-lg bg-[#F0A800]/80 px-6 py-3 font-condensed font-bold uppercase tracking-wide text-black opacity-70"
            >
              {price ? `Acquista questo evento — €${price}` : 'Acquista questo evento'}
            </button>
            <p className="mt-2 text-[12px] uppercase tracking-wide text-[#888888]">Disponibile a breve</p>
          </>
        ) : (
          <>
            <p className="mt-2 max-w-md text-sm text-[#C0BDB8]">
              Abbonati a SANDR Premium per guardare questo e tutti i contenuti.
            </p>
            <Link
              href="/pricing"
              className="mt-5 rounded-lg bg-sandr-orange px-6 py-3 font-condensed font-bold uppercase tracking-wide text-black"
            >
              Abbonati ora
            </Link>
            <p className="mt-2 text-[12px] uppercase tracking-wide text-[#888888]">
              Inizia con 24h di prova gratuita
            </p>
          </>
        )}
      </div>
    </div>
  );
}
