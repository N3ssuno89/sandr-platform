'use client';

import { useState } from 'react';
import { updateUserRole } from '@/lib/admin/actions';
import type { UserRow } from '@/lib/admin/types';
import { inputCls } from '@/components/admin/styles';

const ROLES: UserRow['role'][] = ['viewer', 'broadcaster', 'admin', 'organizer'];
const COLS = 'grid grid-cols-[2fr_1.5fr_1.2fr_0.8fr_1fr] items-center gap-3 px-4';

// REAL: profiles table, admin-only via RLS (scrittura via service role server-side).
export function UserManager({ users }: { users: UserRow[] }) {
  const [rows, setRows] = useState<UserRow[]>(users);
  const [q, setQ] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const visible = rows.filter((u) => (u.email ?? '').toLowerCase().includes(q.toLowerCase()));

  async function changeRole(id: string, role: UserRow['role']) {
    setBusyId(id);
    const res = await updateUserRole(id, role);
    setBusyId(null);
    if (res.ok) {
      setRows((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    } else {
      window.alert(
        res.error === 'forbidden' || res.error === 'unauthorized'
          ? 'Solo un admin può cambiare i ruoli.'
          : `Errore: ${res.error}`,
      );
    }
  }

  return (
    <div>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Cerca per email…"
        className={`mt-6 ${inputCls} max-w-md`}
      />

      <div className="mt-6 overflow-x-auto rounded-xl border border-white/[0.08] bg-[#1C1C1C]">
        <div className="min-w-[760px]">
          <div className={`${COLS} border-b border-white/[0.06] py-3 font-condensed text-[11px] font-bold uppercase tracking-wide text-[#888888]`}>
            <span>Email</span>
            <span>Nome</span>
            <span>Lingua / Registrato</span>
            <span>Ruolo</span>
            <span className="text-right">Cambia ruolo</span>
          </div>

          {visible.length > 0 ? (
            visible.map((u) => (
              <div key={u.id} className={`${COLS} border-b border-white/[0.06] py-3 text-sm last:border-0`}>
                <span className="truncate text-white">{u.email ?? '—'}</span>
                <span className="truncate text-[#888888]">{u.full_name ?? '—'}</span>
                <span className="text-[#888888]">
                  {u.preferred_language.toUpperCase()} · {new Date(u.created_at).toLocaleDateString('it-IT')}
                </span>
                <span className="font-semibold text-sandr-orange">{u.role}</span>
                <div className="flex justify-end">
                  <select
                    value={u.role}
                    disabled={busyId === u.id}
                    onChange={(e) => changeRole(u.id, e.target.value as UserRow['role'])}
                    className="rounded border border-white/[0.08] bg-[#242424] px-2 py-1 text-xs text-white focus:border-[#F04E00] focus:outline-none disabled:opacity-60"
                  >
                    {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
              </div>
            ))
          ) : (
            <p className="px-4 py-10 text-center text-sm text-[#888888]">Nessun utente</p>
          )}
        </div>
      </div>
    </div>
  );
}
