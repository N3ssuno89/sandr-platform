import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getTournaments } from '@/lib/data';

// "Vicino a te" (volto OPEN): tornei Open raggruppati per località, con filtro
// per città (?city=). La geolocalizzazione reale arriverà col backend; per ora
// il filtro è per località dal catalogo. Dati SOLO da @/lib/data.
export default async function OpenVicinoPage({
  params,
  searchParams,
}: {
  params: { locale: string };
  searchParams: { city?: string };
}) {
  setRequestLocale(params.locale);
  const t = await getTranslations('OpenNear');

  const groups = await getTournaments();
  const openEditions = groups
    .flatMap((g) => g.editions)
    .filter((e) => e.face === 'open');

  // Città disponibili (prima parola della località, deduplicata).
  const cities = Array.from(
    new Set(openEditions.map((e) => e.location).filter((l): l is string => !!l)),
  ).sort();

  const selected = searchParams.city ?? '';
  const shown = selected ? openEditions.filter((e) => e.location === selected) : openEditions;

  return (
    <div className="mx-auto max-w-[1360px] px-4 py-10 md:px-10">
      <h1 className="font-display text-4xl uppercase tracking-tight">{t('title')}</h1>
      <p className="mt-1 font-barlow text-sm text-[color:var(--face-muted)]">{t('subtitle')}</p>

      {/* Filtro città (chip) */}
      {cities.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-2">
          <Chip href="/open/vicino" active={!selected} label={t('all')} />
          {cities.map((c) => (
            <Chip
              key={c}
              href={`/open/vicino?city=${encodeURIComponent(c)}`}
              active={selected === c}
              label={c}
            />
          ))}
        </div>
      ) : null}

      {/* Elenco */}
      {shown.length === 0 ? (
        <p className="mt-8 font-barlow text-[color:var(--face-muted)]">{t('empty')}</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((e) => (
            <Link
              key={e.id}
              href="/open/tornei"
              className="rounded-xl border p-5"
              style={{ backgroundColor: 'var(--face-surface)', borderColor: 'var(--face-border)' }}
            >
              <span className="rounded bg-[color:var(--face-accent)] px-2 py-0.5 font-barlow text-[10px] font-bold uppercase tracking-wide text-white">
                Open
              </span>
              <h3 className="mt-3 font-narrow text-lg font-bold uppercase tracking-wide">{e.name}</h3>
              <p className="mt-1 font-barlow text-sm text-[color:var(--face-muted)]">{e.dates}</p>
              {e.location ? (
                <p className="font-barlow text-sm text-[color:var(--face-muted)]">{e.location}</p>
              ) : null}
            </Link>
          ))}
        </div>
      )}

      <p className="mt-10 font-barlow text-xs text-[color:var(--face-muted)]">{t('geoNote')}</p>
    </div>
  );
}

function Chip({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <Link
      href={href}
      aria-current={active ? 'true' : undefined}
      className="rounded-full px-4 py-1.5 font-barlow text-sm font-semibold transition-colors"
      style={
        active
          ? { backgroundColor: 'var(--face-accent)', color: '#fff' }
          : { backgroundColor: 'var(--face-chip)', color: 'var(--face-fg)' }
      }
    >
      {label}
    </Link>
  );
}
