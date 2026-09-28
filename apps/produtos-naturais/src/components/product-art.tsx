import { Foto, temFoto } from "@/components/foto";
import type { Product } from "@/data/catalog";

/*
 * Imagem do produto: a foto gerada por IA, quando existe, ou a ilustração (saquinho de papel para granel,
 * pote para unidade, nas cores do produto). Decorativa: o nome do produto aparece ao lado.
 */
export function ProductArt({
  product,
  className,
  sizes = "(min-width: 1024px) 300px, 50vw",
  preload = false,
}: {
  product: Product;
  className?: string;
  sizes?: string;
  preload?: boolean;
}) {
  if (temFoto(product.id)) return <Foto id={product.id} sizes={sizes} preload={preload} className={`aspect-square ${className ?? ""}`} />;
  const { color, accent } = product.art;
  const seed = [...product.id].reduce((total, char) => total + char.charCodeAt(0), 0);
  const grains = Array.from({ length: 14 }, (_, i) => ({
    x: 70 + ((seed * (i + 3)) % 60),
    y: 118 + ((seed * (i + 7)) % 14),
    r: 3 + ((seed + i) % 3),
  }));
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden focusable="false">
      <rect width="200" height="200" fill="#efe6d2" />
      <circle cx="160" cy="40" r="26" fill="#fffdf8" opacity=".6" />
      <ellipse cx="100" cy="176" rx="70" ry="10" fill="#d8cbb0" />
      {product.sale.kind === "peso" ? (
        <>
          <path d="M52 70 L60 172 H140 L148 70 Z" fill="#c9a877" />
          <path d="M52 70 L60 60 H140 L148 70 Z" fill="#b8945f" />
          <path d="M60 60 L70 48 H130 L140 60 Z" fill="#d7b98a" />
          <path d="M58 96 Q100 84 142 96 L140 124 Q100 110 60 124 Z" fill={color} opacity=".25" />
          <ellipse cx="100" cy="124" rx="36" ry="12" fill={color} />
          {grains.map((g, i) => (
            <circle key={i} cx={g.x} cy={g.y} r={g.r} fill={i % 2 ? accent : color} />
          ))}
          <rect x="74" y="136" width="52" height="24" rx="4" fill="#fffdf8" />
          <rect x="82" y="144" width="36" height="3" rx="1.5" fill="#56682a" />
          <rect x="88" y="151" width="24" height="3" rx="1.5" fill="#b04a26" />
        </>
      ) : (
        <>
          <rect x="62" y="62" width="76" height="18" rx="5" fill="#56682a" />
          <rect x="58" y="78" width="84" height="94" rx="14" fill={color} />
          <rect x="66" y="88" width="14" height="70" rx="7" fill="#fff" opacity=".25" />
          <rect x="72" y="112" width="56" height="34" rx="5" fill="#fffdf8" />
          <rect x="80" y="121" width="40" height="4" rx="2" fill="#56682a" />
          <rect x="86" y="131" width="28" height="4" rx="2" fill={accent} />
        </>
      )}
      <path d="M150 150 q12 -18 26 -16 q-4 18 -26 16 Z" fill="#56682a" opacity=".85" />
      <path d="M40 160 q-14 -12 -24 -6 q8 14 24 6 Z" fill="#7a8b4f" opacity=".8" />
    </svg>
  );
}
