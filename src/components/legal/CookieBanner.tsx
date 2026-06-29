'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

// Nome del cookie che memorizza le preferenze (NON localStorage: cookie reale).
const COOKIE_NAME = 'sandr_cookie_consent';
const MAX_AGE = 60 * 60 * 24 * 180; // 180 giorni

type Prefs = { necessary: true; analytics: boolean; profiling: boolean; marketing: boolean };

function readConsent(): Prefs | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.split('; ').find((c) => c.startsWith(`${COOKIE_NAME}=`));
  if (!match) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(match.split('=').slice(1).join('=')));
    return { necessary: true, analytics: !!parsed.analytics, profiling: !!parsed.profiling, marketing: !!parsed.marketing };
  } catch {
    return null;
  }
}

function writeConsent(prefs: Prefs) {
  const value = encodeURIComponent(JSON.stringify(prefs));
  document.cookie = `${COOKIE_NAME}=${value}; path=/; max-age=${MAX_AGE}; SameSite=Lax`;
}

// Banner consenso cookie. Appare al primo accesso (cookie assente). Salva le
// preferenze nel cookie sandr_cookie_consent. AREA CRITICA (CLAUDE.md): privacy.
export function CookieBanner() {
  const t = useTranslations('CookieBanner');
  const locale = useLocale();
  const [visible, setVisible] = useState(false);
  const [customize, setCustomize] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [profiling, setProfiling] = useState(false);
  const [marketing, setMarketing] = useState(false);

  // Mostra il banner solo se non c'è ancora una scelta salvata.
  useEffect(() => {
    if (!readConsent()) setVisible(true);
  }, []);

  if (!visible) return null;

  const persist = (prefs: Prefs) => {
    writeConsent(prefs);
    setVisible(false);
  };
  const acceptAll = () => persist({ necessary: true, analytics: true, profiling: true, marketing: true });
  const onlyNecessary = () => persist({ necessary: true, analytics: false, profiling: false, marketing: false });
  const saveCustom = () => persist({ necessary: true, analytics, profiling, marketing });

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-white/10 bg-[#0C0C0C]/95 backdrop-blur">
      <div className="mx-auto max-w-5xl px-4 py-4">
        {!customize ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[13px] leading-relaxed text-[#C0BDB8]">
              {t('text')}{' '}
              <a href={`/${locale}/privacy`} className="text-[#F04E00] hover:underline">{t('privacyLink')}</a>
              {' · '}
              <a href={`/${locale}/cookie-policy`} className="text-[#F04E00] hover:underline">{t('cookieLink')}</a>
            </p>
            <div className="flex shrink-0 flex-wrap gap-2">
              <button type="button" onClick={() => setCustomize(true)} className="rounded-lg border border-white/15 px-4 py-2 font-condensed text-xs font-bold uppercase tracking-wide text-white hover:border-[#F04E00] hover:text-[#F04E00]">
                {t('customize')}
              </button>
              <button type="button" onClick={onlyNecessary} className="rounded-lg border border-white/15 px-4 py-2 font-condensed text-xs font-bold uppercase tracking-wide text-white hover:border-[#F04E00] hover:text-[#F04E00]">
                {t('onlyNecessary')}
              </button>
              <button type="button" onClick={acceptAll} className="rounded-lg bg-sandr-orange px-4 py-2 font-condensed text-xs font-bold uppercase tracking-wide text-black">
                {t('acceptAll')}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-condensed text-lg font-bold uppercase text-white">{t('title')}</h3>
              <button type="button" onClick={() => setCustomize(false)} className="text-sm text-[#888888] hover:text-white" aria-label={t('close')}>×</button>
            </div>
            <div className="space-y-2">
              <Toggle label={t('necessary')} desc={t('necessaryDesc')} checked disabled note={t('necessaryAlways')} />
              <Toggle label={t('analytics')} desc={t('analyticsDesc')} checked={analytics} onChange={setAnalytics} />
              <Toggle label={t('profiling')} desc={t('profilingDesc')} checked={profiling} onChange={setProfiling} />
              <Toggle label={t('marketing')} desc={t('marketingDesc')} checked={marketing} onChange={setMarketing} />
            </div>
            <div className="mt-4 flex flex-wrap justify-end gap-2">
              <button type="button" onClick={onlyNecessary} className="rounded-lg border border-white/15 px-4 py-2 font-condensed text-xs font-bold uppercase tracking-wide text-white hover:border-[#F04E00] hover:text-[#F04E00]">
                {t('onlyNecessary')}
              </button>
              <button type="button" onClick={saveCustom} className="rounded-lg bg-sandr-orange px-4 py-2 font-condensed text-xs font-bold uppercase tracking-wide text-black">
                {t('save')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Toggle({
  label,
  desc,
  checked,
  onChange,
  disabled = false,
  note,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange?: (v: boolean) => void;
  disabled?: boolean;
  note?: string;
}) {
  return (
    <label className={`flex items-start gap-3 rounded-lg border border-white/[0.06] bg-[#1C1C1C] p-3 ${disabled ? 'opacity-70' : 'cursor-pointer'}`}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#F04E00]"
      />
      <span className="min-w-0">
        <span className="flex items-center gap-2">
          <span className="font-condensed text-sm font-bold uppercase tracking-wide text-white">{label}</span>
          {note ? <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-[#888888]">{note}</span> : null}
        </span>
        <span className="mt-0.5 block text-[12px] leading-relaxed text-[#888888]">{desc}</span>
      </span>
    </label>
  );
}
