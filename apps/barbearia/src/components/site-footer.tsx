import Link from "next/link";
import { BravusLogo } from "@/components/brand";
import { siteConfig } from "@/config/site";

export function SiteFooter() {
  const { quoteUrl } = siteConfig.portfolio;

  return (
    <footer className="border-t border-edge bg-coal-2">
      <div className="wrap grid gap-8 py-12 md:grid-cols-[1.3fr_1fr]">
        <div>
          <BravusLogo />
          <p className="mt-4 max-w-md text-sm leading-relaxed text-smoke">
            Bravus Barbearia é um negócio fictício. Esta página é uma demonstração criada por Alex Castro: serviços,
            preços, equipe, avaliações e agenda são exemplos, e nenhum agendamento é real.
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-5 text-sm">
            <li>
              <Link href="/agendar" className="inline-flex min-h-11 items-center text-cream underline-offset-4 hover:underline">
                Agendar horário
              </Link>
            </li>
            <li>
              <Link href="/admin" className="inline-flex min-h-11 items-center text-cream underline-offset-4 hover:underline">
                Painel demonstrativo
              </Link>
            </li>
          </ul>
        </div>

        {quoteUrl && (
          <div className="rounded-card border border-edge bg-coal p-6">
            <p className="font-display text-lg tracking-wide text-cream uppercase">Gostou desta demonstração?</p>
            <p className="mt-2 text-sm leading-relaxed text-smoke">
              Um site como este pode ser adaptado para a sua barbearia ou salão. Fale com quem desenvolveu.
            </p>
            <a href={quoteUrl} className="btn btn-line mt-4">
              Solicitar um site como este
            </a>
          </div>
        )}
      </div>
    </footer>
  );
}
