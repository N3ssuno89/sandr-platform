'use client';

import { useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useRouter } from '@/i18n/routing';
import { createClient, isSupabaseConfigured } from '@/lib/supabase/client';
import { DemoPill } from '@/components/account/DemoPill';

// AREA CRITICA (CLAUDE.md): Supabase Auth (profilo, password, logout).
// REAL: profile data from Supabase. MOCK: notification toggles

const cardCls = 'rounded-xl border border-white/[0.08] bg-[#1C1C1C] p-6';
const labelCls = 'mb-2 block font-condensed text-[11px] font-bold uppercase tracking-wide text-[#888888]';
const inputCls =
  'w-full rounded-lg border border-white/[0.08] bg-[#242424] px-4 py-3 text-sm text-white placeholder:text-[#888888] focus:border-[#F04E00] focus:outline-none';

export function SettingsForm({
  initialFullName,
  email,
  initialLanguage,
}: {
  initialFullName: string;
  email: string;
  initialLanguage: string;
}) {
  const router = useRouter();
  const [fullName, setFullName] = useState(initialFullName);
  const [language, setLanguage] = useState(initialLanguage === 'en' ? 'en' : 'it');
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);
  const [resetMsg, setResetMsg] = useState<string | null>(null);
  // MOCK: notification preferences not yet wired
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);

  // REAL: salva nome e lingua su profiles (RLS: self-update).
  async function saveProfile() {
    if (!isSupabaseConfigured()) return;
    setSaving(true);
    setSavedMsg(null);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await (supabase as unknown as SupabaseClient)
        .from('profiles')
        .update({ full_name: fullName, preferred_language: language })
        .eq('id', user.id);
    }
    setSaving(false);
    setSavedMsg('Salvato');
    setTimeout(() => setSavedMsg(null), 2500);
    router.refresh();
  }

  // REAL: invia email di reset password (Supabase Auth).
  async function changePassword() {
    if (!isSupabaseConfigured() || !email) return;
    await createClient().auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined,
    });
    setResetMsg('Ti abbiamo inviato un’email per reimpostare la password.');
  }

  // REAL: logout (signOut) → landing.
  async function logout() {
    if (isSupabaseConfigured()) {
      await createClient().auth.signOut();
    }
    router.push('/');
    router.refresh();
  }

  return (
    <div className="mt-6 space-y-6">
      {/* Profilo — REAL */}
      <div className={cardCls}>
        <p className="font-condensed text-[11px] font-bold uppercase tracking-wide text-[#888888]">Profilo</p>

        <div className="mt-4">
          <label className={labelCls} htmlFor="fullName">Nome completo</label>
          <input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Il tuo nome"
            className={inputCls}
          />
        </div>

        <div className="mt-4">
          <label className={labelCls} htmlFor="email">Email</label>
          <input id="email" value={email} disabled className={`${inputCls} opacity-60`} />
          <p className="mt-1 text-xs text-[#888888]">Per cambiare email contatta il supporto</p>
        </div>

        <div className="mt-4">
          <label className={labelCls}>Lingua preferita</label>
          <div className="flex gap-2">
            {(['it', 'en'] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLanguage(l)}
                className={`rounded-lg border px-5 py-2 font-condensed text-sm font-bold uppercase tracking-wide transition ${
                  language === l
                    ? 'border-[#F04E00] bg-[#F04E00]/15 text-[#F04E00]'
                    : 'border-white/[0.08] bg-[#242424] text-[#888888]'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={saveProfile}
            disabled={saving}
            className="rounded-lg bg-sandr-orange px-5 py-3 font-condensed font-bold uppercase tracking-wide text-black disabled:opacity-60"
          >
            {saving ? 'Salvataggio…' : 'Salva modifiche'}
          </button>
          {savedMsg ? <span className="text-sm font-semibold text-emerald-400">{savedMsg}</span> : null}
        </div>
      </div>

      {/* Sicurezza — REAL */}
      <div className={cardCls}>
        <p className="font-condensed text-[11px] font-bold uppercase tracking-wide text-[#888888]">Sicurezza</p>
        <button
          type="button"
          onClick={changePassword}
          className="mt-4 rounded-lg border border-white/[0.15] px-5 py-3 font-condensed text-sm font-bold uppercase tracking-wide text-white hover:border-[#F04E00] hover:text-[#F04E00]"
        >
          Cambia password
        </button>
        {resetMsg ? <p className="mt-3 text-sm text-emerald-400">{resetMsg}</p> : null}
      </div>

      {/* Notifiche — MOCK */}
      <div className={cardCls}>
        <p className="font-condensed text-[11px] font-bold uppercase tracking-wide text-[#888888]">
          Notifiche <DemoPill />
        </p>
        <div className="mt-4 space-y-3">
          <ToggleRow label="Notifiche email" on={emailNotif} onToggle={() => setEmailNotif((v) => !v)} />
          <ToggleRow label="Notifiche push" on={pushNotif} onToggle={() => setPushNotif((v) => !v)} />
        </div>
      </div>

      {/* Account — REAL logout, MOCK elimina */}
      <div className={cardCls}>
        <p className="font-condensed text-[11px] font-bold uppercase tracking-wide text-[#888888]">Account</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={logout}
            className="rounded-lg border border-white/[0.15] px-5 py-3 font-condensed text-sm font-bold uppercase tracking-wide text-white hover:border-[#F04E00] hover:text-[#F04E00]"
          >
            Esci
          </button>
          <button
            type="button"
            disabled
            title="Disponibile a breve"
            className="cursor-not-allowed rounded-lg border border-red-500/40 px-5 py-3 font-condensed text-sm font-bold uppercase tracking-wide text-red-400 opacity-60"
          >
            Elimina account
          </button>
        </div>
        <p className="mt-3 text-xs text-[#888888]">
          L&apos;eliminazione dell&apos;account è permanente e rimuove tutti i tuoi dati.
        </p>
      </div>
    </div>
  );
}

// Toggle switch (MOCK): solo stato locale, nessuna persistenza.
function ToggleRow({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[#C0BDB8]">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        onClick={onToggle}
        className={`relative h-6 w-11 rounded-full transition-colors ${on ? 'bg-[#F04E00]' : 'bg-white/15'}`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            on ? 'left-0.5 translate-x-5' : 'left-0.5'
          }`}
        />
      </button>
    </div>
  );
}
