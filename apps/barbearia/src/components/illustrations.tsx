import type { ReactNode } from "react";

/*
 * Ilustrações originais (SVG) para a galeria e a localização.
 * Representam estilos de corte de forma estilizada; não são fotos de clientes.
 */

const SKIN = "#d9b48f";
const HAIR = "#2a221b";

function Head({ children, beard = false }: { children: ReactNode; beard?: boolean }) {
  return (
    <>
      <rect x="84" y="150" width="32" height="30" rx="8" fill={SKIN} />
      <ellipse cx="100" cy="112" rx="38" ry="46" fill={SKIN} />
      <ellipse cx="62" cy="116" rx="6" ry="11" fill={SKIN} />
      <ellipse cx="138" cy="116" rx="6" ry="11" fill={SKIN} />
      {beard && <path d="M64 118 Q66 162 100 166 Q134 162 136 118 Q126 140 100 142 Q74 140 64 118Z" fill={HAIR} />}
      {children}
      <path d="M58 200 Q100 170 142 200Z" fill="#3a3129" />
    </>
  );
}

const styles: Record<string, ReactNode> = {
  classico: (
    <Head>
      <path d="M60 104 Q58 58 100 56 Q144 56 140 100 Q134 78 104 76 Q78 76 66 96Z" fill={HAIR} />
      <path d="M72 70 L124 64" stroke="#15120f" strokeWidth="2" opacity="0.5" />
    </Head>
  ),
  degrade: (
    <Head>
      <path d="M66 86 Q70 54 100 52 Q132 54 136 86 Q120 70 100 70 Q80 70 66 86Z" fill={HAIR} />
      <path d="M62 104 Q62 90 66 86 L68 108Z" fill={HAIR} opacity="0.55" />
      <path d="M138 104 Q138 90 136 86 L132 108Z" fill={HAIR} opacity="0.55" />
    </Head>
  ),
  barba: (
    <Head beard>
      <path d="M62 98 Q62 60 100 58 Q138 60 138 98 Q128 80 100 80 Q72 80 62 98Z" fill={HAIR} />
    </Head>
  ),
  texturizado: (
    <Head>
      <path
        d="M62 96 Q56 64 78 56 Q86 44 100 50 Q114 42 124 54 Q146 60 138 96 Q130 76 116 74 Q108 82 98 74 Q86 82 78 74 Q66 80 62 96Z"
        fill={HAIR}
      />
    </Head>
  ),
  raspado: (
    <Head beard>
      <path d="M64 96 Q64 62 100 60 Q136 62 136 96 Q120 84 100 84 Q80 84 64 96Z" fill={HAIR} opacity="0.35" />
    </Head>
  ),
  topete: (
    <Head>
      <path d="M64 96 Q62 66 84 58 Q96 30 128 40 Q146 52 136 96 Q128 72 106 70 Q84 72 64 96Z" fill={HAIR} />
    </Head>
  ),
};

export const galleryItems = [
  { id: "classico", label: "Corte clássico" },
  { id: "degrade", label: "Degradê" },
  { id: "barba", label: "Barba desenhada" },
  { id: "texturizado", label: "Texturizado" },
  { id: "raspado", label: "Raspado com barba" },
  { id: "topete", label: "Topete" },
] as const;

export function StyleIllustration({ id }: { id: (typeof galleryItems)[number]["id"] }) {
  return (
    <svg viewBox="0 0 200 200" className="h-auto w-full" aria-hidden focusable="false">
      <rect width="200" height="200" fill="#241e18" />
      <circle cx="100" cy="100" r="86" fill="none" stroke="#c9a45c" strokeOpacity="0.25" strokeWidth="1.5" />
      {styles[id]}
    </svg>
  );
}

/** Mapa estilizado, sem endereço real. */
export function IllustrativeMap() {
  return (
    <svg viewBox="0 0 400 260" className="h-auto w-full" role="img" aria-labelledby="mapa-titulo">
      <title id="mapa-titulo">Mapa ilustrativo: não indica um endereço real</title>
      <rect width="400" height="260" fill="#1d1915" />
      <g stroke="#2f2820" strokeWidth="16" fill="none" strokeLinecap="round">
        <path d="M-10 90 Q120 70 200 110 T410 100" />
        <path d="M-10 200 L410 180" />
        <path d="M120 -10 Q140 120 110 270" />
        <path d="M290 -10 L300 270" />
      </g>
      <g fill="#241e18">
        <rect x="150" y="130" width="100" height="36" rx="6" />
        <rect x="20" y="120" width="70" height="60" rx="6" />
        <rect x="320" y="30" width="60" height="50" rx="6" />
      </g>
      <circle cx="205" cy="118" r="30" fill="#c9a45c" opacity="0.15" />
      <path d="M205 88 C190 88 180 100 180 112 C180 130 205 150 205 150 C205 150 230 130 230 112 C230 100 220 88 205 88Z" fill="#c9a45c" />
      <circle cx="205" cy="112" r="8" fill="#15120f" />
    </svg>
  );
}
