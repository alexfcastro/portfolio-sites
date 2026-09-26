/** Marca fictícia do Sabor & Brasa: chama estilizada. Não usa a marca AX. */
export function FlameMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden focusable="false">
      <circle cx="20" cy="20" r="19" fill="var(--color-brick)" />
      <path d="M20 8c2 6 8 8 8 15a8 8 0 0 1-16 0c0-4 2-6 4-8 0 3 1 5 3 5-1-5 0-9 1-12z" fill="#fff8ef" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="inline-flex items-center gap-2.5">
      <FlameMark className="size-9 shrink-0" />
      <span className="font-serif text-2xl whitespace-nowrap text-brick">Sabor &amp; Brasa</span>
    </span>
  );
}
