"use client";

import { MoveHorizontal } from "lucide-react";
import { useState } from "react";
import { Foto, temFoto } from "@/components/foto";

function Camada({ id, fase, sizes, preload }: { id: string; fase: "antes" | "depois"; sizes: string; preload: boolean }) {
  if (temFoto(id)) return <Foto id={id} sizes={sizes} preload={preload} className="absolute inset-0 size-full" />;
  return <span aria-hidden className={`absolute inset-0 ${fase === "antes" ? "bg-creme-escuro" : "bg-creme"}`} />;
}

/**
 * Comparador de antes e depois da mesma pessoa, com a mesma luz e o mesmo enquadramento. Uma linha divide as duas fotos; a pessoa arrasta a linha
 * (mouse ou dedo) ou usa as setas do teclado. Por baixo é um <input type="range"> de verdade, invisível,
 * que cobre a foto: funciona com leitor de tela e não depende de JavaScript de arraste.
 */
export function Comparador({
  antes,
  depois,
  rotulo,
  sizes,
  preload = false,
  className = "",
  inicial = 50,
}: {
  antes: string;
  depois: string;
  /** Descreve o caso para o leitor de tela (ex.: "sobrancelha com falhas"). */
  rotulo: string;
  sizes: string;
  preload?: boolean;
  className?: string;
  inicial?: number;
}) {
  const [posicao, setPosicao] = useState(inicial);

  return (
    <div className={`comparador relative isolate overflow-hidden bg-creme-escuro select-none ${className}`}>
      <Camada id={depois} fase="depois" sizes={sizes} preload={preload} />
      <div aria-hidden className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - posicao}% 0 0)` }}>
        <Camada id={antes} fase="antes" sizes={sizes} preload={preload} />
      </div>

      <span aria-hidden className="etiqueta left-3">
        Antes
      </span>
      <span aria-hidden className="etiqueta right-3">
        Depois
      </span>

      <span aria-hidden className="pointer-events-none absolute inset-y-0 w-0.5 bg-white/95 shadow-[0_0_12px_rgb(0_0_0/0.35)]" style={{ left: `calc(${posicao}% - 1px)` }}>
        <span className="comparador-pega absolute top-1/2 left-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-ambar-escuro shadow-lg">
          <MoveHorizontal className="size-5" />
        </span>
      </span>

      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={posicao}
        onChange={(event) => setPosicao(Number(event.target.value))}
        aria-label={`Comparar antes e depois: ${rotulo}`}
        aria-valuetext={`${posicao}% da foto mostra o antes`}
        className="comparador-controle absolute inset-0 z-10 size-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
