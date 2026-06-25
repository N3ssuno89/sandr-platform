// Intestazione di pagina riutilizzabile (titolo + sottotitolo opzionale).
export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="text-3xl text-sandr-text md:text-5xl">{title}</h1>
      {subtitle ? <p className="mt-3 text-sandr-muted">{subtitle}</p> : null}
    </div>
  );
}
