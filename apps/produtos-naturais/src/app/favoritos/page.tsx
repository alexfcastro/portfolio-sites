import type { Metadata } from "next";
import { FavoritesList } from "@/components/favorites-list";

export const metadata: Metadata = { title: "Favoritos" };

export default function FavoritesPage() {
  return (
    <div className="wrap py-10 sm:py-14">
      <p className="kicker">Neste navegador</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">Favoritos</h1>
      <p className="mt-3 max-w-2xl text-muted">Produtos salvos só neste navegador, sem cadastro.</p>
      <div className="mt-8">
        <FavoritesList />
      </div>
    </div>
  );
}
