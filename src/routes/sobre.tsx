import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sobre")({
  head: () => ({
    meta: [
      { title: "Sobre a SF Imóveis" },
      { name: "description", content: "Conheça a história e o jeito de trabalhar da SF Imóveis." },
      { property: "og:title", content: "Sobre — SF Imóveis" },
      { property: "og:description", content: "Uma imobiliária boutique com atendimento próximo." },
    ],
  }),
  component: Sobre,
});

function Sobre() {
  return (
    <main className="mx-auto grid max-w-7xl gap-12 px-5 py-16 md:grid-cols-2 md:items-center">
      <img src="/images/interior-1.jpg" alt="Terraço com vista" loading="lazy" className="aspect-[4/5] w-full rounded-2xl object-cover" />
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-gold">Nossa história</p>
        <h1 className="mt-3 text-5xl text-primary">Imóveis e segurança jurídica no mesmo lugar.</h1>
        <p className="mt-6 leading-relaxed text-muted-foreground">
          A SF Imóveis, de Silvia Freire, une a intermediação de aluguel e venda à assessoria jurídica,
          para que cada contrato seja simples, transparente e seguro — em Vassouras e região.
        </p>
        <div className="mt-10 grid grid-cols-3 gap-6">
          {[["CRECI", "J 7284"], ["Jurídico", "assessoria própria"], ["Vassouras", "e região"]].map(([n, l]) => (
            <div key={l}><p className="font-display text-4xl text-primary">{n}</p><p className="text-sm text-muted-foreground">{l}</p></div>
          ))}
        </div>
      </div>
    </main>
  );
}
