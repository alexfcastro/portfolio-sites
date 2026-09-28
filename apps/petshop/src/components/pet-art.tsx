import { Foto, temFoto } from "@/components/foto";

/*
 * Imagem do pet: a foto gerada por IA (não é cliente real), quando existe, ou uma ilustração simples. Vetores leves,
 * decorativos por padrão; quem usa decide o texto alternativo.
 */

export type PetKind = "cao" | "gato";

const palettes = {
  caramelo: { fur: "#d9964f", dark: "#a8662c", bg: "#fde5dc" },
  creme: { fur: "#f1d7a8", dark: "#c9a26a", bg: "#e4f1ea" },
  cinza: { fur: "#a9a4a0", dark: "#6f6a66", bg: "#fdf0cf" },
  preto: { fur: "#4a3b36", dark: "#2a201d", bg: "#e7e4f6" },
} as const;

export type Palette = keyof typeof palettes;

interface PetArtProps {
  kind: PetKind;
  palette?: Palette;
  accessory?: "laco" | "bandana" | "nenhum";
  className?: string;
  label?: string;
  sizes?: string;
  preload?: boolean;
}

/** Foto padrão de cada espécie, usada quando a combinação espécie + cor não tem foto própria. */
const fotoPadrao: Record<PetKind, string> = { cao: "cao-caramelo", gato: "gato-cinza" };

export function PetArt({
  kind,
  palette = "caramelo",
  accessory = "nenhum",
  className,
  label,
  sizes = "(min-width: 1024px) 300px, 50vw",
  preload = false,
}: PetArtProps) {
  const fotoId = temFoto(`${kind}-${palette}`) ? `${kind}-${palette}` : fotoPadrao[kind];
  if (temFoto(fotoId)) {
    return <Foto id={fotoId} alt={label ?? ""} sizes={sizes} preload={preload} className={`aspect-[5/4] ${className ?? ""}`} />;
  }
  const c = palettes[palette];
  return (
    <svg
      viewBox="0 0 200 160"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
    >
      <rect width="200" height="160" fill={c.bg} />
      <circle cx="30" cy="30" r="10" fill="#fff" opacity=".6" />
      <circle cx="172" cy="128" r="16" fill="#fff" opacity=".5" />
      {kind === "cao" ? (
        <>
          <ellipse cx="62" cy="70" rx="17" ry="32" fill={c.dark} transform="rotate(18 62 70)" />
          <ellipse cx="138" cy="70" rx="17" ry="32" fill={c.dark} transform="rotate(-18 138 70)" />
          <ellipse cx="100" cy="84" rx="44" ry="42" fill={c.fur} />
          <ellipse cx="100" cy="106" rx="24" ry="17" fill="#fff" opacity=".85" />
        </>
      ) : (
        <>
          <path d="M62 60 L68 22 L92 50 Z" fill={c.fur} />
          <path d="M138 60 L132 22 L108 50 Z" fill={c.fur} />
          <path d="M70 52 L72 34 L84 48 Z" fill="#f4a9a0" />
          <path d="M130 52 L128 34 L116 48 Z" fill="#f4a9a0" />
          <ellipse cx="100" cy="86" rx="46" ry="40" fill={c.fur} />
          <ellipse cx="100" cy="104" rx="20" ry="13" fill="#fff" opacity=".85" />
          <path d="M60 98 H80 M60 106 H80 M120 98 H140 M120 106 H140" stroke={c.dark} strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      <circle cx="84" cy="80" r="6" fill="#2a1d1a" />
      <circle cx="116" cy="80" r="6" fill="#2a1d1a" />
      <circle cx="86" cy="78" r="2" fill="#fff" />
      <circle cx="118" cy="78" r="2" fill="#fff" />
      <ellipse cx="100" cy="98" rx={kind === "cao" ? 8 : 5} ry={kind === "cao" ? 6 : 4} fill="#2a1d1a" />
      <path d="M92 108 Q100 114 108 108" stroke="#2a1d1a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {accessory === "laco" && (
        <g fill="#c8452f">
          <path d="M100 48 L84 38 L84 58 Z" />
          <path d="M100 48 L116 38 L116 58 Z" />
          <circle cx="100" cy="48" r="5" />
        </g>
      )}
      {accessory === "bandana" && <path d="M68 118 Q100 134 132 118 L100 150 Z" fill="#c8452f" />}
    </svg>
  );
}
