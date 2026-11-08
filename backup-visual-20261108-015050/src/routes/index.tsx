import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Search, Scale, KeyRound, Store, Building, ArrowUpRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/site/PropertyCard";
import { BRAND, featuredQuery, propertiesQuery } from "@/lib/properties";
import logo from "@/assets/logo-sf-imoveis.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SF Imóveis — Aluguel e venda em Vassouras/RJ" },
      { name: "description", content: "Apartamentos, casas e lojas para alugar e comprar em Vassouras, com assessoria jurídica. CRECI J 7284." },
      { property: "og:title", content: "SF Imóveis e Assessoria Jurídica" },
      { property: "og:description", content: "Aluguel e venda de imóveis em Vassouras/RJ com segurança jurídica." },
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
    const t = setInterval(() => setW((i) => (i + 1) % WORDS.length), 2200);
    return () => clearInterval(t);
  }, []);

  const count = (fn: (p: (typeof all)[number]) => boolean) => all.filter(fn).length;
  const cats = [
    { label: "Apartamentos", icon: Building, type: "apartamento", n: count((p) => p.type === "apartamento") },
    { label: "Lojas e salas", icon: Store, type: "comercial", n: count((p) => p.type === "comercial") },
    { label: "Casas", icon: KeyRound, type: "casa", n: count((p) => p.type === "casa") },
  ];
  const photos = featured.slice(0, 3).map((p) => p.images[0]).filter(Boolean);
  const hoods = Array.from(new Set(all.map((p) => p.neighborhood).filter(Boolean)));

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="pointer-events-none absolute -right-32 -top-32 size-[28rem] rounded-full border border-gold/30" />
        <div className="pointer-events-none absolute -right-10 top-20 size-[18rem] rounded-full border border-gold/20" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 pb-20 pt-14 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:pt-20">
          <div>
            <div className="animate-rise flex items-center gap-3">
              <img src={logo} alt="" className="size-14 rounded-full ring-2 ring-gold/60" />
              <span className="text-xs uppercase tracking-[0.3em] text-gold">{BRAND.creci} · Vassouras/RJ</span>
            </div>
            <h1 className="animate-rise mt-8 text-5xl leading-[0.95] sm:text-6xl md:text-7xl" style={{ animationDelay: ".1s" }}>
              O imóvel certo para você{" "}
              <span key={w} className="animate-rise inline-block italic text-gold">{WORDS[w]}</span>
              <span className="text-gold">.</span>
            </h1>
            <p className="animate-rise mt-6 max-w-md text-lg text-primary-foreground/75" style={{ animationDelay: ".2s" }}>
              Aluguel, venda e assessoria jurídica — tudo resolvido com a Silvia, sem complicação.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); navigate({ to: "/imoveis", search: q ? { q } : {} }); }}
              className="animate-rise mt-8 flex max-w-lg gap-2 rounded-full bg-card p-1.5 text-foreground shadow-card" style={{ animationDelay: ".3s" }}>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Busque por bairro: Centro, Tambasco…"
                className="h-11 min-w-0 flex-1 rounded-full bg-transparent px-4 text-sm outline-none" />
              <Button type="submit" variant="gold" className="h-11 rounded-full px-5"><Search /><span className="hidden sm:inline">Buscar</span></Button>
            </form>
            <div className="animate-rise mt-6 flex flex-wrap gap-3" style={{ animationDelay: ".4s" }}>
              <Button asChild variant="glass" className="rounded-full">
                <a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle /> Chamar no WhatsApp</a>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto h-[360px] w-full max-w-md sm:h-[440px]">
            {photos.map((src, i) => (
              <div key={src} className="animate-rise absolute overflow-hidden rounded-2xl border-4 border-card shadow-card transition-transform duration-500 hover:z-10 hover:scale-105"
                style={{
                  animationDelay: `${0.3 + i * 0.15}s`,
                  width: i === 0 ? "62%" : "48%", aspectRatio: "3/4",
                  left: ["0%", "48%", "22%"][i], top: ["4%", "0%", "38%"][i],
                  rotate: ["-6deg", "5deg", "-1deg"][i], zIndex: [1, 2, 3][i],
                }}>
                <img src={src} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
            <div className="absolute bottom-2 right-0 z-10 rounded-2xl bg-gold px-5 py-3 text-gold-foreground shadow-card">
              <p className="font-display text-4xl leading-none">{all.length}</p>
              <p className="text-xs uppercase tracking-wider">imóveis disponíveis</p>
            </div>
          </div>
        </div>

        {/* marquee */}
        {hoods.length > 0 && (
          <div className="relative overflow-hidden border-t border-primary-foreground/10 py-4">
            <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-2xl text-primary-foreground/60">
              {[...hoods, ...hoods, ...hoods, ...hoods].map((h, i) => (
                <span key={i} className="flex items-center gap-10">{h}<span className="text-gold">✦</span></span>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto -mt-px max-w-7xl px-5 pt-14">
        <div className="grid gap-4 sm:grid-cols-3">
          {cats.map(({ label, icon: Icon, type, n }) => (
            <Link key={type} to="/imoveis" search={{ type }}
              className="group flex items-center justify-between rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:border-gold hover:shadow-card">
              <div className="flex items-center gap-4">
                <span className="grid size-12 place-items-center rounded-xl bg-secondary text-primary transition-colors group-hover:bg-gold group-hover:text-gold-foreground"><Icon /></span>
                <div><p className="font-display text-2xl text-primary">{label}</p><p className="text-sm text-muted-foreground">{n} disponíve{n === 1 ? "l" : "is"}</p></div>
              </div>
              <ArrowUpRight className="text-muted-foreground transition-transform group-hover:rotate-45 group-hover:text-gold" />
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-4xl text-primary md:text-5xl">Disponíveis <span className="italic text-gold">agora</span></h2>
          <Button asChild variant="outline" className="rounded-full"><Link to="/imoveis">Ver todos <ArrowUpRight /></Link></Button>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p, i) => (
            <div key={p.id} className="animate-rise" style={{ animationDelay: `${i * 0.08}s` }}><PropertyCard p={p} /></div>
          ))}
        </div>
      </section>

      {/* JURIDICO */}
      <section className="mx-auto max-w-7xl px-5">
        <div className="relative overflow-hidden rounded-3xl bg-gold p-10 text-gold-foreground md:p-14">
          <Scale className="absolute -right-6 -top-6 size-48 opacity-10" />
          <p className="text-xs uppercase tracking-[0.3em]">Diferencial</p>
          <h2 className="mt-3 max-w-2xl text-4xl md:text-5xl">Assessoria jurídica em cada negócio.</h2>
          <p className="mt-4 max-w-xl opacity-80">Contratos, documentação e análise do imóvel feitos por quem entende — você assina com tranquilidade.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="rounded-full"><Link to="/contato">Quero anunciar meu imóvel</Link></Button>
            <Button asChild variant="outline" className="rounded-full border-gold-foreground/30 bg-transparent"><a href={`https://instagram.com/${BRAND.instagram}`} target="_blank" rel="noreferrer">@{BRAND.instagram}</a></Button>
          </div>
        </div>
      </section>
    </main>
  );
}
