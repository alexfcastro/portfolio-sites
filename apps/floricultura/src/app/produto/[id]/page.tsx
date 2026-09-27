import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Gallery } from "@/components/gallery";
import { OrderFlow } from "@/components/order-flow";
import { getProduct, occasions, products } from "@/data/shop";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: PageProps<"/produto/[id]">): Promise<Metadata> {
  const product = getProduct((await params).id);
  return product ? { title: product.name } : {};
}

export default async function ProductPage({ params }: PageProps<"/produto/[id]">) {
  const product = getProduct((await params).id);
  if (!product) notFound();

  return (
    <div className="wrap py-8 sm:py-12">
      <Link href="/catalogo" className="inline-flex min-h-11 items-center text-sm text-muted underline-offset-4 hover:underline">
        ← Voltar ao catálogo
      </Link>
      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
        <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <Gallery art={product.art} />
          <p className="mt-6 text-xs tracking-wide text-muted uppercase">
            {product.occasionIds.map((id) => occasions.find((o) => o.id === id)?.name).join(" · ")}
          </p>
          <h1 className="mt-2 text-5xl">{product.name}</h1>
          <p className="mt-3 text-lg leading-relaxed text-muted">{product.description}</p>
        </div>
        <div className="min-w-0">
          <OrderFlow productId={product.id} />
        </div>
      </div>
    </div>
  );
}
