import type { Metadata } from "next";
import { FavoritesList } from "@/components/favorites-list";

export const metadata: Metadata = {
  title: "Favoritos",
  description: "Imóveis salvos neste navegador.",
};

export default function FavoritesPage() {
  return (
    <div className="wrap py-10 sm:py-14">
      <p className="kicker">Favoritos</p>
      <h1 className="mt-2 text-4xl">Imóveis salvos</h1>
      <p className="mt-2 text-muted">Favoritos de demonstração: ficam só neste navegador, sem cadastro.</p>
      <div className="mt-8">
        <FavoritesList />
      </div>
    </div>
  );
}
