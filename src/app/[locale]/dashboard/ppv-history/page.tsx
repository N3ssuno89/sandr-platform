import { redirect } from 'next/navigation';

// Lo storico PPV è ora una sezione DENTRO /dashboard/subscription (per scelta
// di prodotto). Questa rotta resta solo come redirect per i vecchi link.
export default function PpvHistoryPage({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/dashboard/subscription`);
}
