"use client";

import { useState } from "react";
import { FlowerArt } from "@/components/flower-art";
import type { FlowerArt as Art } from "@/data/shop";

const scenes = ["Vista principal", "Sobre a mesa", "Detalhe"];

export function Gallery({ art, id }: { art: Art; id: string }) {
  const [scene, setScene] = useState(0);
  return (
    <div>
      <figure className="overflow-hidden rounded-card border border-line bg-paper">
        <FlowerArt art={art} id={id} scene={scene} sizes="(min-width: 1024px) 560px, 100vw" preload={scene === 0} className="h-auto w-full" />
        <figcaption className="px-4 py-2 text-sm text-muted">{scenes[scene]} — foto ilustrativa gerada por IA.</figcaption>
      </figure>
      <div role="group" aria-label="Escolher imagem" className="mt-3 grid grid-cols-3 gap-3">
        {scenes.map((label, index) => (
          <button
            key={label}
            type="button"
            aria-pressed={scene === index}
            onClick={() => setScene(index)}
            className="overflow-hidden rounded-xl border-2 border-transparent aria-pressed:border-rose"
          >
            <FlowerArt art={art} id={id} scene={index} sizes="(min-width: 1024px) 180px, 33vw" className="h-auto w-full" />
            <span className="sr-only">Ver {label.toLowerCase()}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
