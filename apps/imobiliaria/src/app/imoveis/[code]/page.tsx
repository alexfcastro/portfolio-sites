import { ArrowLeft, Check, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FavoriteButton } from "@/components/favorite-button";
import { Gallery, InterestForm } from "@/components/listing-detail";
import { getListing, listings, purposeLabels, typeLabels } from "@/data/listings";
import { formatPrice } from "@/lib/search";

export const dynamicParams = false;

export function generateStaticParams() {
  return listings.map((listing) => ({ code: listing.code }));
}

export async function generateMetadata({ params }: PageProps<"/imoveis/[code]">): Promise<Metadata> {
  const listing = getListing((await params).code);
  return listing ? { title: `${listing.title} (${listing.code})`, description: listing.description } : {};
}

export default async function ListingPage({ params }: PageProps<"/imoveis/[code]">) {
  const listing = getListing((await params).code);
  if (!listing) notFound();

  const facts = [
    ["Área", `${listing.areaM2} m²`],
    ["Quartos", String(listing.bedrooms)],
    ["Banheiros", String(listing.bathrooms)],
    ["Vagas", String(listing.parking)],
  ];

  return (
    <div className="wrap py-10 sm:py-14">
      <Link href="/imoveis" className="inline-flex min-h-11 items-center gap-1.5 text-sm font-semibold text-blue">
        <ArrowLeft aria-hidden className="size-4" /> Voltar à busca
      </Link>
      <div className="mt-4 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <Gallery listing={listing} />
          <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-blue">
                {purposeLabels[listing.purpose]} · {typeLabels[listing.type]} · Cód. {listing.code}
              </p>
              <h1 className="mt-1 text-4xl">{listing.title}</h1>
              <p className="mt-1 inline-flex items-center gap-1 text-muted">
                <MapPin aria-hidden className="size-4" /> {listing.neighborhood}
              </p>
            </div>
            <FavoriteButton code={listing.code} title={listing.title} className="border border-line" />
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {facts.map(([term, value]) => (
              <div key={term} className="rounded-lg border border-line bg-paper p-4">
                <dt className="text-xs font-semibold text-muted uppercase">{term}</dt>
                <dd className="text-xl font-bold">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-lg leading-relaxed">{listing.description}</p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {listing.features.map((feature) => (
              <li key={feature} className="flex gap-2">
                <Check aria-hidden className="mt-0.5 size-5 shrink-0 text-blue" /> {feature}
              </li>
            ))}
          </ul>
          <div className="mt-8 rounded-card border border-line bg-paper p-5">
            <h2 className="text-lg">Localização</h2>
            <svg viewBox="0 0 400 150" className="mt-3 h-auto w-full rounded-lg" role="img" aria-labelledby={`mapa-${listing.code}`}>
              <title id={`mapa-${listing.code}`}>Mapa ilustrativo do bairro, sem endereço real</title>
              <rect width="400" height="150" fill="#e7eef7" />
              <path d="M0 90 Q120 70 200 100 T400 80" stroke="#cdd9ea" strokeWidth="14" fill="none" />
              <path d="M130 0 Q150 80 120 150" stroke="#cdd9ea" strokeWidth="10" fill="none" />
              <circle cx="210" cy="92" r="26" fill="#1f5fbf" opacity="0.15" />
              <circle cx="210" cy="92" r="9" fill="#1f5fbf" stroke="#fff" strokeWidth="4" />
            </svg>
            <p className="mt-2 text-sm text-muted">Localização ilustrativa: {listing.neighborhood} é um bairro de exemplo.</p>
          </div>
        </div>
        <aside className="h-fit rounded-card border border-line bg-paper p-6 lg:sticky lg:top-24">
          <p className="text-3xl font-bold">{formatPrice(listing)}</p>
          <p className="text-sm text-muted">Valor demonstrativo</p>
          <div className="mt-6">
            <InterestForm listing={listing} />
          </div>
        </aside>
      </div>
    </div>
  );
}
