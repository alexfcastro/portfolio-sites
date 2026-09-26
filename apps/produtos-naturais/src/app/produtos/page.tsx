import type { Metadata } from "next";
import { Catalog } from "@/components/catalog";
import { categories } from "@/data/catalog";

export const metadata: Metadata = { title: "Produtos" };

export default async function ProductsPage({ searchParams }: PageProps<"/produtos">) {
  const { categoria, promocao } = await searchParams;
  const categoryId = typeof categoria === "string" && categories.some((c) => c.id === categoria) ? categoria : "todas";
  return (
    <div className="wrap py-10 sm:py-14">
      <p className="kicker">Catálogo</p>
      <h1 className="mt-2 text-4xl sm:text-5xl">Produtos</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Preços de exemplo. Produtos a granel mostram o valor a partir do menor peso; escolha o peso na página do produto.
      </p>
      <div className="mt-8">
        {/* A chave remonta o catálogo quando o link do menu muda os parâmetros. */}
        <Catalog key={`${categoryId}-${promocao === "1"}`} initialCategory={categoryId} initialPromo={promocao === "1"} />
      </div>
    </div>
  );
}
