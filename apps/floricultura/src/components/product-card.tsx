import Link from "next/link";
import { FlowerArt } from "@/components/flower-art";
import { occasions, type Product } from "@/data/shop";
import { formatBRL } from "@/lib/money";
import { minPrice } from "@/lib/order";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-paper">
      <FlowerArt art={product.art} id={product.id} className="h-auto w-full transition-transform duration-300 group-hover:scale-[1.03]" />
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs tracking-wide text-muted uppercase">
          {product.occasionIds.map((id) => occasions.find((o) => o.id === id)?.name).join(" · ")}
        </p>
        <h3 className="mt-1 text-2xl">
          <Link href={`/produto/${product.id}`} className="after:absolute after:inset-0 hover:underline">
            {product.name}
          </Link>
        </h3>
        <p className="mt-auto pt-3 text-muted">
          a partir de <span className="text-lg font-medium text-ink">{formatBRL(minPrice(product))}</span>
        </p>
      </div>
    </article>
  );
}
