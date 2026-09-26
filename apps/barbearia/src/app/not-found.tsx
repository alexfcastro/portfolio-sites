import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap flex flex-col items-center py-24 text-center">
      <p className="kicker">Erro 404</p>
      <h1 className="mt-3 text-5xl font-bold">Página não encontrada</h1>
      <p className="mt-3 max-w-md text-smoke">Este endereço não existe nesta demonstração.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn btn-gold">
          Voltar ao início
        </Link>
        <Link href="/agendar" className="btn btn-line">
          Agendar horário
        </Link>
      </div>
    </section>
  );
}
