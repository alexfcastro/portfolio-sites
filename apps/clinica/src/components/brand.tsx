/** Marca fictícia da Vita Clínica: folha estilizada em um círculo. Não usa a marca AX. */
export function VitaMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden focusable="false">
      <circle cx="20" cy="20" r="19" fill="var(--color-teal)" />
      <path d="M13 26c0-8 6-13 15-13 0 9-5 15-13 15" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M13 27l8-8" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function VitaLogo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <VitaMark className="size-9 shrink-0" />
      <span className="font-serif text-xl font-semibold whitespace-nowrap">
        Vita <span className="text-teal">Clínica</span>
      </span>
    </span>
  );
}
