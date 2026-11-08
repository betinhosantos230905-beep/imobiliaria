import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, ShieldCheck, MapPin } from "lucide-react";
import { BRAND } from "@/lib/properties";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre a Abbud Imóveis" },
      {
        name: "description",
        content: "Conheça a Abbud Imóveis e o atendimento de Paulo Renato em Barra do Piraí/RJ.",
      },
      { property: "og:title", content: "Sobre — Abbud Imóveis" },
      {
        property: "og:description",
        content: "Atendimento próximo para comprar, vender ou alugar imóveis.",
      },
    ],
  }),
  component: Sobre,
});

function Sobre() {
  return (
    <main className="min-h-screen bg-[#faf7f0]">
      <section className="relative overflow-hidden bg-[#090909] px-5 py-20 text-white sm:py-28">
        <div className="absolute -right-24 -top-32 size-96 rounded-full border border-[#d4a937]/15" />
        <div className="absolute -right-10 -top-16 size-64 rounded-full border border-[#d4a937]/20" />

        <div className="sf-container relative">
          <p className="sf-eyebrow text-[#e1bd62]">Conheça a Abbud Imóveis</p>
          <h1 className="sf-serif mt-5 max-w-3xl text-5xl leading-[1.08] sm:text-6xl lg:text-7xl">
            Mais que imóveis,
            <span className="block text-[#e1bd62]">confiança em cada escolha.</span>
          </h1>
          <p className="mt-7 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
            Atendimento próximo e acompanhamento em cada etapa para quem deseja
            comprar, vender ou alugar um imóvel.
          </p>
        </div>
      </section>

      <section className="px-5 py-16 sm:py-24">
        <div className="sf-container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative">
            <div className="absolute -bottom-5 -left-5 h-2/3 w-2/3 rounded-2xl border border-[#d4a937]/50" />
            <div className="relative overflow-hidden rounded-2xl bg-[#e9e1d2] shadow-2xl">
              <img
                src="/images/interior-1.jpg"
                alt="Ambiente elegante de imóvel"
                loading="lazy"
                className="aspect-[4/5] w-full object-cover transition duration-700 hover:scale-105"
              />
            </div>
            <div className="absolute -bottom-4 right-4 rounded-xl bg-[#d4a937] px-5 py-4 text-[#171717] shadow-xl sm:right-7">
              <p className="sf-serif text-3xl">3764</p>
              <p className="text-[9px] font-bold uppercase tracking-[0.15em]">Registro CRECI</p>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#a98225]">
              Nossa atuação
            </p>
            <h2 className="sf-serif mt-4 text-4xl leading-tight text-[#171717] sm:text-5xl">
              O imóvel certo começa com uma boa conversa.
            </h2>
            <div className="mt-6 h-[2px] w-16 bg-[#d4a937]" />
            <p className="mt-7 text-sm leading-8 text-[#716b61] sm:text-base">
              À frente da Abbud Imóveis, Paulo Renato oferece atendimento próximo
              e acompanhamento em cada etapa da negociação. O objetivo é entender
              o que você procura e ajudar a encontrar o imóvel que faz sentido
              para o seu momento.
            </p>
            <p className="mt-5 text-sm leading-8 text-[#716b61] sm:text-base">
              Seja para comprar, vender ou alugar, conte com um atendimento claro,
              responsável e direto, com atenção às suas necessidades.
            </p>

            <div className="mt-9 grid gap-4 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl border border-[#e5ddce] bg-white p-4">
                <ShieldCheck className="mt-1 size-5 shrink-0 text-[#b68b2c]" />
                <div>
                  <p className="text-sm font-semibold text-[#25221d]">Transparência</p>
                  <p className="mt-1 text-xs leading-5 text-[#81796c]">
                    Clareza e cuidado em cada negociação.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-[#e5ddce] bg-white p-4">
                <MapPin className="mt-1 size-5 shrink-0 text-[#b68b2c]" />
                <div>
                  <p className="text-sm font-semibold text-[#25221d]">Atendimento próximo</p>
                  <p className="mt-1 text-xs leading-5 text-[#81796c]">
                    Presença e atenção em cada etapa.
                  </p>
                </div>
              </div>
            </div>

            <Link
              to="/contato"
              className="sf-btn sf-btn-gold mt-9 inline-flex items-center gap-2"
            >
              Fale com Paulo Renato
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-[#e5ddce] bg-white px-5 py-12 sm:py-16">
        <div className="sf-container grid gap-8 sm:grid-cols-3">
          <div className="text-center">
            <p className="sf-serif text-4xl text-[#a98225]">3764</p>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#81796c]">
              CRECI
            </p>
          </div>
          <div className="border-y border-[#eee8dc] py-7 text-center sm:border-x sm:border-y-0 sm:py-0">
            <p className="sf-serif mt-3 text-2xl text-[#171717]">{BRAND.owner}</p>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#81796c]">
              Corretor responsável
            </p>
          </div>
          <div className="text-center">
            <MapPin className="mx-auto size-7 text-[#b68b2c]" />
            <p className="sf-serif mt-3 text-2xl text-[#171717]">Barra do Piraí</p>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#81796c]">
              Rio de Janeiro
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
