"use client";

import { useState } from "react";
import { MessagePreview } from "@/components/message-preview";
import { PropertyArt, type Scene } from "@/components/property-art";
import type { Listing } from "@/data/listings";
import { buildInterestMessage, interestReasons, visitPeriods } from "@/lib/search";

const scenes: Array<{ id: Scene; label: string }> = [
  { id: "fachada", label: "Fachada" },
  { id: "sala", label: "Sala" },
  { id: "quarto", label: "Quarto" },
];

export function Gallery({ listing }: { listing: Listing }) {
  const [scene, setScene] = useState<Scene>("fachada");
  const available = listing.type === "sala" ? scenes.filter((s) => s.id !== "quarto") : scenes;
  return (
    <div>
      <figure className="overflow-hidden rounded-card border border-line bg-paper">
        <PropertyArt id={listing.code} code={listing.code} variant={listing.art} scene={scene} building={listing.type !== "casa"} sizes="(min-width: 1024px) 720px, 100vw" preload={scene === "fachada"} className="h-auto w-full" />
        <figcaption className="px-4 py-2 text-sm text-muted">
          {available.find((s) => s.id === scene)?.label} — foto ilustrativa gerada por IA, não é foto do imóvel.
        </figcaption>
      </figure>
      <div role="group" aria-label="Escolher imagem" className="mt-3 grid grid-cols-3 gap-3">
        {available.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={scene === item.id}
            onClick={() => setScene(item.id)}
            className="overflow-hidden rounded-lg border-2 border-transparent aria-pressed:border-blue"
          >
            <PropertyArt id={`${listing.code}-t`} code={listing.code} variant={listing.art} scene={item.id} building={listing.type !== "casa"} sizes="(min-width: 1024px) 240px, 33vw" className="h-auto w-full" />
            <span className="sr-only">Ver {item.label.toLowerCase()}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export function InterestForm({ listing }: { listing: Listing }) {
  const [reason, setReason] = useState<string>(interestReasons[0]);
  const [period, setPeriod] = useState<string>(visitPeriods[0]);
  return (
    <form onSubmit={(event) => event.preventDefault()} className="space-y-4" aria-label="Tenho interesse">
      <label className="block text-sm font-semibold">
        O que você gostaria?
        <select value={reason} onChange={(event) => setReason(event.target.value)} className="field font-normal">
          {interestReasons.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-semibold">
        Melhor período
        <select value={period} onChange={(event) => setPeriod(event.target.value)} className="field font-normal">
          {visitPeriods.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </label>
      <p className="text-xs text-muted">A mensagem já leva o código {listing.code}. Não pedimos seus dados nesta demonstração.</p>
      <MessagePreview
        businessName="Horizonte Imóveis"
        message={buildInterestMessage(listing, reason, period)}
        triggerLabel="Tenho interesse"
        triggerClassName="btn btn-primary w-full"
      />
    </form>
  );
}
