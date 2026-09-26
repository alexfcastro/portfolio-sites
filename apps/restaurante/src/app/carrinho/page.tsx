import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = {
  title: "Carrinho",
  description: "Revise os itens, escolha retirada ou entrega e gere um pedido de demonstração.",
};

export default function CartPage() {
  return (
    <div className="wrap py-12 sm:py-16">
      <p className="kicker">Seu pedido</p>
      <h1 className="mt-3 text-4xl sm:text-5xl">Carrinho</h1>
      <div className="mt-8">
        <CartView />
      </div>
    </div>
  );
}
