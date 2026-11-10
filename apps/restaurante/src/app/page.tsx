import { MapPin } from "lucide-react";
import Image from "next/image";
import { MenuBoard } from "@/components/menu-board";
import { MessagePreview } from "@/components/message-preview";
import { OpenStatus } from "@/components/open-status";
import { openingHours } from "@/data/menu";
import { formatTime } from "@/lib/time";

const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export default function MenuPage() {
  return (
    <>
      <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-coal text-cream">
        {/* Foto ilustrativa (gerada por IA) como fundo; o degradê garante a leitura do texto. */}
        <Image
          src="/fotos/picanha.webp"
          alt=""
          fill
          preload
          sizes="100vw"
          className="-z-20 object-cover object-[70%_center]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-gradient-to-r from-coal via-coal/90 to-coal/25 max-md:via-coal/85 max-md:to-coal/70"
        />
        <div className="wrap py-16 sm:py-28">
          <p className="kicker !text-ember">Churrascaria · retirada e entrega</p>
          <h1 id="hero-title" className="mt-3 max-w-2xl text-5xl leading-[1.05] sm:text-7xl">
            Da brasa para a sua mesa.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-cream/90">
            Monte o pedido com os adicionais do seu jeito, veja o total na hora e escolha retirar ou receber em casa.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <a href="#carnes" className="btn btn-primary">
              Ver cardápio
            </a>
            <OpenStatus />
          </div>
        </div>
      </section>

      <MenuBoard />

      <section id="horarios" aria-labelledby="horarios-title" className="border-t border-line bg-paper py-16">
        <div className="wrap grid gap-10 md:grid-cols-2">
          <div>
            <p className="kicker">Horários</p>
            <h2 id="horarios-title" className="mt-3 text-3xl">
              Quando estamos abertos
            </h2>
            <table className="mt-6 w-full max-w-md text-left">
              <caption className="sr-only">Horário de funcionamento (horário de Brasília)</caption>
              <tbody>
                {[2, 3, 4, 5, 6, 0, 1].map((day) => (
                  <tr key={day} className="border-b border-line">
                    <th scope="row" className="py-2.5 font-medium">
                      {days[day]}
                    </th>
                    <td className="py-2.5 text-right text-muted">
                      {(openingHours[day] ?? []).length === 0
                        ? "Fechado"
                        : openingHours[day]!.map(([start, end]) => `${formatTime(start)}–${formatTime(end)}`).join(" e ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <p className="kicker">Dúvidas</p>
            <h2 className="mt-3 text-3xl">Fale com a casa</h2>
            <p className="mt-4 text-muted">
              Em um site real, este botão abriria o WhatsApp do restaurante. Aqui ele mostra só uma prévia.
            </p>
            <div className="mt-6">
              <MessagePreview
                businessName="Sabor & Brasa"
                message="Olá, Sabor & Brasa! Vocês entregam no meu bairro?"
                triggerLabel="Prévia do WhatsApp"
              />
            </div>
            <p className="mt-6 flex items-start gap-2 text-sm text-muted">
              <MapPin aria-hidden className="mt-0.5 size-4 shrink-0 text-brick" />
              Restaurante fictício, sem endereço. Bairros de entrega são ilustrativos.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
