import { CalendarCheck, QrCode, Scissors } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Foto, temFoto } from "@/components/foto";
import { Storefront } from "@/components/loja/storefront";
import { PIX_DISCOUNT_PCT } from "@/data/loja";

export const metadata: Metadata = {
  title: "Loja",
  description:
    "Loja de demonstração da Bravus: pomadas, shampoos e cuidados com a barba para retirar no seu horário. Produtos fictícios.",
};

export default function StorePage() {
  return (
    <>
      <section aria-labelledby="loja-title" className="relative isolate overflow-hidden border-b border-edge">
        {temFoto("loja-hero") && (
          <Foto id="loja-hero" preload sizes="100vw" className="fundo absolute inset-0 -z-20 size-full object-cover object-right" />
        )}
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-coal via-coal/90 to-coal/40 max-md:to-coal/80" />
        <div className="wrap py-14 sm:py-20">
          <p className="kicker">Loja Bravus</p>
          <h1 id="loja-title" className="mt-3 max-w-2xl text-5xl font-bold sm:text-6xl">
            Compre aqui, retire no seu horário
          </h1>
          <p className="mt-4 max-w-xl text-lg text-smoke">
            Os produtos que a gente usa na cadeira, para manter o corte e a barba em casa. Você escolhe, paga por Pix ou na
            retirada e leva quando vier cortar.
          </p>
          <ul className="mt-8 grid max-w-3xl gap-3 sm:grid-cols-3">
            {[
              { icon: Scissors, text: "Separado pelo seu barbeiro" },
              { icon: CalendarCheck, text: "Retira no horário ou no balcão" },
              { icon: QrCode, text: `${PIX_DISCOUNT_PCT}% de desconto no Pix` },
            ].map(({ icon: Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-2 rounded-lg border border-edge bg-coal/80 px-4 py-3 text-sm font-semibold"
              >
                <Icon aria-hidden className="size-4 shrink-0 text-gold" />
                {text}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-smoke">
            Produtos, marca e preços fictícios: nada é vendido de verdade.{" "}
            <Link href="/loja/sacola" className="font-semibold text-gold underline underline-offset-4">
              Ver sacola
            </Link>
          </p>
        </div>
      </section>
      <div className="wrap py-12 sm:py-16">
        <h2 className="sr-only">Produtos</h2>
        <Storefront />
      </div>
    </>
  );
}
