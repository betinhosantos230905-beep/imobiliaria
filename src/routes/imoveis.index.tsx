import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, Building2 } from "lucide-react";
import { useState } from "react";
import { PropertyCard } from "@/components/site/PropertyCard";
import { propertiesQuery, TYPES } from "@/lib/properties";

type SearchParams = {
  purpose?: string | undefined;
  type?: string | undefined;
  q?: string | undefined;
};

export const Route = createFileRoute("/imoveis/")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    purpose: typeof s["purpose"] === "string" ? s["purpose"] : undefined,
    type: typeof s["type"] === "string" ? s["type"] : undefined,
    q: typeof s["q"] === "string" ? s["q"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Imóveis à venda e para alugar — SF Imóveis" },
      { name: "description", content: "Veja todos os imóveis disponíveis: apartamentos, casas e lojas em Vassouras/RJ." },
      { property: "og:title", content: "Imóveis — SF Imóveis" },
      { property: "og:description", content: "Apartamentos, casas e lojas para aluguel e venda em Vassouras/RJ." },
    ],
  }),
  component: Listing,
});

function Listing() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/imoveis/" });
  const { data = [], isLoading } = useQuery(propertiesQuery(search));
  const [query, setQuery] = useState(search.q ?? "");

  const set = (k: keyof SearchParams, v: string) =>
    navigate({ search: (s) => ({ ...s, [k]: v || undefined }) });

  const activeFilters = [search.purpose, search.type, search.q].filter(Boolean).length;

  function submitSearch() {
    set("q", query.trim());
  }

  function clearFilters() {
    setQuery("");
    navigate({ search: {} });
  }

  return (
    <main className="min-h-screen bg-[#faf7f0]">
      <section className="relative overflow-hidden bg-[#090909] px-5 pb-16 pt-16 text-white sm:pb-20 sm:pt-20">
        <div className="pointer-events-none absolute -right-24 -top-32 size-96 rounded-full bg-[#d4a937]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/4 size-80 rounded-full bg-[#d4a937]/10 blur-3xl" />

        <div className="sf-container relative">
          <p className="sf-eyebrow text-[#e1bd62]">SF IMÓVEIS · VASSOURAS / RJ</p>
          <h1 className="sf-serif mt-5 max-w-3xl text-5xl leading-[1.08] sm:text-6xl lg:text-7xl">
            Encontre o lugar
            <br />
            <span className="text-[#e1bd62]">ideal para você.</span>
          </h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
            Explore nossa seleção de imóveis para venda e aluguel.
            Encontre novas possibilidades para morar ou investir.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.14em] text-white/55">
            <span className="flex items-center gap-2">
              <Building2 className="size-4 text-[#d4a937]" />
              Imóveis selecionados
            </span>
            <span className="text-[#d4a937]">✦</span>
            <span>Atendimento personalizado</span>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="sf-container">
          <div className="relative z-10 -mt-7 rounded-2xl border border-[#e5ddce] bg-white p-4 shadow-[0_18px_55px_rgba(0,0,0,0.10)] sm:-mt-9 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a98225]">
                  Busca inteligente
                </p>
                <h2 className="sf-serif mt-1 text-2xl text-[#171717]">
                  Qual imóvel você procura?
                </h2>
              </div>
              <SlidersHorizontal className="size-6 text-[#b68b2c]" />
            </div>

            <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr_auto]">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#a98225]" />
                <input
                  value={query}
                  placeholder="Bairro ou cidade"
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitSearch()}
                  onBlur={submitSearch}
                  className="h-12 w-full rounded-xl border border-[#e5ddce] bg-[#faf7f0] pl-11 pr-4 text-sm text-[#171717] outline-none transition focus:border-[#d4a937] focus:ring-2 focus:ring-[#d4a937]/15"
                />
              </div>

              <select
                value={search.purpose ?? ""}
                onChange={(e) => set("purpose", e.target.value)}
                className="h-12 rounded-xl border border-[#e5ddce] bg-[#faf7f0] px-4 text-sm text-[#39352e] outline-none transition focus:border-[#d4a937]"
              >
                <option value="">Venda e aluguel</option>
                <option value="venda">Venda</option>
                <option value="aluguel">Aluguel</option>
              </select>

              <select
                value={search.type ?? ""}
                onChange={(e) => set("type", e.target.value)}
                className="h-12 rounded-xl border border-[#e5ddce] bg-[#faf7f0] px-4 text-sm capitalize text-[#39352e] outline-none transition focus:border-[#d4a937]"
              >
                <option value="">Todos os tipos</option>
                {TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={submitSearch}
                className="h-12 rounded-xl bg-[#d4a937] px-7 text-xs font-bold uppercase tracking-[0.12em] text-[#171717] shadow-md transition hover:bg-[#e5c15d] hover:shadow-lg"
              >
                Buscar imóveis
              </button>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a98225]">
                Nossa seleção
              </p>
              <h2 className="sf-serif mt-2 text-3xl text-[#171717] sm:text-4xl">
                Imóveis disponíveis
              </h2>
              <p className="mt-2 text-sm text-[#81796c]">
                Opções para diferentes momentos e projetos de vida.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-[#e5ddce] bg-white px-4 py-2 text-xs text-[#716b61]">
              <span className="size-2 rounded-full bg-[#d4a937]" />
              {isLoading ? "Buscando..." : `${data.length} ${data.length === 1 ? "imóvel encontrado" : "imóveis encontrados"}`}
            </div>
          </div>

          {activeFilters > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="text-xs text-[#81796c]">
                {activeFilters} filtro(s) aplicado(s)
              </span>
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs font-semibold text-[#a98225] underline underline-offset-4 transition hover:text-[#171717]"
              >
                Limpar filtros
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="aspect-[4/5] animate-pulse rounded-2xl bg-[#eee8dc]" />
              ))}
            </div>
          ) : data.length > 0 ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.map((p) => <PropertyCard key={p.id} p={p} />)}
            </div>
          ) : (
            <div className="mt-8 rounded-2xl border border-[#e5ddce] bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-[#f5efdf]">
                <Search className="size-7 text-[#b68b2c]" />
              </div>
              <h3 className="sf-serif mt-5 text-2xl text-[#171717]">
                Nenhum imóvel encontrado
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#81796c]">
                Não encontramos imóveis com esses critérios. Experimente mudar
                os filtros ou limpar a busca para ver outras opções.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-full bg-[#d4a937] px-7 py-3 text-xs font-bold uppercase tracking-[0.12em] text-[#171717] transition hover:bg-[#e5c15d]"
              >
                Ver todos os imóveis
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
