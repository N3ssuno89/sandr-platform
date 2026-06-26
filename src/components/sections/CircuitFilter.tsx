'use client';

import { useTranslations } from 'next-intl';
import type { CircuitTag } from '@/types/tags';

// Tutti i circuiti (CircuitTag). "Tutti" è gestito a parte.
export const CIRCUITS: CircuitTag[] = [
  'FIPAV',
  'AIBVC',
  'AVP',
  'BPT',
  'CEV',
  'FIVB',
  'King & Queen',
  'Marathon',
  'Beach Pro Tour',
];

export type CircuitSelection = CircuitTag | 'all';

// Barra filtri circuiti (sticky). Controllata dal parent: filtra tutte le righe.
export function CircuitFilter({
  selected,
  onSelect,
}: {
  selected: CircuitSelection;
  onSelect: (c: CircuitSelection) => void;
}) {
  const t = useTranslations('AuthHome');

  return (
    <div className="sticky top-16 z-40 border-b border-white/[0.08] bg-[#1C1C1C]">
      <div className="no-scrollbar mx-auto max-w-6xl overflow-x-auto px-4">
        <div className="flex gap-2 whitespace-nowrap py-3">
          <Pill active={selected === 'all'} onClick={() => onSelect('all')}>
            {t('all')}
          </Pill>
          {CIRCUITS.map((c) => (
            <Pill key={c} active={selected === c} onClick={() => onSelect(c)}>
              {c}
            </Pill>
          ))}
        </div>
      </div>
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-[20px] px-4 py-2 font-condensed text-[13px] font-bold uppercase transition-colors ${
        active ? 'bg-sandr-orange text-black' : 'bg-white/[0.06] text-[#C0BDB8] hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  );
}
