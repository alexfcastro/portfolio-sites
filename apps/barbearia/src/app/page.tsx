import { CalendarPlus, Clock, MapPin, Scissors, Star } from "lucide-react";
import Link from "next/link";
import { IllustrativeMap, StyleIllustration, galleryItems } from "@/components/illustrations";
import { WhatsAppPreview } from "@/components/whatsapp-preview";
import { business, professionals, sampleReviews, services } from "@/data/business";
import { genericGreeting } from "@/lib/messages";
import { formatBRL } from "@/lib/money";
import { formatTime } from "@/lib/time";

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
      <section aria-labelledby="hero-title" className="relative overflow-hidden border-b border-edge">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent_0_38px,rgb(201_164_92/0.05)_38px_40px)]"
        />
        <div className="wrap relative grid items-center gap-12 py-16 sm:py-24 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <p className="kicker">Barbearia · Cortes e barba</p>
            <h1 id="hero-title" className="mt-4 text-5xl leading-[0.95] font-bold sm:text-7xl">
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

          <div aria-hidden className="relative mx-auto aspect-square w-full max-w-sm">
            <div className="absolute inset-0 rounded-full border border-gold/30" />
            <div className="absolute inset-6 rounded-full border border-gold/15" />
            <div className="absolute inset-12 grid place-items-center rounded-full bg-coal-2">
              <Scissors className="size-24 text-gold" strokeWidth={1.25} />
            </div>
            <div className="absolute right-2 bottom-8 rounded-lg border border-edge bg-coal-3 px-4 py-3 font-display tracking-wider uppercase">
              <span className="block text-xs text-smoke">Agenda on-line</span>
              <span className="text-lg text-gold">{business.bookingWindowDays} dias à frente</span>
            </div>
          </div>
        </div>
      </section>

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
                <span
                  aria-hidden
                  className="grid size-16 place-items-center rounded-full border border-gold/40 bg-coal-3 font-display text-2xl text-gold"
                >
                  {professional.shortName.slice(0, 1)}
                </span>
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
        <p className="mt-3 text-smoke">Ilustrações de estilos de corte — não são fotos de clientes.</p>
        <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
          {galleryItems.map((item) => (
            <li key={item.id}>
              <figure className="overflow-hidden rounded-card border border-edge">
                <StyleIllustration id={item.id} />
                <figcaption className="bg-coal-2 px-4 py-3 font-display tracking-wider uppercase">{item.label}</figcaption>
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
