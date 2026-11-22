import { Foto, temFoto } from "@/components/foto";
import type { Product } from "@/data/loja";

/** Foto do produto (gerada por IA) ou, enquanto não houver, uma ilustração da embalagem. */
export function ProductPhoto({ product, sizes, className = "" }: { product: Product; sizes: string; className?: string }) {
  const id = `loja-${product.id}`;
  if (temFoto(id)) {
    return <Foto id={id} sizes={sizes} className={`block aspect-square size-full object-cover ${className}`} />;
  }
  return (
    <span className={`grid aspect-square place-items-center bg-gradient-to-b from-coal-3 to-coal ${className}`}>
      <PackageDrawing product={product} />
    </span>
  );
}

function Label({ y, text }: { y: number; text: string }) {
  return (
    <text x="60" y={y} textAnchor="middle" fontSize="7" letterSpacing="1.5" fill="#c9a45c" fontFamily="sans-serif">
      {text}
    </text>
  );
}

/** Desenho simples da embalagem, por tipo de produto. */
function PackageDrawing({ product }: { product: Product }) {
  const common = { viewBox: "0 0 120 120", className: "w-3/5", "aria-hidden": true } as const;
  if (product.id.startsWith("pomada") || product.id.startsWith("balm")) {
    return (
      <svg {...common}>
        <rect x="22" y="44" width="76" height="46" rx="8" fill="#262019" stroke="#3a3129" />
        <rect x="18" y="34" width="84" height="16" rx="6" fill="#c9a45c" />
        <Label y={70} text="BRAVUS" />
      </svg>
    );
  }
  if (product.id.startsWith("oleo")) {
    return (
      <svg {...common}>
        <rect x="42" y="46" width="36" height="56" rx="6" fill="#5a3a1c" stroke="#3a3129" />
        <rect x="50" y="30" width="20" height="18" rx="3" fill="#15120f" />
        <rect x="56" y="16" width="8" height="16" rx="4" fill="#c9a45c" />
        <Label y={78} text="BRAVUS" />
      </svg>
    );
  }
  if (product.id === "pente-madeira") {
    return (
      <svg {...common}>
        <rect x="14" y="48" width="92" height="14" rx="4" fill="#a06b3a" />
        {Array.from({ length: 16 }, (_, i) => (
          <rect key={i} x={18 + i * 5.5} y="60" width="2.5" height={i < 6 ? 22 : 16} fill="#a06b3a" />
        ))}
      </svg>
    );
  }
  if (product.category === "kits") {
    return (
      <svg {...common}>
        <rect x="16" y="38" width="88" height="56" rx="4" fill="#262019" stroke="#c9a45c" />
        <rect x="16" y="38" width="88" height="12" fill="#c9a45c" />
        <Label y={76} text="KIT BRAVUS" />
      </svg>
    );
  }
  // Frascos: shampoo, condicionador, gel, pó, pós-barba.
  return (
    <svg {...common}>
      <rect x="36" y="34" width="48" height="72" rx="10" fill="#262019" stroke="#3a3129" />
      <rect x="48" y="18" width="24" height="18" rx="4" fill="#c9a45c" />
      <Label y={74} text="BRAVUS" />
    </svg>
  );
}
