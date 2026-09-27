import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";

export const metadata: Metadata = { title: "Carrinho" };

export default function CartPage() {
  return (
    <div className="wrap py-10 sm:py-14">
      <p className="kicker">Pedido de demonstração</p>
      <h1 className="mt-2 text-5xl">Carrinho</h1>
      <div className="mt-8">
        <CartView />
      </div>
    </div>
  );
}
