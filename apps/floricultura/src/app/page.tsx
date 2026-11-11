import { CalendarHeart, Gift, PenLine, Truck } from "lucide-react";
import Link from "next/link";
import { Faixa } from "@/components/faixa";
import { FlowerArt } from "@/components/flower-art";
import { OccasionPicker } from "@/components/occasion-picker";
import { ProductCard } from "@/components/product-card";
import { faq, getProduct, products, storeHours } from "@/data/shop";

const steps = [
  { icon: Gift, title: "Escolha", text: "Buquê, arranjo, cesta ou planta, por ocasião." },
  { icon: PenLine, title: "Personalize", text: "Tamanho, adicionais e a mensagem do cartão." },
  { icon: CalendarHeart, title: "Data e período", text: "Entrega ou retirada, manhã ou tarde." },
  { icon: Truck, title: "Revise", text: "Resumo completo antes da prévia da mensagem." },
];

export default function HomePage() {
  const featured = products.filter((p) => p.featured);
  const hero = getProduct("buque-rosas-vermelhas")!;
  const heroSmall = getProduct("buque-campo")!;

  return (
    <>
      <section className="overflow-hidden">
        <div className="wrap grid items-center gap-10 py-12 md:grid-cols-[1.1fr_1fr] md:py-20">
          <div>
            <p className="kicker">Floricultura e presentes</p>
            <h1 className="mt-4 text-6xl leading-[1.02] sm:text-8xl">
              Flores que dizem <em className="text-rose">o que você sente</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              Escolha pela ocasião, personalize o tamanho e os adicionais, escreva o cartão e marque o dia. Você revisa
              tudo antes de pedir.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/catalogo" className="btn btn-primary">
                Escolher flores
              </Link>
              <Link href="#ocasioes" className="btn btn-secondary">
                Ver por ocasião
              </Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-md">
            <div className="parallax overflow-hidden rounded-t-full rounded-b-[2rem] border-4 border-paper shadow-xl">
              <FlowerArt art={hero.art} id={hero.id} sizes="(min-width: 768px) 448px, 90vw" preload className="h-auto w-full" />
            </div>
            <div className="parallax-inv absolute -bottom-6 -left-6 w-36 overflow-hidden rounded-full border-4 border-paper shadow-lg sm:w-44">
              <FlowerArt art={heroSmall.art} id={heroSmall.id} scene={1} sizes="176px" className="h-auto w-full" />
            </div>
          </div>
        </div>
      </section>

      <Faixa
        className="bg-rose font-display text-xl text-white"
        itens={["Aniversário", "Amor", "Maternidade", "Agradecimento", "Com cartão escrito por você"]}
      />

      <section id="ocasioes" aria-labelledby="ocasioes-title" className="border-b border-line bg-paper">
        <div className="wrap py-16">
          <p className="kicker">Ocasiões</p>
          <h2 id="ocasioes-title" className="mt-2 text-4xl sm:text-6xl">
            Qual é o momento?
          </h2>
          <p className="mt-3 max-w-xl text-muted">Escolha a ocasião e veja as flores que combinam com ela.</p>
          <OccasionPicker />
        </div>
      </section>

      <section aria-labelledby="destaques-title" className="wrap py-16">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="kicker">Destaques</p>
            <h2 id="destaques-title" className="mt-2 text-4xl">
              Os mais escolhidos
            </h2>
          </div>
          <Link href="/catalogo" className="inline-flex min-h-11 items-center text-rose underline underline-offset-4">
            Ver catálogo completo
          </Link>
        </div>
        <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {featured.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      </section>

      <section id="como-funciona" aria-labelledby="como-title" className="bg-sage-soft">
        <div className="wrap py-16">
          <h2 id="como-title" className="text-4xl">
            Como funciona
          </h2>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <li key={step.title} className="rounded-card bg-paper p-6">
                <span className="flex size-11 items-center justify-center rounded-full bg-rose-soft text-rose">
                  <step.icon aria-hidden className="size-5" />
                </span>
                <p className="mt-4 font-display text-2xl">
                  {index + 1}. {step.title}
                </p>
                <p className="mt-1 text-sm text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="wrap grid gap-10 py-16 md:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 id="faq-title" className="text-4xl">
            Perguntas frequentes
          </h2>
          <div className="mt-6 space-y-3">
            {faq.map((item) => (
              <details key={item.q} className="rounded-2xl border border-line bg-paper px-5 py-4">
                <summary className="cursor-pointer font-medium">{item.q}</summary>
                <p className="mt-2 text-muted">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-4xl">Horário</h2>
          <dl className="mt-6 space-y-2">
            {storeHours.map(([day, hours]) => (
              <div key={day} className="flex justify-between gap-4 border-b border-line pb-2">
                <dt className="font-medium">{day}</dt>
                <dd className="text-right text-muted">{hours}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-muted">Horários e bairros de exemplo. A loja é fictícia e não tem endereço.</p>
        </div>
      </section>
    </>
  );
}
