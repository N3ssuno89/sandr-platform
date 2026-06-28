import { setRequestLocale } from 'next-intl/server';
import { getMyReminders, deleteReminder } from '@/lib/user/actions';
import { ConfirmDelete } from '@/components/admin/ConfirmDelete';

// REAL: reminders (utente loggato).
export default async function RemindersPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const reminders = await getMyReminders();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="font-condensed text-3xl font-extrabold uppercase text-white">Reminder</h1>

      {reminders.length > 0 ? (
        <div className="mt-6 space-y-3">
          {reminders.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.08] bg-[#1C1C1C] px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm text-white">{r.title}</p>
                {r.remindAt ? <p className="text-xs text-[#888888]">{r.remindAt}</p> : null}
              </div>
              <ConfirmDelete action={deleteReminder} id={r.id} label="Rimuovi" message="Rimuovere questo reminder?" />
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-10 text-center text-sm text-[#888888]">Nessun reminder impostato</p>
      )}
    </div>
  );
}
