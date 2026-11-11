import { CalendarPlus, Clock, MapPin, Star } from "lucide-react";
import Link from "next/link";
import { Faixa } from "@/components/faixa";
import { Foto, Retrato } from "@/components/foto";
import { IllustrativeMap, StyleIllustration, galleryItems } from "@/components/illustrations";
import { WhatsAppPreview } from "@/components/whatsapp-preview";
import { business, professionals, sampleReviews, services } from "@/data/business";
import { genericGreeting } from "@/lib/messages";
import { formatBRL } from "@/lib/money";
import { formatTime } from "@/lib/time";

// Cada estilo da galeria leva ao serviço correspondente no agendamento.
const estiloParaServico: Record<(typeof galleryItems)[number]["id"], string> = {
  classico: "corte",
  degrade: "degrade",
  barba: "barba",
  texturizado: "corte",
  raspado: "combo",
  topete: "corte",
};

const weekdayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

/** Agrupa dias com o mesmo horário: "Segunda a sexta". */
function openingRows() {
  const groups: Array<{ from: number; to: number; hours: string }> = [];
  for (const day of [1, 2, 3, 4, 5, 6, 0]) {
    const window = business.hours[day];
    const hours = window ? `${formatTime(window.openMin)} às ${formatTime(window.closeMin)}` : "Fechado";
    const last = groups.at(-1);
    if (last && last.hours === hours) last.to = day;
    else groups.push({ from: day, to: day, hours });
  }
  return groups.map((group) => ({
    days:
      group.from === group.to
        ? weekdayNames[group.from]!
        : `${weekdayNames[group.from]} a ${weekdayNames[group.to]!.toLowerCase()}`,
    hours: group.hours,
  }));
}

