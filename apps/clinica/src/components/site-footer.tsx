import Link from "next/link";
import { VitaLogo } from "@/components/brand";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  const { quoteUrl } = siteConfig.portfolio;
  return (
    <footer className="border-t border-line bg-paper">
      <div className="wrap grid gap-8 py-12 md:grid-cols-[1.3fr_1fr]">
        <div>
          <VitaLogo />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            A Vita Clínica é um negócio fictício. Esta página é uma demonstração criada por Alex Castro: especialidades,
            profissionais e horários são exemplos. Nenhuma consulta é marcada e nenhum dado de saúde é coletado. As fotos são ilustrativas, geradas por IA.
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-5 text-sm">
            <li>
              <Link href="/solicitar" className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                Solicitar horário
              </Link>
            </li>
            <li>
              <Link href="/minhas-solicitacoes" className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                Minhas solicitações
              </Link>
            </li>
          </ul>
        </div>
        {quoteUrl && (
          <div className="rounded-card border border-line bg-mist p-6">
            <p className="font-serif text-lg font-semibold">Gostou desta demonstração?</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Um site como este pode ser adaptado para a sua clínica ou consultório. Fale com quem desenvolveu.
            </p>
            <a href={quoteUrl} className="btn btn-secondary mt-4">
              Solicitar um site como este
            </a>
          </div>
        )}
      </div>
    </footer>
  );
}
