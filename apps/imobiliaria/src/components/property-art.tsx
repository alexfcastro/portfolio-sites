import { Foto, temFoto } from "@/components/foto";

/*
 * Imagem do imóvel (fachada, sala ou quarto): a foto gerada por IA, quando existe, ou a ilustração original (SVG).
 * Nenhuma das duas mostra um imóvel real.
 */

export type Scene = "fachada" | "sala" | "quarto";

const palettes = [
  { sky: ["#bcd6f5", "#e8f1fc"], wall: "#f4f1ea", roof: "#2d4a73", accent: "#8fb3dc" },
  { sky: ["#f6d6b8", "#fcefe3"], wall: "#fbfaf7", roof: "#b0553a", accent: "#e7b98e" },
  { sky: ["#cfe5d4", "#eef7f0"], wall: "#ece8df", roof: "#4f6b4a", accent: "#9cc4a3" },
  { sky: ["#d8d2f0", "#f1eefb"], wall: "#f7f4ee", roof: "#5b4f86", accent: "#b7addf" },
];

export function PropertyArt({
  variant,
  scene = "fachada",
  building = false,
  className,
  id,
  code,
  sizes = "(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw",
  preload = false,
}: {
  variant: number;
  scene?: Scene;
  /** Apartamentos e salas comerciais: fachada de prédio em vez de casa. */
  building?: boolean;
  className?: string;
  id: string;
  /** Código do imóvel, para achar a foto (ex.: HZ-0142 → hz-0142-sala). */
  code?: string;
  sizes?: string;
  preload?: boolean;
}) {
  const fotoId = code ? `${code.toLowerCase()}-${scene}` : "";
  if (fotoId && temFoto(fotoId)) {
    return <Foto id={fotoId} sizes={sizes} preload={preload} className={`aspect-[16/10] ${className ?? ""}`} />;
  }
  const p = palettes[variant % palettes.length]!;
  const gradient = `sky-${id}-${scene}`;
  return (
    <svg viewBox="0 0 320 200" className={className} aria-hidden focusable="false">
      <defs>
        <linearGradient id={gradient} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={p.sky[0]} />
          <stop offset="1" stopColor={p.sky[1]} />
        </linearGradient>
      </defs>
      {scene === "fachada" && building && (
        <>
          <rect width="320" height="200" fill={`url(#${gradient})`} />
          <rect y="170" width="320" height="30" fill="#9fc38a" />
          <rect x="105" y="24" width="110" height="150" rx="2" fill={p.wall} />
          <rect x="105" y="24" width="110" height="10" fill={p.roof} />
          {[0, 1, 2, 3, 4].map((row) =>
            [0, 1, 2].map((col) => (
              <rect key={`${row}-${col}`} x={117 + col * 32} y={44 + row * 24} width="22" height="14" rx="1" fill={p.accent} />
            )),
          )}
          <rect x="146" y="150" width="28" height="24" fill={p.roof} />
          <rect x="30" y="92" width="60" height="82" fill={p.accent} opacity="0.5" />
          <rect x="232" y="72" width="60" height="102" fill={p.accent} opacity="0.5" />
        </>
      )}
      {scene === "fachada" && !building && (
        <>
          <rect width="320" height="200" fill={`url(#${gradient})`} />
          <rect y="160" width="320" height="40" fill="#9fc38a" />
          <rect x="80" y="86" width="160" height="80" rx="2" fill={p.wall} />
          <path d="M66 90 L160 36 L254 90 Z" fill={p.roof} />
          <rect x="102" y="104" width="34" height="26" rx="2" fill={p.accent} />
          <rect x="184" y="104" width="34" height="26" rx="2" fill={p.accent} />
          <rect x="146" y="118" width="28" height="48" rx="2" fill={p.roof} />
          <circle cx="40" cy="150" r="18" fill="#6f9a57" />
          <circle cx="282" cy="146" r="22" fill="#6f9a57" />
        </>
      )}
      {scene === "sala" && (
        <>
          <rect width="320" height="200" fill={p.wall} />
          <rect y="150" width="320" height="50" fill="#d9c8ad" />
          <rect x="200" y="30" width="90" height="90" fill={`url(#${gradient})`} stroke="#fff" strokeWidth="6" />
          <rect x="40" y="110" width="130" height="42" rx="10" fill={p.roof} />
          <rect x="34" y="96" width="26" height="56" rx="8" fill={p.roof} />
          <rect x="150" y="96" width="26" height="56" rx="8" fill={p.roof} />
          <rect x="70" y="160" width="80" height="10" rx="3" fill="#7a5c3e" />
          <circle cx="250" cy="150" r="16" fill="#6f9a57" />
        </>
      )}
      {scene === "quarto" && (
        <>
          <rect width="320" height="200" fill={p.wall} />
          <rect y="160" width="320" height="40" fill="#d9c8ad" />
          <rect x="30" y="30" width="80" height="70" fill={`url(#${gradient})`} stroke="#fff" strokeWidth="6" />
          <rect x="140" y="90" width="150" height="70" rx="6" fill="#fff" />
          <rect x="140" y="70" width="150" height="26" rx="6" fill={p.roof} />
          <rect x="150" y="96" width="50" height="18" rx="6" fill={p.accent} />
          <rect x="140" y="126" width="150" height="34" rx="4" fill={p.accent} opacity="0.7" />
        </>
      )}
    </svg>
  );
}
