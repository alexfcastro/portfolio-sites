"use client";

import { Heart } from "lucide-react";
import { favoritesStore, toggle } from "@/lib/favorites";

export function FavoriteButton({ code, title, className = "" }: { code: string; title: string; className?: string }) {
  const state = favoritesStore.useStore();
  const active = state?.codes.includes(code) ?? false;
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={() => toggle(code)}
      disabled={!state}
      className={`inline-flex size-11 items-center justify-center rounded-full bg-paper/95 shadow ${className}`}
    >
      <Heart aria-hidden className={`size-5 ${active ? "fill-heart text-heart" : "text-ink"}`} />
      <span className="sr-only">{active ? `Remover ${title} dos favoritos` : `Salvar ${title} nos favoritos`}</span>
    </button>
  );
}