export default function HomePage() {
  return (
    <>
      <section aria-labelledby="hero-title" className="relative isolate overflow-hidden border-b border-edge">
        {/* Foto ilustrativa (gerada por IA) ocupando a abertura; o degradê garante a leitura do texto. */}
        <Foto id="topete" preload sizes="100vw" className="fundo absolute inset-0 -z-20 size-full object-[70%_30%]" />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-r from-coal via-coal/90 to-coal/30 max-md:via-coal/85 max-md:to-coal/75"
        />
        <div className="wrap relative grid min-h-[78svh] items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <p className="kicker">Barbearia · Cortes e barba</p>
            <h1 id="hero-title" className="mt-4 text-6xl leading-[0.92] font-bold sm:text-7xl lg:text-8xl">
              Seu horário,
              <br />
              <span className="text-gold">sem espera.</span>
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-smoke">
              Escolha o serviço, o barbeiro e o horário livre em poucos passos. Valores e duração aparecem antes de
              você decidir.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/agendar" className="btn btn-gold">
                <CalendarPlus aria-hidden className="size-5" />
                Agendar horário
              </Link>
              <Link href="#servicos" className="btn btn-line">
                Ver serviços e valores
              </Link>
            </div>
          </div>

          <div aria-hidden className="hidden justify-self-end lg:block">
            <div className="parallax rounded-lg border border-gold/50 bg-coal/80 px-6 py-5 font-display tracking-wider uppercase backdrop-blur">
              <span className="block text-sm text-smoke">Agenda on-line</span>
              <span className="text-3xl text-gold">{business.bookingWindowDays} dias à frente</span>
            </div>
          </div>
        </div>
      </section>

      <Faixa
        className="border-b border-edge bg-gold font-display text-lg text-coal"
        itens={["Corte clássico", "Degradê", "Barba na navalha", "Acabamento", "Sem fila, com hora marcada"]}
      />

      <section id="servicos" aria-labelledby="servicos-title" className="wrap py-20">
        <p className="kicker">Serviços</p>
        <h2 id="servicos-title" className="mt-3 text-4xl font-bold sm:text-5xl">
          Valores e duração
        </h2>
        <p className="mt-3 max-w-xl text-smoke">Preços de demonstração, apenas para ilustrar o funcionamento do site.</p>
        <ul className="mt-10 grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <li
              key={service.id}
              className="flex flex-col gap-4 rounded-card border border-edge bg-coal-2 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <h3 className="text-2xl font-semibold">{service.name}</h3>
                <p className="mt-1 text-sm text-smoke">{service.description}</p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-smoke">
                  <Clock aria-hidden className="size-4" /> {service.durationMin} min
                </p>
              </div>
              <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                <span className="font-display text-2xl font-semibold text-gold">{formatBRL(service.priceCents)}</span>
                <Link href={`/agendar?servico=${service.id}`} className="btn btn-line !min-h-11 !px-4 !text-sm">
                  Agendar<span className="sr-only"> {service.name}</span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="equipe" aria-labelledby="equipe-title" className="border-y border-edge bg-coal-2 py-20">
        <div className="wrap">
          <p className="kicker">Equipe</p>
          <h2 id="equipe-title" className="mt-3 text-4xl font-bold sm:text-5xl">
            Quem atende
          </h2>
          <p className="mt-3 text-smoke">Profissionais fictícios, criados para esta demonstração.</p>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {professionals.map((professional) => (
              <li key={professional.id} className="rounded-card border border-edge bg-coal p-6">
                <Retrato
                  id={`equipe-${professional.id}`}
                  inicial={professional.shortName.slice(0, 1)}
                  className="size-20 border border-gold/40"
                  fallback="bg-coal-3 font-display text-2xl text-gold"
                />
                <h3 className="mt-4 text-2xl font-semibold">{professional.name}</h3>
                <p className="text-sm font-semibold text-gold">{professional.role}</p>
                <p className="mt-2 text-sm leading-relaxed text-smoke">{professional.bio}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="galeria" aria-labelledby="galeria-title" className="wrap py-20">
        <p className="kicker">Galeria</p>
        <h2 id="galeria-title" className="mt-3 text-4xl font-bold sm:text-5xl">
          Estilos
        </h2>
        <p className="mt-3 text-smoke">
          Viu um corte que é a sua cara? Agende direto por ele. Fotos ilustrativas geradas por IA — não são clientes
          reais.
        </p>
        <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
          {galleryItems.map((item) => (
            <li key={item.id}>
              <figure className="overflow-hidden rounded-card border border-edge bg-coal-2">
                <StyleIllustration id={item.id} />
                <figcaption className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                  <span className="font-display tracking-wider uppercase">{item.label}</span>
                  <Link
                    href={`/agendar?servico=${estiloParaServico[item.id]}`}
                    className="inline-flex min-h-11 items-center gap-1.5 font-display text-sm tracking-wider text-gold uppercase underline-offset-4 hover:underline"
                  >
                    Agendar<span className="sr-only"> {item.label}</span>
                    <span className="max-sm:sr-only"> esse corte</span>
                  </Link>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </section>

      <section id="avaliacoes" aria-labelledby="avaliacoes-title" className="border-y border-edge bg-coal-2 py-20">
        <div className="wrap">
          <p className="kicker">Avaliações</p>
          <h2 id="avaliacoes-title" className="mt-3 text-4xl font-bold sm:text-5xl">
            O que dizem
          </h2>
          <ul className="mt-10 grid gap-5 md:grid-cols-3">
            {sampleReviews.map((review) => (
              <li key={review.author} className="flex flex-col rounded-card border border-edge bg-coal p-6">
                <span className="self-start rounded-full border border-warn/40 px-2.5 py-0.5 text-xs font-semibold text-warn">
                  Avaliação fictícia
                </span>
                <p className="mt-4 flex gap-0.5 text-gold" aria-label={`${review.rating} de 5 estrelas`}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star key={index} aria-hidden className={`size-4 ${index < review.rating ? "fill-gold" : "opacity-30"}`} />
                  ))}
                </p>
                <blockquote className="mt-3 flex-1 leading-relaxed">“{review.text}”</blockquote>
                <p className="mt-4 text-sm text-smoke">— {review.author} (exemplo)</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="visite" aria-labelledby="visite-title" className="wrap grid gap-10 py-20 lg:grid-cols-2">
        <div>
          <p className="kicker">Visite</p>
          <h2 id="visite-title" className="mt-3 text-4xl font-bold sm:text-5xl">
            Horários
          </h2>
          <table className="mt-8 w-full max-w-md text-left">
            <caption className="sr-only">Horário de funcionamento</caption>
            <tbody>
              {openingRows().map((row) => (
                <tr key={row.days} className="border-b border-edge">
                  <th scope="row" className="py-3 font-medium">
                    {row.days}
                  </th>
                  <td className="py-3 text-right text-smoke">{row.hours}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-3 text-sm text-smoke">
            Pausa para almoço: {formatTime(business.lunch.startMin)} às {formatTime(business.lunch.endMin)}.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/agendar" className="btn btn-gold">
              Agendar horário
            </Link>
            <WhatsAppPreview message={genericGreeting} triggerLabel="Prévia do WhatsApp" />
          </div>
        </div>
        <figure>
          <div className="overflow-hidden rounded-card border border-edge">
            <IllustrativeMap />
          </div>
          <figcaption className="mt-3 flex items-start gap-2 text-sm text-smoke">
            <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-gold" />
            Localização ilustrativa. A Bravus é fictícia e não tem endereço.
          </figcaption>
        </figure>
      </section>
    </>
  );
}
