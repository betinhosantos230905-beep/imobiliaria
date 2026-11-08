import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { PropertyCard } from "@/components/site/PropertyCard";
import { propertiesQuery, TYPES } from "@/lib/properties";

type Search = { purpose?: string | undefined; type?: string | undefined; q?: string | undefined };

export const Route = createFileRoute("/imoveis/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
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
  const set = (k: keyof Search, v: string) => navigate({ search: (s) => ({ ...s, [k]: v || undefined }) });

  return (
    <main className="mx-auto max-w-7xl px-5 py-14">
      <h1 className="text-5xl text-primary">Imóveis</h1>
      <div className="mt-8 grid gap-3 rounded-xl bg-card p-4 shadow-card sm:grid-cols-3">
        <input defaultValue={search.q} placeholder="Buscar bairro ou cidade"
          onKeyDown={(e) => e.key === "Enter" && set("q", (e.target as HTMLInputElement).value)}
          onBlur={(e) => set("q", e.target.value)}
          className="h-11 rounded-md border bg-background px-3 text-sm" />
        <select value={search.purpose ?? ""} onChange={(e) => set("purpose", e.target.value)} className="h-11 rounded-md border bg-background px-3 text-sm">
          <option value="">Venda e aluguel</option><option value="venda">Venda</option><option value="aluguel">Aluguel</option>
        </select>
        <select value={search.type ?? ""} onChange={(e) => set("type", e.target.value)} className="h-11 rounded-md border bg-background px-3 text-sm capitalize">
          <option value="">Todos os tipos</option>
          {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">{isLoading ? "Carregando…" : `${data.length} imóvel(is) encontrado(s)`}</p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((p) => <PropertyCard key={p.id} p={p} />)}
      </div>
    </main>
  );
}
