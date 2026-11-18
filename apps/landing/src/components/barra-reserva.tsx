import { Vagas } from "@/components/reserva-curso";

/** Botão de reserva fixo no rodapé do celular, com as vagas que restam. No computador, some. */
export function BarraReserva() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--lp-line)] bg-[var(--lp-bg)]/95 px-4 py-3 backdrop-blur md:hidden">
      <div className="flex items-center justify-between gap-3">
        <p className="lp-muted text-xs leading-tight">
          <Vagas />
        </p>
        <a href="#reserva" className="btn lp-btn shrink-0 !min-h-11 !px-5">
          Reservar vaga
        </a>
      </div>
    </div>
  );
}
