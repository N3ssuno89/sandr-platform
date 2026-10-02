import { redirect } from 'next/navigation';

// Convergenza profili atleta: la pagina profilo canonica è /athletes/[id]
// (profilo completo: bio, video taggati, altri atleti). /atleti/[slug] resta
// come alias storico e reindirizza lì (slug = id atleta).
export default function AtletaRedirect({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  redirect(`/${params.locale}/athletes/${params.slug}`);
}
