import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/add-to-cart";
import { ProductArt } from "@/components/product-art";
import { ProductBadges, ProductCard } from "@/components/product-card";
import { FavoriteButton } from "@/components/shop-links";
import { getCategory, getProduct, products, tagLabels } from "@/data/catalog";
import { formatBRL } from "@/lib/money";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: PageProps<"/produtos/[id]">): Promise<Metadata> {
  const product = getProduct((await params).id);
  return product ? { title: product.name } : {};
}

const infoLabels = [
  ["uso", "Formas de uso"],
  ["conservacao", "Conservação"],
  ["origem", "Origem"],
  ["ingredientes", "Ingredientes"],
  ["alergenicos", "Alergênicos"],
] as const;

export default async function ProductPage({ params }: PageProps<"/produtos/[id]">) {
  const product = getProduct((await params).id);
  if (!product) notFound();
  const category = getCategory(product.categoryId);
  const related = products.filter((p) => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);

  return (
    <div className="wrap py-8 sm:py-12">
      <nav aria-label="Trilha" className="text-sm text-muted">
        <ol className="flex flex-wrap gap-1">
          <li>
            <Link href="/produtos" className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
              Produtos
            </Link>
            <span aria-hidden> / </span>
          </li>
          <li>
            <Link
              href={`/produtos?categoria=${product.categoryId}`}
              className="inline-flex min-h-11 items-center underline-offset-4 hover:underline"
            >
              {category?.name}
            </Link>
          </li>
        </ol>
      </nav>

      <div className="mt-4 grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="relative self-start overflow-hidden rounded-card border border-line">
          <ProductArt product={product} className="h-auto w-full" />
          <p className="bg-paper px-4 py-2 text-xs text-muted">Ilustração, não é foto do produto.</p>
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            <ProductBadges product={product} />
          </div>
        </div>

        <div className="min-w-0">
          <div className="flex items-start justify-between gap-3">
            <h1 className="text-4xl">{product.name}</h1>
            <FavoriteButton productId={product.id} name={product.name} />
          </div>
          <ul className="mt-3 flex flex-wrap gap-2">
            {product.tags.map((tag) => (
              <li key={tag} className="badge border border-line bg-paper text-muted">
                {tagLabels[tag]}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-muted">
            {product.sale.kind === "peso"
              ? `Vendido por peso: ${formatBRL(product.sale.pricePerKgCents)} o quilo${product.promoPercent ? `, com ${product.promoPercent}% de desconto` : ""}.`
              : `Vendido por unidade: ${product.sale.unitLabel}.`}
          </p>
          <div className="mt-6">
            <AddToCart productId={product.id} />
          </div>

          <section aria-labelledby="info-title" className="mt-10">
            <h2 id="info-title" className="text-2xl">
              Informações do produto
            </h2>
            <dl className="mt-4 divide-y divide-line rounded-card border border-line bg-paper">
              {infoLabels.map(([key, label]) => (
                <div key={key} className="grid gap-1 p-4 sm:grid-cols-[9rem_1fr]">
                  <dt className="font-semibold">{label}</dt>
                  <dd className="text-muted">{product.info[key]}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-muted">Informações de exemplo. Informações nutricionais não estão disponíveis nesta demonstração.</p>
          </section>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="mt-16">
          <h2 id="related-title" className="text-3xl">
            Da mesma categoria
          </h2>
          <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {related.map((item) => (
              <li key={item.id}>
                <ProductCard product={item} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
