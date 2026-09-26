/** Marca fictícia da Bravus: navalha estilizada + nome. Não usa a marca AX. */
export function BravusMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden focusable="false">
      <rect x="1" y="1" width="38" height="38" rx="9" fill="none" stroke="var(--color-gold)" strokeWidth="2" />
      <path d="M11 27 L25 13 Q29 11 29 15 L15 29 Z" fill="var(--color-gold)" />
      <path d="M22 22 L29 29" stroke="var(--color-gold)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

export function BravusLogo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <BravusMark className="size-9 shrink-0" />
      <span className="leading-none">
        <span className="block font-display text-xl font-bold tracking-[0.22em] text-gold">BRAVUS</span>
        <span className="block font-display text-[0.6875rem] tracking-[0.42em] text-smoke">BARBEARIA</span>
      </span>
    </span>
  );
}
