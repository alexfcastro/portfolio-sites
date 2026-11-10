import type { ReactNode } from "react";

interface PageIntroProps {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}

export function PageIntro({ eyebrow, title, children }: PageIntroProps) {
  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50rem_24rem_at_90%_-20%,var(--color-accent-soft),transparent_70%)]"
      />
      <div className="container-page relative pt-14 pb-12 sm:pt-20">
        <p className="eyebrow rise-in">{eyebrow}</p>
        <h1
          style={{ "--i": 1 } as React.CSSProperties}
          className="rise-in mt-3 max-w-3xl text-4xl leading-[1.05] font-extrabold tracking-tight sm:text-6xl"
        >
          {title}
        </h1>
        {children && (
          <div style={{ "--i": 2 } as React.CSSProperties} className="rise-in mt-5 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
