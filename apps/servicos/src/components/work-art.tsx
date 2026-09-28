import type { ReactNode } from "react";
import { Foto, temFoto } from "@/components/foto";

/*
 * Imagem de um trabalho do portfólio: a foto gerada por IA do trabalho, quando existe, ou a ilustração do tipo
 * de serviço (SVG). Nenhuma é trabalho real.
 */

const art: Record<string, ReactNode> = {
  eletrica: (
    <>
      <rect x="50" y="30" width="100" height="90" rx="6" fill="#fff" stroke="#0f4c55" strokeWidth="4" />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={64 + i * 20} y="50" width="12" height="28" rx="2" fill={i === 1 ? "#f5c542" : "#0f4c55"} />
      ))}
      <path d="M60 96h80" stroke="#d6e3e4" strokeWidth="6" strokeLinecap="round" />
    </>
  ),
  pintura: (
    <>
      <rect x="20" y="20" width="160" height="110" fill="#e4f0f1" />
      <rect x="100" y="20" width="80" height="110" fill="#f5c542" />
      <rect x="86" y="60" width="36" height="16" rx="3" fill="#0f4c55" />
      <rect x="100" y="76" width="6" height="40" fill="#0f4c55" />
    </>
  ),
  manutencao: (
    <>
      <rect x="30" y="34" width="140" height="80" rx="4" fill="#0f2d33" />
      <rect x="38" y="42" width="124" height="64" rx="2" fill="#155e63" />
      <rect x="70" y="118" width="60" height="6" rx="3" fill="#0f4c55" />
    </>
  ),
  "ar-condicionado": (
    <>
      <rect x="30" y="40" width="140" height="44" rx="10" fill="#fff" stroke="#0f4c55" strokeWidth="4" />
      <path d="M46 70h108" stroke="#d6e3e4" strokeWidth="4" />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M${70 + i * 30} 96q-6 10 0 20`} stroke="#0f4c55" strokeWidth="3" fill="none" strokeLinecap="round" />
      ))}
    </>
  ),
  hidraulica: (
    <>
      <path d="M40 60h60v40h40" stroke="#0f4c55" strokeWidth="10" fill="none" strokeLinejoin="round" />
      <circle cx="100" cy="60" r="12" fill="#f5c542" />
      <path d="M148 110q6 12 0 18" stroke="#57a3c8" strokeWidth="5" fill="none" strokeLinecap="round" />
    </>
  ),
};

export function WorkArt({ serviceId, workId }: { serviceId: string; workId?: string }) {
  if (workId && temFoto(workId)) {
    return <Foto id={workId} sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" className="aspect-[4/3] h-auto w-full" />;
  }
  return (
    <svg viewBox="0 0 200 150" className="h-auto w-full" aria-hidden focusable="false">
      <rect width="200" height="150" fill="#f5f8f8" />
      {art[serviceId]}
    </svg>
  );
}
