import Link from "next/link";

export default function NotFound() {
  return (
    <section className="wrap flex flex-col items-center py-24 text-center">
      <p className="kicker">Erro 404</p>
      <h1 className="mt-3 text-4xl font-bold">Página não encontrada</h1>
      <p className="mt-3 max-w-md text-muted">Este endereço não existe nesta demonstração.</p>
      <Link href="/" className="btn btn-primary mt-8">
        Voltar ao início
      </Link>
    </section>
  );
}
