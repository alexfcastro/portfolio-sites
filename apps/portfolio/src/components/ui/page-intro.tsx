import type { ReactNode } from "react";

interface PageIntroProps {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}

export function PageIntro({ eyebrow, title, children }: PageIntroProps) {
  return (
    <div className="container-page pt-12 pb-10 sm:pt-16">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-3 max-w-3xl text-4xl leading-[1.1] font-extrabold sm:text-5xl">{title}</h1>
      {children && <div className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">{children}</div>}
    </div>
  );
}
