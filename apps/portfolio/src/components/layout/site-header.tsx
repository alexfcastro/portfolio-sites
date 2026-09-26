import { HeaderNavigation } from "@/components/layout/header-navigation";
import { BrandSignature } from "@/components/ui/brand-signature";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-canvas/90 backdrop-blur-md supports-[backdrop-filter]:bg-canvas/80">
      <div className="container-page flex h-(--header-height) items-center justify-between gap-6">
        <BrandSignature asHomeLink />
        <HeaderNavigation />
      </div>
    </header>
  );
}
