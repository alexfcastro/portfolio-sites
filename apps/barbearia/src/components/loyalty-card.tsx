import { Gift, Scissors } from "lucide-react";
import Link from "next/link";
import { loyalty } from "@/data/business";

/** Cartão fidelidade digital: 10 selos = uma barba de presente. */
export function LoyaltyCard({ stamps, rewardsAvailable }: { stamps: number; rewardsAvailable: number }) {
  const missing = loyalty.stampsForReward - stamps;
  return (
    <div className="rounded-card border border-gold/50 bg-gradient-to-br from-coal-3 to-coal-2 p-5 sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="kicker">Cartão fidelidade</p>
          <p className="mt-1 font-display text-2xl font-semibold uppercase">A cada 10 cortes, uma barba de presente</p>
        </div>
        <Gift aria-hidden className="size-7 shrink-0 text-gold" />
      </div>
      <ol
        aria-label={`${stamps} de ${loyalty.stampsForReward} selos`}
        className="mt-5 grid grid-cols-5 gap-2 sm:gap-3"
      >
        {Array.from({ length: loyalty.stampsForReward }, (_, index) => {
          const filled = index < stamps;
          return (
            <li
              key={index}
              aria-hidden
              className={`grid aspect-square place-items-center rounded-full border ${
                filled ? "border-gold bg-gold text-coal" : "border-dashed border-edge text-edge"
              }`}
            >
              {index === loyalty.stampsForReward - 1 ? <Gift className="size-5" /> : <Scissors className="size-4" />}
            </li>
          );
        })}
      </ol>
      {rewardsAvailable > 0 ? (
        <p className="mt-5 font-semibold text-ok">
          Barba liberada!{" "}
          <Link
            href={`/agendar?servico=${loyalty.rewardServiceId}`}
            className="text-gold underline underline-offset-4 hover:text-gold-bright"
          >
            Agendar a barba de presente
          </Link>
        </p>
      ) : (
        <p className="mt-5 text-sm text-smoke">
          <strong className="text-cream">{stamps} de {loyalty.stampsForReward} selos.</strong> Faltam {missing}{" "}
          {missing === 1 ? "corte" : "cortes"} para ganhar a barba. O selo entra quando o atendimento é concluído.
        </p>
      )}
    </div>
  );
}
