import { Bath, BedDouble, Car, Ruler } from "lucide-react";
import Link from "next/link";
import { FavoriteButton } from "@/components/favorite-button";
import { PropertyArt } from "@/components/property-art";
import { purposeLabels, typeLabels, type Listing } from "@/data/listings";
import { formatPrice } from "@/lib/search";

export function ListingCard({ listing, headingLevel: Heading = "h3" }: { listing: Listing; headingLevel?: "h2" | "h3" }) {
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-card border border-line bg-paper">
      <PropertyArt id={listing.code} variant={listing.art} building={listing.type !== "casa"} className="h-auto w-full" />
      <span className="absolute top-3 left-3 rounded-full bg-ink/85 px-2.5 py-1 text-xs font-semibold text-white">
        {purposeLabels[listing.purpose]}
      </span>
      <FavoriteButton code={listing.code} title={listing.title} className="absolute top-2 right-2 z-10" />
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xl font-bold">{formatPrice(listing)}</p>
        <Heading className="mt-1 text-base font-semibold">
          <Link href={`/imoveis/${listing.code}`} className="after:absolute after:inset-0 after:content-['']">
            {listing.title}
          </Link>
        </Heading>
        <p className="text-sm text-muted">
          {typeLabels[listing.type]} · {listing.neighborhood}
        </p>
        <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          {listing.bedrooms > 0 && (
            <li className="inline-flex items-center gap-1">
              <BedDouble aria-hidden className="size-4" /> {listing.bedrooms} quarto{listing.bedrooms > 1 ? "s" : ""}
            </li>
          )}
          <li className="inline-flex items-center gap-1">
            <Bath aria-hidden className="size-4" /> {listing.bathrooms} banh.
          </li>
          <li className="inline-flex items-center gap-1">
            <Car aria-hidden className="size-4" /> {listing.parking} vaga{listing.parking === 1 ? "" : "s"}
          </li>
          <li className="inline-flex items-center gap-1">
            <Ruler aria-hidden className="size-4" /> {listing.areaM2} m²
          </li>
        </ul>
        <p className="mt-auto pt-4 text-xs text-muted">Cód. {listing.code}</p>
      </div>
    </article>
  );
}
