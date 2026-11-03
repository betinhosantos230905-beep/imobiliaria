import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BedDouble, Bath, Car, Maximize, MapPin, MessageCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/site/LeadForm";
import { BRAND, formatPrice, propertyQuery } from "@/lib/properties";

export const Route = createFileRoute("/imoveis/$id")({
  head: () => ({
    meta: [
      { title: "Detalhes do imóvel — SF Imóveis" },
      { name: "description", content: "Fotos, características e contato para este imóvel." },
      { property: "og:title", content: "Imóvel — SF Imóveis" },
      { property: "og:description", content: "Fotos, características e contato para este imóvel." },
    ],
  }),
  component: Detail,
});

function Detail() {
  const { id } = Route.useParams();
  const { data: p, isLoading } = useQuery(propertyQuery(id));
  const [idx, setIdx] = useState(0);

  if (isLoading) return <main className="mx-auto max-w-7xl px-5 py-20 text-muted-foreground">Carregando…</main>;
  if (!p) return <main className="mx-auto max-w-7xl px-5 py-20"><h1 className="text-4xl text-primary">Imóvel não encontrado</h1><Link to="/imoveis" className="mt-4 inline-block underline">Ver imóveis</Link></main>;

  const wa = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(`Olá! Tenho interesse no imóvel: ${p.title}`)}`;

  return (
    <main className="mx-auto max-w-7xl px-5 py-10">
      <Link to="/imoveis" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="size-4" /> Voltar</Link>
      <div className="mt-6 grid gap-3">
        <div className="aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
          {p.images[idx] && <img src={p.images[idx]} alt={p.title} className="h-full w-full object-cover animate-rise" key={idx} />}
        </div>
        {p.images.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {p.images.map((src, i) => (
              <button key={src + i} onClick={() => setIdx(i)}
                className={`h-20 w-28 shrink-0 overflow-hidden rounded-lg border-2 ${i === idx ? "border-gold" : "border-transparent opacity-70"}`}>
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
        <div>
          <p className="flex items-center gap-1 text-sm uppercase tracking-wider text-muted-foreground"><MapPin className="size-4" />{p.neighborhood}, {p.city}</p>
          <h1 className="mt-2 text-4xl text-primary md:text-5xl">{p.title}</h1>
          <p className="mt-3 text-3xl font-semibold">{formatPrice(p)}</p>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              [BedDouble, `${p.bedrooms} quartos`], [Bath, `${p.bathrooms} banheiros`],
              [Car, `${p.parking} vagas`], [Maximize, `${Number(p.area)} m²`],
            ].map(([Icon, t]) => {
              const I = Icon as typeof BedDouble;
              return <div key={t as string} className="rounded-xl bg-secondary p-4"><I className="size-5 text-gold" /><p className="mt-2 text-sm">{t as string}</p></div>;
            })}
          </div>
          <h2 className="mt-10 text-3xl text-primary">Sobre o imóvel</h2>
          <p className="mt-3 whitespace-pre-line leading-relaxed text-muted-foreground">{p.description}</p>
        </div>
        <aside className="h-fit rounded-2xl bg-card p-6 shadow-card lg:sticky lg:top-24">
          <h3 className="text-2xl text-primary">Agende uma visita</h3>
          <Button asChild className="mt-4 w-full"><a href={wa} target="_blank" rel="noreferrer"><MessageCircle /> Falar no WhatsApp</a></Button>
          <div className="my-5 text-center text-xs text-muted-foreground">ou envie uma mensagem</div>
          <LeadForm propertyId={p.id} defaultMessage={`Tenho interesse no imóvel "${p.title}".`} />
        </aside>
      </div>
    </main>
  );
}
