import type { Metadata } from "next";
import { MyRequests } from "@/components/my-requests";

export const metadata: Metadata = {
  title: "Minhas solicitações",
  description: "Acompanhe as solicitações de demonstração feitas neste navegador.",
};

export default function MyRequestsPage() {
  return (
    <div className="wrap py-12 sm:py-16">
      <p className="kicker">Acompanhamento</p>
      <h1 className="mt-3 text-4xl sm:text-5xl">Minhas solicitações</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Solicitações de demonstração guardadas só neste navegador. Em um site real, a confirmação viria da recepção; aqui
        você pode simulá-la.
      </p>
      <div className="mt-8">
        <MyRequests />
      </div>
    </div>
  );
}
