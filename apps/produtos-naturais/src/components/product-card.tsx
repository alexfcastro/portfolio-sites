import Link from "next/link";
import { ProductArt } from "@/components/product-art";
import { FavoriteButton } from "@/components/shop-links";
import { getCategory, stockLabels, type Product } from "@/data/catalog";
import { fromPrice, listPrice } from "@/lib/cart";
import { formatBRL } from "@/lib/money";

export function ProductBadges({ product }: { product: Product }) {
  return (
    <>
      {product.promoPercent ? <span className="badge bg-terra text-white">−{product.promoPercent}%</span> : null}
      {product.isNew ? <span className="badge bg-olive text-white">Novidade</span> : null}
      {product.stock !== "disponivel" ? (
        <span className={`badge ${product.stock === "esgotado" ? "bg-ink text-white" : "bg-terra-soft text-alert"}`}>
          {stockLabels[product.stock]}
        </span>
      ) : null}
    </>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const price = fromPrice(product);
  const first = product.sale.kind === "peso" ? product.sale.options[0]! : null;
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-paper">
      <div className="relative">
        <ProductArt product={product} className={`h-auto w-full ${product.stock === "esgotado" ? "opacity-60 grayscale" : ""}`} />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1">
          <ProductBadges product={product} />
        </div>
        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton productId={product.id} name={product.name} />
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-semibold text-muted">{getCategory(product.categoryId)?.name}</p>
        <h3 className="mt-1 text-lg leading-snug">
          <Link href={`/produtos/${product.id}`} className="after:absolute after:inset-0 hover:underline">
            {product.name}
          </Link>
        </h3>
        <p className="mt-auto pt-3">
          {product.promoPercent ? (
            <span className="mr-2 text-sm text-muted line-through">
              <span className="sr-only">De </span>
              {formatBRL(listPrice(product, first))}
            </span>
          ) : null}
          <span className="text-lg font-bold text-olive-dark">
            {product.promoPercent ? <span className="sr-only">por </span> : null}
            {formatBRL(price.cents)}
          </span>
          <span className="text-sm text-muted"> / {price.label}</span>
        </p>
      </div>
    </article>
  );
}
