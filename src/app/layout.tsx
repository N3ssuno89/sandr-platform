// Root layout pass-through.
// L'<html>/<body> reali sono in src/app/[locale]/layout.tsx; questo livello
// esiste solo per soddisfare il requisito Next di un root layout (necessario
// per il not-found globale fuori dal segmento [locale]).
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
