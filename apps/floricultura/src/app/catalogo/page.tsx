import type { Metadata } from "next";
import { Catalog } from "@/components/catalog";
import { occasions } from "@/data/shop";

export const metadata: Metadata = { title: "Catálogo" };

export default async function CatalogPage({ searchParams }: PageProps<"/catalogo">) {
  const { ocasiao } = await searchParams;
  const occasionId = typeof ocasiao === "string" && occasions.some((o) => o.id === ocasiao) ? ocasiao : "todas";
  return (
    <div className="wrap py-10 sm:py-14">
      <p className="kicker">Catálogo</p>
      <h1 className="mt-2 text-5xl">Flores e presentes</h1>
      <p className="mt-3 max-w-2xl text-muted">Preços de exemplo, a partir do menor tamanho. Escolha um produto para personalizar.</p>
      <div className="mt-8">
        {/* A chave remonta os filtros quando o link de ocasião muda a URL. */}
        <Catalog key={occasionId} initialOccasion={occasionId} />
      </div>
    </div>
  );
}
