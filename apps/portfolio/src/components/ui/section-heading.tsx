import type { ReactNode } from "react";

interface SectionHeadingProps {
  id?: string;
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  align?: "left" | "center";
}

export function SectionHeading({ id, eyebrow, title, children, align = "left" }: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto text-center" : "";
  return (
    <div className={`max-w-2xl ${alignment}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id} className="mt-3 text-3xl leading-tight font-extrabold sm:text-4xl">
        {title}
      </h2>
      {children && <div className="mt-4 text-lg leading-relaxed text-muted on-dark:text-muted-on-dark">{children}</div>}
    </div>
  );
}
