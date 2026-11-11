import { Foto, temFoto } from "@/components/foto";

/** Mapa estilizado, sem endereço real. */
export function IllustrativeMap() {
  return (
    <svg viewBox="0 0 400 240" className="h-auto w-full" role="img" aria-labelledby="mapa-titulo">
      <title id="mapa-titulo">Mapa ilustrativo: não indica um endereço real</title>
      <rect width="400" height="240" fill="#e9f3f1" />
      <g stroke="#ffffff" strokeWidth="14" fill="none" strokeLinecap="round">
        <path d="M-10 80 Q140 60 220 100 T410 90" />
        <path d="M-10 190 L410 170" />
        <path d="M110 -10 Q130 110 100 250" />
        <path d="M300 -10 L310 250" />
      </g>
      <g fill="#d5e8e4">
        <rect x="140" y="120" width="110" height="36" rx="8" />
        <rect x="20" y="110" width="70" height="56" rx="8" />
        <rect x="330" y="20" width="56" height="46" rx="8" />
      </g>
      <circle cx="205" cy="104" r="30" fill="#1c7266" opacity="0.14" />
      <path d="M205 74c-15 0-25 12-25 24 0 18 25 38 25 38s25-20 25-38c0-12-10-24-25-24z" fill="#1c7266" />
      <circle cx="205" cy="98" r="8" fill="#fff" />
    </svg>
  );
}

/** Imagem do hero: foto da recepção gerada por IA (sem pessoas), quando existe, ou a composição de formas orgânicas. */
export function HeroArt() {
  if (temFoto("recepcao")) {
    return <Foto id="recepcao" sizes="(min-width: 768px) 448px, 90vw" preload className="parallax aspect-square h-auto w-full rounded-[2rem]" />;
  }
  return (
    <svg viewBox="0 0 420 380" className="h-auto w-full" aria-hidden focusable="false">
      <circle cx="230" cy="190" r="160" fill="#e0f1ed" />
      <path d="M120 300c0-110 80-190 210-190 0 130-80 210-190 210" fill="#1c7266" opacity="0.9" />
      <path d="M130 305l110-110" stroke="#f4f9f8" strokeWidth="10" strokeLinecap="round" />
      <circle cx="330" cy="90" r="34" fill="#f3ece2" />
      <circle cx="90" cy="120" r="18" fill="#f3ece2" />
    </svg>
  );
}
