import { Bike, Scale, Store } from "lucide-react";
import Link from "next/link";
import { ProductArt } from "@/components/product-art";
import { ProductCard } from "@/components/product-card";
import { categories, faq, FREE_DELIVERY_FROM_CENTS, products, regions, storeHours } from "@/data/catalog";
import { formatBRL } from "@/lib/money";

export default function HomePage() {
  const featured = products.filter((p) => p.featured && p.categoryId !== "kits");
  const promos = products.filter((p) => p.promoPercent);
  const kits = products.filter((p) => p.categoryId === "kits");
  const news = products.filter((p) => p.isNew);
  const hero = products.find((p) => p.id === "granola-tradicional")!;
  const heroJar = products.find((p) => p.id === "mel-silvestre")!;

  return (
    <>
      <section className="overflow-hidden">
        <div className="wrap grid items-center gap-10 py-12 md:grid-cols-[1.15fr_1fr] md:py-20">
          <div>
            <p className="kicker">Empório de produtos naturais</p>
            <h1 className="mt-3 text-4xl leading-tight sm:text-6xl">Do jeito que você usa: 100&nbsp;g, 250&nbsp;g ou 1&nbsp;kg</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
              Grãos, castanhas, chás e temperos a granel. Escolha o peso, veja o preço na hora e monte um pedido só
              para retirar ou receber em casa.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/produtos" className="btn btn-primary">
                Ver produtos
              </Link>
              <Link href="/produtos?promocao=1" className="btn btn-secondary">
                Promoções da semana
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="overflow-hidden rounded-[2rem] border-4 border-paper shadow-lg">
              <ProductArt product={hero} className="h-auto w-full" />
            </div>
            <div className="absolute -bottom-6 -left-4 w-36 overflow-hidden rounded-3xl border-4 border-paper shadow-lg sm:w-44">
              <ProductArt product={heroJar} className="h-auto w-full" />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="como-title" className="border-y border-line bg-paper">
        <div className="wrap grid gap-6 py-10 sm:grid-cols-3">
          <h2 id="como-title" className="sr-only">
            Como funciona
          </h2>
          {[
            { icon: Scale, title: "Preço pelo peso", text: "Calculado pelo valor do quilo, arredondado ao centavo." },
            { icon: Store, title: "Retirada sem taxa", text: "Monte o pedido e retire na loja." },
            {
              icon: Bike,
              title: "Entrega por bairro",
              text: `Taxa por bairro atendido; grátis acima de ${formatBRL(FREE_DELIVERY_FROM_CENTS)}.`,
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-olive-soft text-olive-dark">
                <item.icon aria-hidden className="size-6" />
              </span>
              <div>
                <p className="font-bold">{item.title}</p>
                <p className="text-sm text-muted">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="categorias-title" className="wrap py-14">
        <h2 id="categorias-title" className="text-3xl">
          Categorias
        </h2>
        <ul className="mt-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/produtos?categoria=${category.id}`}
                className="inline-flex min-h-11 items-center rounded-full border border-line bg-paper px-4 font-semibold hover:border-olive"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <ProductRow id="destaques" title="Destaques" items={featured} href="/produtos" />
      <ProductRow id="promocoes" title="Promoções" items={promos} href="/produtos?promocao=1" tone="soft" />
      <ProductRow id="novidades" title="Novidades" items={news} href="/produtos" />
      <ProductRow id="kits" title="Kits temáticos" items={kits} href="/produtos?categoria=kits" tone="soft" />

      <section aria-labelledby="loja-title" className="wrap grid gap-8 py-16 md:grid-cols-2">
        <div>
          <h2 id="loja-title" className="text-3xl">
            A loja
          </h2>
          <p className="mt-3 text-muted">Endereço e mapa não são exibidos: a Raiz &amp; Grão é fictícia.</p>
          <dl className="mt-6 space-y-2">
            {storeHours.map(([day, hours]) => (
              <div key={day} className="flex justify-between gap-4 border-b border-line pb-2">
                <dt className="font-semibold">{day}</dt>
                <dd className="text-muted">{hours}</dd>
              </div>
            ))}
          </dl>
          <h3 className="mt-8 text-xl">Bairros atendidos (exemplo)</h3>
          <ul className="mt-3 space-y-1 text-muted">
            {regions.map((region) => (
              <li key={region.id}>
                {region.name} · entrega {formatBRL(region.feeCents)}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-3xl">Perguntas frequentes</h2>
          <div className="mt-6 space-y-3">
            {faq.map((item) => (
              <details key={item.q} className="rounded-2xl border border-line bg-paper px-5 py-4">
                <summary className="cursor-pointer font-semibold">{item.q}</summary>
                <p className="mt-2 text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ProductRow({
  id,
  title,
  items,
  href,
  tone,
}: {
  id: string;
  title: string;
  items: typeof products;
  href: string;
  tone?: "soft";
}) {
  return (
    <section aria-labelledby={`${id}-title`} className={tone === "soft" ? "bg-olive-soft/60" : ""}>
      <div className="wrap py-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id={`${id}-title`} className="text-3xl">
            {title}
          </h2>
          <Link href={href} className="inline-flex min-h-11 items-center font-semibold text-olive-dark underline underline-offset-4">
            Ver todos<span className="sr-only">: {title.toLowerCase()}</span>
          </Link>
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {items.slice(0, 4).map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
