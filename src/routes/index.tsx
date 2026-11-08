import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import {
  Search,
  ShieldCheck,
  KeyRound,
  Store,
  Building,
  ArrowUpRight,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/site/PropertyCard";
import { BRAND, featuredQuery, propertiesQuery } from "@/lib/properties";
import heroImage from "@/assets/hero-sf.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Abbud Imóveis — Imóveis em Barra do Piraí/RJ" },
      {
        name: "description",
        content:
          "Encontre casas, apartamentos e imóveis comerciais para comprar ou alugar em Barra do Piraí/RJ. Atendimento com Paulo Renato. CRECI 3764.",
      },
      { property: "og:title", content: "Abbud Imóveis" },
      {
        property: "og:description",
        content:
          "Seu próximo imóvel em Barra do Piraí e região começa aqui.",
      },
    ],
  }),
  component: Index,
});

const WORDS = ["alugar", "comprar", "investir", "morar"];

function Index() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [w, setW] = useState(0);

  const { data: featured = [] } = useQuery(featuredQuery);
  const { data: all = [] } = useQuery(propertiesQuery());

  useEffect(() => {
    const t = setInterval(() => {
      setW((i) => (i + 1) % WORDS.length);
    }, 2200);

    return () => clearInterval(t);
  }, []);

  const count = (fn: (p: (typeof all)[number]) => boolean) =>
    all.filter(fn).length;

  const cats = [
    {
      label: "Apartamentos",
      icon: Building,
      type: "apartamento",
      n: count((p) => p.type === "apartamento"),
    },
    {
      label: "Lojas e salas",
      icon: Store,
      type: "comercial",
      n: count((p) => p.type === "comercial"),
    },
    {
      label: "Casas",
      icon: KeyRound,
      type: "casa",
      n: count((p) => p.type === "casa"),
    },
  ];

  const hoods = Array.from(
    new Set(all.map((p) => p.neighborhood).filter(Boolean)),
  );

  return (
    <main>
      {/* HERO PREMIUM */}
      <section className="relative isolate flex min-h-[650px] items-center overflow-hidden bg-[#090909] text-white md:min-h-[720px]">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{ backgroundImage: `url("${heroImage}")` }}
          role="img"
          aria-label="Imóvel em destaque da Abbud Imóveis"
        />

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black via-black/80 to-black/35" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-transparent to-black/20" />

        <div className="pointer-events-none absolute right-[-130px] top-[-130px] -z-10 size-[420px] rounded-full border border-[#d4a937]/20" />
        <div className="pointer-events-none absolute right-[-55px] top-[-55px] -z-10 size-[270px] rounded-full border border-[#d4a937]/15" />

        <div className="sf-container w-full py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="animate-rise mb-8 flex items-center gap-3">
              <span className="h-px w-12 bg-[#d4a937]" />
              <span className="text-xs font-semibold uppercase tracking-[0.28em] text-[#f2d57a]">
                {BRAND.creci} · {BRAND.address}
              </span>
            </div>

            <h1
              className="sf-serif animate-rise max-w-3xl text-5xl font-medium leading-[1.08] tracking-tight sm:text-6xl md:text-7xl lg:text-[82px]"
              style={{ animationDelay: ".1s" }}
            >
              O imóvel certo para você{" "}
              <span
                key={w}
                className="inline-block italic text-[#e5bd55]"
              >
                {WORDS[w]}
              </span>
              <span className="text-[#e5bd55]">.</span>
            </h1>

            <p
              className="animate-rise mt-7 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg"
              style={{ animationDelay: ".2s" }}
            >
              Encontre seu próximo endereço com confiança. Compra, venda e
              aluguel de imóveis em Barra do Piraí e região.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                navigate({
                  to: "/imoveis",
                  search: q ? { q } : {},
                });
              }}
              className="animate-rise mt-9 flex max-w-2xl flex-col gap-2 rounded-2xl border border-white/15 bg-white/95 p-2 shadow-2xl sm:flex-row sm:items-center sm:rounded-full"
              style={{ animationDelay: ".3s" }}
            >
              <div className="flex min-w-0 flex-1 items-center gap-3 px-4">
                <Search className="size-5 shrink-0 text-[#a98225]" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Digite um bairro, cidade ou imóvel..."
                  className="h-12 min-w-0 flex-1 bg-transparent text-sm text-[#171717] outline-none placeholder:text-[#77736b]"
                />
              </div>

              <Button
                type="submit"
                variant="gold"
                className="h-12 rounded-full px-8 font-semibold"
              >
                Buscar imóveis
                <ArrowUpRight className="ml-1 size-4" />
              </Button>
            </form>

            <div
              className="animate-rise mt-6 flex flex-wrap items-center gap-4"
              style={{ animationDelay: ".4s" }}
            >
              <Button
                asChild
                className="h-12 rounded-full border border-[#d4a937] bg-[#d4a937] px-6 font-semibold text-[#111] shadow-lg transition-all hover:-translate-y-1 hover:bg-[#edca6c]"
              >
                <a
                  href={`https://wa.me/${BRAND.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="mr-2 size-4" />
                  Fale com {BRAND.owner}
                </a>
              </Button>

              <Link
                to="/imoveis"
                className="inline-flex items-center gap-2 px-2 py-3 text-sm font-medium text-white/85 transition-colors hover:text-[#f2d57a]"
              >
                Explorar imóveis
                <ArrowUpRight className="size-4" />
              </Link>
            </div>

            <div
              className="animate-rise mt-12 flex flex-wrap gap-x-8 gap-y-4 border-t border-white/20 pt-6"
              style={{ animationDelay: ".5s" }}
            >
              <div>
                <p className="sf-serif text-3xl text-[#f2d57a]">
                  {all.length}
                </p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/60">
                  Imóveis cadastrados
                </p>
              </div>
              <div className="hidden h-12 w-px bg-white/20 sm:block" />
              <div>
                <p className="sf-serif text-3xl text-[#f2d57a]">
                  {hoods.length}
                </p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/60">
                  Bairros e regiões
                </p>
              </div>
              <div className="hidden h-12 w-px bg-white/20 sm:block" />
              <div>
                <p className="sf-serif text-3xl text-[#f2d57a]">100%</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/60">
                  Atenção personalizada
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />
      </section>

      {/* MARQUEE DE REGIÕES */}
      {hoods.length > 0 && (
        <div className="overflow-hidden border-b border-[#d4a937]/20 bg-[#101010] py-4">
          <div className="flex w-max animate-marquee gap-10 whitespace-nowrap sf-serif text-xl text-white/65">
            {[...hoods, ...hoods, ...hoods, ...hoods].map((h, i) => (
              <span key={i} className="flex items-center gap-10">
                {h}
                <span className="text-[#d4a937]">✦</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* CATEGORIAS */}
      <section className="sf-container py-16 md:py-20">
        <div className="mb-8">
          <p className="sf-eyebrow">Encontre o que procura</p>
          <h2 className="sf-serif mt-3 text-4xl text-[#171717] md:text-5xl">
            Explore por <span className="italic text-[#b68b2c]">categoria</span>
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {cats.map(({ label, icon: Icon, type, n }) => (
            <Link
              key={type}
              to="/imoveis"
              search={{ type }}
              className="group flex items-center justify-between rounded-2xl border border-[#e5ddce] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#d4a937] hover:shadow-xl"
            >
              <div className="flex items-center gap-4">
                <span className="grid size-12 place-items-center rounded-xl bg-[#f4eddd] text-[#a98225] transition-colors group-hover:bg-[#d4a937] group-hover:text-[#111]">
                  <Icon />
                </span>
                <div>
                  <p className="sf-serif text-2xl text-[#171717]">{label}</p>
                  <p className="text-sm text-[#77736b]">
                    {n} disponível{n === 1 ? "" : "is"}
                  </p>
                </div>
              </div>
              <ArrowUpRight className="text-[#a98225] transition-transform group-hover:rotate-45" />
            </Link>
          ))}
        </div>
      </section>

      {/* IMÓVEIS EM DESTAQUE */}
      <section className="bg-[#f1eadb] py-16 md:py-20">
        <div className="sf-container">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="sf-eyebrow">Oportunidades selecionadas</p>
              <h2 className="sf-serif mt-3 text-4xl text-[#171717] md:text-5xl">
                Imóveis em{" "}
                <span className="italic text-[#b68b2c]">destaque</span>
              </h2>
            </div>

            <Button
              asChild
              variant="outline"
              className="rounded-full border-[#b68b2c] bg-transparent text-[#171717] hover:bg-[#d4a937] hover:text-[#111]"
            >
              <Link to="/imoveis">
                Ver todos os imóveis
                <ArrowUpRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <div
                key={p.id}
                className="animate-rise"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <PropertyCard p={p} />
              </div>
            ))}
          </div>

          {featured.length === 0 && (
            <div className="mt-10 rounded-2xl border border-[#d4a937]/30 bg-white/70 px-6 py-12 text-center">
              <p className="sf-serif text-2xl text-[#171717]">
                Novas oportunidades em breve
              </p>
              <p className="mt-2 text-sm text-[#77736b]">
                Entre em contato para conhecer os imóveis disponíveis.
              </p>
              <Button
                asChild
                variant="gold"
                className="mt-5 rounded-full"
              >
                <a
                  href={`https://wa.me/${BRAND.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="mr-2 size-4" />
                  Falar com a imobiliária
                </a>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* ATENDIMENTO ABBUD IMÓVEIS */}
      <section className="sf-container py-16 md:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-[#101010] p-8 text-white shadow-2xl md:p-14">
          <div className="pointer-events-none absolute -right-12 -top-12 size-72 rounded-full border border-[#d4a937]/20" />
          <div className="pointer-events-none absolute -right-2 top-[-35px] size-52 rounded-full border border-[#d4a937]/15" />

          <ShieldCheck className="absolute right-8 top-8 size-24 text-[#d4a937]/15 md:right-14 md:top-12 md:size-40" />

          <div className="relative max-w-2xl">
            <p className="sf-eyebrow text-[#e5bd55]">Abbud Imóveis · CRECI 3764</p>
            <h2 className="sf-serif mt-4 text-4xl leading-tight md:text-5xl">
              Uma boa escolha começa com confiança.
              <span className="block italic text-[#e5bd55]">
                Conte com atendimento próximo.
              </span>
            </h2>

            <p className="mt-5 max-w-xl leading-relaxed text-white/65">
              Paulo Renato acompanha você na busca pelo imóvel ideal, com
              atenção às suas necessidades e clareza durante a negociação.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                variant="gold"
                className="rounded-full px-6"
              >
                <Link to="/contato">
                  Quero anunciar meu imóvel
                  <ArrowUpRight className="ml-1 size-4" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/25 bg-transparent text-white hover:border-[#d4a937] hover:bg-[#d4a937] hover:text-[#111]"
              >
                <a
                  href={`https://instagram.com/${BRAND.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  @{BRAND.instagram}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
