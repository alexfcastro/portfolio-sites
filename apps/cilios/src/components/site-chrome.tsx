import Link from "next/link";
import { siteConfig } from "@/config/site";
import { lab } from "@/data/lab";

export function Marca({ claro = false }: { claro?: boolean }) {
  return (
    <span className={`inline-flex items-baseline gap-1 text-xl font-bold tracking-tight whitespace-nowrap ${claro ? "text-offwhite" : ""}`} style={{ fontFamily: "var(--font-serif)" }}>
      Lash<span className={claro ? "text-rosa-claro" : "text-rosa-escuro"}>Lab</span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink text-offwhite">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Link href="/" className="rounded-md" aria-label="Lash Lab — início">
          <Marca claro />
        </Link>
        <nav aria-label="Principal" className="flex items-center gap-1">
          <Link href="/?caminho=cliente#caminho" className="inline-flex min-h-11 items-center rounded-full px-3 font-medium text-white/85 hover:text-white">
            Fazer cílios
          </Link>
          <Link href="/?caminho=aluna#caminho" className="inline-flex min-h-11 items-center rounded-full border border-white/30 px-4 font-medium hover:border-white">
            Curso
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const { quoteUrl } = siteConfig.portfolio;
  return (
    <footer className="bg-ink text-offwhite">
      <div className="wrap grid gap-8 py-12 md:grid-cols-[1.3fr_1fr]">
        <div>
          <Marca claro />
          <p className="mt-3 text-sm text-white/70">
            {lab.horario} · {lab.bairro}
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/70">
            O Lash Lab, a lash designer {lab.profissional} e as ex-alunas são fictícias. Este site é uma demonstração criada pelo
            Estúdio X, de Alex Castro: técnicas, preços, turma, vagas e trabalhos são exemplos, e nenhum horário, vaga ou pagamento é
            registrado de verdade. As fotos são ilustrativas, geradas por IA.
          </p>
        </div>
        {quoteUrl && (
          <div className="rounded-card border border-white/15 p-6">
            <p className="text-xl font-semibold">Gostou desta demonstração?</p>
            <p className="mt-2 text-sm leading-relaxed text-white/70">
              Um site como este pode ser adaptado para quem atende e também dá cursos. Fale com quem desenvolveu.
            </p>
            <a href={quoteUrl} className="btn mt-4 border border-white/40 text-offwhite hover:border-white">
              Solicitar um site como este
            </a>
          </div>
        )}
      </div>
    </footer>
  );
}
