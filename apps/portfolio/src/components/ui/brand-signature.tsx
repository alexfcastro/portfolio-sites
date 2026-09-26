import Link from "next/link";
import { AxSymbol } from "@/components/ui/ax-symbol";
import { siteConfig } from "@/config/site";

interface BrandSignatureProps {
  tone?: "light" | "dark";
  /** Quando verdadeiro, o conjunto é um link para a Home. */
  asHomeLink?: boolean;
}

export function BrandSignature({ tone = "light", asHomeLink = false }: BrandSignatureProps) {
  const content = (
    <>
      <AxSymbol tone={tone} className="size-8 shrink-0" />
      <span className="font-display text-[1.0625rem] font-bold tracking-tight whitespace-nowrap">{siteConfig.name}</span>
    </>
  );

  if (!asHomeLink) {
    return <span className="inline-flex items-center gap-2.5">{content}</span>;
  }

  return (
    <Link
      href="/"
      className="inline-flex min-h-11 items-center gap-2.5 rounded-md"
      aria-label={`${siteConfig.name} — página inicial`}
    >
      {content}
    </Link>
  );
}
