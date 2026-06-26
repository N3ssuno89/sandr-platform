export function AdminPlaceholder({ title }: { title: string }) {
  return (
    <div>
      <h1 className="font-condensed text-3xl font-extrabold uppercase text-white">{title}</h1>
      <div className="mt-8 rounded-xl border border-white/[0.08] bg-[#141414] p-12 text-center">
        <p className="font-condensed text-lg font-bold uppercase tracking-wide text-[#888888]">
          Prossimamente
        </p>
      </div>
    </div>
  );
}
