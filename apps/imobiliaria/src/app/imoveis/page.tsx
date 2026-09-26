import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchPanel, SearchPanelWithParams } from "@/components/search-panel";

export const metadata: Metadata = {
  title: "Buscar imóveis",
  description: "Busca com filtros combinados por finalidade, tipo, bairro, preço e quartos.",
};

export default function SearchPage() {
  return (
    <div className="wrap py-10 sm:py-14">
      <p className="kicker">Busca</p>
      <h1 className="mt-2 text-4xl">Imóveis</h1>
      <div className="mt-8">
        <Suspense fallback={<SearchPanel />}>
          <SearchPanelWithParams />
        </Suspense>
      </div>
    </div>
  );
}
