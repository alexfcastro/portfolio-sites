"use client";

import Link from "next/link";
import { ListingCard } from "@/components/listing-card";
import { getListing, type Listing } from "@/data/listings";
import { favoritesStore } from "@/lib/favorites";

export function FavoritesList() {
  const state = favoritesStore.useStore();
  if (!state) {
    return (
      <p role="status" className="text-muted">
        Carregando…
      </p>
    );
  }
  const items = state.codes.map((code) => getListing(code)).filter((item): item is Listing => Boolean(item));
  if (items.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-line bg-paper p-12 text-center">
        <p className="text-muted">Você ainda não salvou nenhum imóvel. Toque no coração de um imóvel para guardá-lo aqui.</p>
        <Link href="/imoveis" className="btn btn-primary mt-6">
          Buscar imóveis
        </Link>
      </div>
    );
  }
  return (
    <>
      <p role="status" className="font-semibold">
        {items.length} {items.length === 1 ? "imóvel salvo" : "imóveis salvos"}
      </p>
      <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((listing) => (
          <li key={listing.code}>
            <ListingCard listing={listing} headingLevel="h2" />
          </li>
        ))}
      </ul>
    </>
  );
}
