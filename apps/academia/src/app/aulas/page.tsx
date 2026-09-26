import type { Metadata } from "next";
import { ClassGrid } from "@/components/class-grid";
import { modalities } from "@/data/studio";

export const metadata: Metadata = { title: "Grade de aulas" };

export default async function ClassesPage({ searchParams }: PageProps<"/aulas">) {
  const { modalidade } = await searchParams;
  const initialModality = typeof modalidade === "string" && modalities.some((m) => m.id === modalidade) ? modalidade : "todos";
  return (
    <div className="wrap py-10 sm:py-14">
      <p className="kicker">Próximos 7 dias</p>
      <h1 className="mt-2 text-5xl">Grade de aulas</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Filtre as aulas e reserve uma aula experimental. As vagas são de exemplo e nada é enviado ao estúdio.
      </p>
      <div className="mt-8">
        <ClassGrid initialModality={initialModality} />
      </div>
    </div>
  );
}
