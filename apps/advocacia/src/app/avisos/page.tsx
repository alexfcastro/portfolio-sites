import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Avisos legais e privacidade",
  description: "Avisos sobre o caráter informativo do conteúdo e o tratamento de dados nesta demonstração.",
};

export default function NoticesPage() {
  return (
    <article className="wrap reading max-w-3xl py-12 text-lg leading-relaxed sm:py-16">
      <p className="kicker">Avisos</p>
      <h1 className="mt-3 text-5xl">Avisos legais e privacidade</h1>
      <h2 className="mt-10 text-3xl">Demonstração</h2>
      <p className="text-muted">
        Almeida &amp; Prado Advocacia é um escritório fictício. Este site foi criado por Alex Castro como demonstração de
        um site institucional e não presta serviços jurídicos.
      </p>
      <h2 className="mt-10 text-3xl">Conteúdo informativo</h2>
      <p className="text-muted">
        Os textos têm caráter geral e informativo. Eles não substituem a análise individual de cada situação por um
        profissional habilitado.
      </p>
      <p className="text-muted">
        Em um site real, o conteúdo precisa ser revisado conforme as normas de publicidade da advocacia aplicáveis, antes
        da publicação.
      </p>
      <h2 className="mt-10 text-3xl">Privacidade</h2>
      <p className="text-muted">
        O formulário de contato desta demonstração não pede nome, documentos nem detalhes de processos, e nada é enviado:
        a mensagem é montada só no seu navegador. Este site não usa cookies nem ferramentas de análise.
      </p>
    </article>
  );
}
