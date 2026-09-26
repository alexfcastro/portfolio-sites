import { MapPin } from "lucide-react";
import { MenuBoard } from "@/components/menu-board";
import { MessagePreview } from "@/components/message-preview";
import { OpenStatus } from "@/components/open-status";
import { openingHours } from "@/data/menu";
import { formatTime } from "@/lib/time";

const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export default function MenuPage() {
  return (
    <>
      <section aria-labelledby="hero-title" className="bg-coal text-cream">
        <div className="wrap py-12 sm:py-16">
          <p className="kicker !text-ember">Churrascaria · retirada e entrega</p>
          <h1 id="hero-title" className="mt-3 max-w-2xl text-4xl leading-tight sm:text-6xl">
            Da brasa para a sua mesa.
          </h1>
          <p className="mt-4 max-w-xl text-cream/80">
            Monte o pedido com os adicionais do seu jeito, veja o total na hora e escolha retirar ou receber em casa.
          </p>
          <div className="mt-6">
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
