import { Foto, temFoto } from "@/components/foto";
import type { FlowerArt as Art } from "@/data/shop";

/*
 * Imagem do produto: a foto gerada por IA da vista pedida (principal, sobre a mesa ou detalhe), quando existe,
 * ou a ilustração. Decorativa: o nome aparece ao lado.
 */
const sufixos = ["", "-mesa", "-detalhe"];

function Flower({ x, y, r, petals, center }: { x: number; y: number; r: number; petals: string; center: string }) {
  return (
    <g>
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i * Math.PI) / 3;
        return <circle key={i} cx={x + Math.cos(a) * r * 0.62} cy={y + Math.sin(a) * r * 0.62} r={r * 0.5} fill={petals} />;
      })}
      <circle cx={x} cy={y} r={r * 0.38} fill={center} />
    </g>
  );
}

const cluster = [
  [100, 62, 20],
  [72, 76, 17],
  [128, 78, 17],
  [86, 44, 15],
  [116, 44, 15],
  [100, 90, 16],
] as const;

export function FlowerArt({
  art,
  id,
  className,
  scene = 0,
  sizes = "(min-width: 1024px) 300px, 50vw",
  preload = false,
}: {
  art: Art;
  /** Id do produto, para achar a foto. */
  id?: string;
  className?: string;
  scene?: number;
  sizes?: string;
  preload?: boolean;
}) {
  const fotoId = id ? `${id}${sufixos[scene % 3]}` : "";
  if (fotoId && temFoto(fotoId)) return <Foto id={fotoId} sizes={sizes} preload={preload} className={`aspect-square ${className ?? ""}`} />;
  const bg = ["#f6e9e6", "#eef1ea", "#f5efe4"][scene % 3];
  return (
    <svg viewBox={scene === 2 ? "40 18 120 120" : "0 0 200 200"} className={className} aria-hidden focusable="false">
      <rect width="200" height="200" fill={bg} />
      <circle cx="165" cy="35" r="22" fill="#fff" opacity=".55" />
      <ellipse cx="100" cy="182" rx="66" ry="8" fill="#000" opacity=".06" />
      {/* folhagens */}
      <path d="M100 100 Q58 70 44 96 Q70 104 100 100 Z" fill={art.leaves} />
      <path d="M100 100 Q142 70 156 96 Q130 104 100 100 Z" fill={art.leaves} />
      <path d="M100 96 Q90 40 110 24 Q114 60 100 96 Z" fill={art.leaves} opacity=".8" />
      {art.kind === "buque" && (
        <>
          <path d="M100 100 L92 176 L108 176 Z" fill="#6d8a5f" />
          <path d="M60 96 L100 180 L140 96 Z" fill={art.wrap} />
          <path d="M60 96 L100 180 L82 96 Z" fill="#000" opacity=".06" />
          <path d="M88 142 Q100 150 112 142 L110 152 Q100 158 90 152 Z" fill="#a4525f" />
        </>
      )}
      {art.kind === "arranjo" && <rect x="56" y="108" width="88" height="66" rx="6" fill={art.wrap} stroke="#000" strokeOpacity=".08" />}
      {art.kind === "cesta" && (
        <>
          <path d="M60 110 Q100 30 140 110" stroke={art.wrap} strokeWidth="6" fill="none" />
          <path d="M52 108 H148 L138 172 H62 Z" fill={art.wrap} />
          <path d="M58 124 H142 M60 140 H140 M62 156 H138" stroke="#000" strokeOpacity=".12" strokeWidth="3" />
          <rect x="116" y="92" width="18" height="22" rx="3" fill="#c0503f" />
        </>
      )}
      {art.kind === "vaso" && (
        <>
          <path d="M100 150 Q96 100 100 40" stroke="#4f7a54" strokeWidth="3" fill="none" />
          <path d="M66 130 H134 L126 176 H74 Z" fill={art.wrap} stroke="#000" strokeOpacity=".08" />
        </>
      )}
      {art.kind === "vaso"
        ? (
            [
              [100, 46, 14],
              [112, 66, 13],
              [92, 84, 13],
              [106, 104, 12],
            ] as const
          ).map(([x, y, r], i) => <Flower key={i} x={x} y={y} r={r} petals={art.petals} center={art.center} />)
        : cluster
            .map(([x, y, r]) => [x, art.kind === "buque" ? y : y + 20, r] as const)
            .map(([x, y, r], i) => <Flower key={i} x={x} y={y} r={r} petals={art.petals} center={art.center} />)}
    </svg>
  );
}
