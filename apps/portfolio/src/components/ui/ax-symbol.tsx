import { useId } from "react";
import { AX_PATH_A, AX_PATH_X } from "@/lib/brand";

interface AxSymbolProps {
  /** Fundo sobre o qual o símbolo aparece. */
  tone?: "light" | "dark";
  /**
   * "tile": monograma branco dentro de um quadrado arredondado em degradê (azul → violeta).
   * É a versão principal da marca, usada no cabeçalho, no rodapé e no ícone do site.
   * "plain": só o monograma, para usos grandes e decorativos.
   */
  variant?: "plain" | "tile";
  className?: string;
  /** Sem título, o símbolo é decorativo (o nome aparece ao lado). */
  title?: string;
}

const COLORS = {
  light: { base: "var(--color-ink)", accent: "var(--color-accent)" },
  dark: { base: "var(--color-canvas)", accent: "var(--color-accent-on-dark)" },
} as const;

/** Símbolo do Estúdio X: dois traços que formam um X, o segundo interrompido no cruzamento. */
export function AxSymbol({ tone = "light", variant = "plain", className, title }: AxSymbolProps) {
  const colors = COLORS[tone];
  const gradientId = useId();

  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      focusable="false"
    >
      {variant === "tile" ? (
        <>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#2f54eb" />
              <stop offset="1" stopColor="#7a5cff" />
            </linearGradient>
          </defs>
          <rect width="64" height="64" rx="16" fill={`url(#${gradientId})`} />
          <g transform="translate(32 32) scale(0.72) translate(-32 -32)">
            <path d={AX_PATH_A} fill="#ffffff" />
            <path d={AX_PATH_X} fill="#cfd8ff" />
          </g>
        </>
      ) : (
        <>
          <path d={AX_PATH_A} fill={colors.base} />
          <path d={AX_PATH_X} fill={colors.accent} />
        </>
      )}
    </svg>
  );
}
