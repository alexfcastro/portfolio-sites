import type { Metadata } from "next";
import { Suspense } from "react";
import { Checkout, CheckoutWithParams } from "@/components/loja/checkout";

export const metadata: Metadata = {
  title: "Sacola",
  description: "Sacola da loja de demonstração: escolha onde retirar e como pagar. Nada é vendido de verdade.",
};

export default function CartPage() {
  return (
    <div className="wrap py-12 sm:py-16">
      <p className="kicker">Loja Bravus</p>
      <h1 className="mt-3 text-5xl font-bold sm:text-6xl">Sua sacola</h1>
      <div className="mt-10">
        <Suspense fallback={<Checkout />}>
          <CheckoutWithParams />
        </Suspense>
      </div>
    </div>
  );
}
