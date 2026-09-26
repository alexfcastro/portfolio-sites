import { AX_PATH_A, AX_PATH_X } from "@/lib/brand";

interface AxSymbolProps {
  /** Fundo sobre o qual o símbolo aparece. */
  tone?: "light" | "dark";
  className?: string;
  /** Sem título, o símbolo é decorativo (o nome aparece ao lado). */
  title?: string;
}

const COLORS = {
  light: { base: "var(--color-ink)", accent: "var(--color-accent)" },
  dark: { base: "var(--color-canvas)", accent: "var(--color-accent-on-dark)" },
} as const;

/** Monograma AX: a perna direita do A é também um dos traços do X. */
export function AxSymbol({ tone = "light", className, title }: AxSymbolProps) {
  const colors = COLORS[tone];

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      <path d={AX_PATH_A} fill={colors.base} />
      <path d={AX_PATH_X} fill={colors.accent} />
    </svg>
  );
}
