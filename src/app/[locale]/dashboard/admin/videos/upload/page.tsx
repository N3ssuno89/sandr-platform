import { redirect } from 'next/navigation';

// La vecchia pagina di upload diretto (errore 413) è stata rimossa: i video
// si caricano su Cloudflare Stream e si linkano qui via UID. Redirect a /add.
export default function UploadRedirectPage({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/dashboard/admin/videos/add`);
}
