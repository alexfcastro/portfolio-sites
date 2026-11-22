import { ArrowLeft, Check } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/loja/add-to-cart";
import { ProductPhoto } from "@/components/loja/product-photo";
import { ProductCard } from "@/components/loja/storefront";
import { getService } from "@/data/business";
import { categories, getProduct, PIX_DISCOUNT_PCT, products } from "@/data/loja";
import { formatBRL } from "@/lib/money";

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const product = getProduct((await params).id);
  return product ? { title: product.name, description: `${product.tagline}. Produto fictício da loja de demonstração.` } : {};
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const product = getProduct((await params).id);
  if (!product) notFound();
  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 3);
  const pix = product.priceCents - Math.round((product.priceCents * PIX_DISCOUNT_PCT) / 100);

  return (
    <div className="wrap py-10 sm:py-14">
      <Link href="/loja" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-smoke hover:text-cream">
        <ArrowLeft aria-hidden className="size-4" />
        Voltar para a loja
      </Link>
      <div className="mt-4 grid gap-10 lg:grid-cols-2">
        <div className="overflow-hidden rounded-card border border-edge">
          <ProductPhoto product={product} sizes="(min-width: 1024px) 560px, 100vw" />
        </div>
        <div>
          <p className="kicker">
            {categories[product.category]} · {product.size}
          </p>
          <h1 className="mt-3 text-5xl font-bold">{product.name}</h1>
          <p className="mt-2 text-lg text-smoke">{product.tagline}</p>
          <p className="mt-6">
            {product.listPriceCents && <span className="mr-3 text-smoke line-through">{formatBRL(product.listPriceCents)}</span>}
            <span className="font-display text-4xl font-semibold text-gold">{formatBRL(product.priceCents)}</span>
          </p>
          <p className="text-sm text-ok">
            {formatBRL(pix)} no Pix ({PIX_DISCOUNT_PCT}% de desconto)
          </p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {product.traits.map((trait) => (
              <li key={trait} className="rounded-full border border-edge px-3 py-1 text-sm">
                {trait}
              </li>
            ))}
          </ul>
          <div className="mt-6 max-w-sm">
            <AddToCart productId={product.id} />
          </div>
          <div className="mt-6 space-y-5 border-t border-edge pt-6">
            <section>
              <h2 className="text-xl font-semibold">Sobre</h2>
              <p className="mt-1 text-smoke">{product.description}</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold">Como usar</h2>
              <p className="mt-1 text-smoke">{product.howTo}</p>
            </section>
            <section>
              <h2 className="text-xl font-semibold">Combina com</h2>
              <ul className="mt-2 space-y-1 text-smoke">
                {product.pairsWith.map((id) => (
                  <li key={id} className="flex gap-2">
                    <Check aria-hidden className="mt-1 size-4 shrink-0 text-gold" />
                    {getService(id)?.name}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <section aria-labelledby="relacionados" className="mt-16">
          <h2 id="relacionados" className="text-3xl font-bold">
            Da mesma linha
          </h2>
          <ul className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
