import { SectionHeading } from "@/components/ui/section-heading";

/*
 * Dúvidas sobre a contratação. As respostas descrevem o que é combinado na proposta, sem prometer
 * preço, prazo ou condição fixa: esses pontos dependem do escopo de cada projeto.
 * REVISAR COM O PROPRIETÁRIO antes de publicar, para refletir como ele realmente trabalha.
 */
const questions = [
  {
    q: "Quanto custa um site?",
    a: "Depende do que o site precisa fazer. Um site de apresentação é diferente de um com agendamento ou pedidos. Depois de entender o seu negócio, envio uma proposta com o escopo, o valor e o prazo por escrito, antes de qualquer compromisso.",
  },
  {
    q: "Posso começar com algo menor?",
    a: "Pode. Dá para publicar uma primeira versão só com o essencial e acrescentar recursos depois. Na proposta, deixo claro o que entra agora e o que fica para uma próxima etapa.",
  },
  {
    q: "Preciso ter fotos e textos prontos?",
    a: "Não precisa ter tudo pronto. Na conversa inicial, vemos o que você já tem e o que falta. O que ficar por minha conta e o que ficar por sua conta é combinado na proposta.",
  },
  {
    q: "E o domínio e a hospedagem?",
    a: "São o endereço do site e o lugar onde ele fica no ar. Explico as opções e os custos envolvidos, e a proposta diz quem contrata e quem paga cada um.",
  },
  {
    q: "Dá para pedir ajustes durante o projeto?",
    a: "Sim. Você acompanha prévias do site e pede ajustes de cores, textos, fotos e fluxos antes da publicação. A proposta define como funcionam as rodadas de revisão.",
  },
  {
    q: "O que acontece depois que o site vai ao ar?",
    a: "Reviso tudo no endereço final e explico como o site funciona. Manutenção e mudanças futuras podem ser combinadas à parte, conforme a sua necessidade.",
  },
];

export function Faq() {
  return (
    <section aria-labelledby="duvidas-title" className="bg-paper py-20 sm:py-28">
      <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <SectionHeading id="duvidas-title" eyebrow="Dúvidas frequentes" title="Como funciona a contratação">
          <p>O que costuma ser perguntado antes de começar. O que for específico do seu caso, respondo na conversa.</p>
        </SectionHeading>
        <div className="divide-y divide-line border-y border-line">
          {questions.map((item) => (
            <details key={item.q} className="group py-1">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-display text-lg font-bold [&::-webkit-details-marker]:hidden">
                {item.q}
                <span
                  aria-hidden
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xl leading-none text-accent transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="pb-5 leading-relaxed text-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
