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
      <AxSymbol variant="tile" className="size-10 shrink-0 drop-shadow-[0_6px_14px_rgb(47_84_235/0.45)]" />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.125rem] font-extrabold tracking-tight whitespace-nowrap">{siteConfig.name}</span>
        <span
          className={`mt-1 text-[0.8125rem] font-semibold tracking-[0.01em] whitespace-nowrap ${tone === "dark" ? "text-muted-on-dark" : "text-muted"}`}
        >
          por {siteConfig.owner}
        </span>
      </span>
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
