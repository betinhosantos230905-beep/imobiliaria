import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BedDouble,
  Bath,
  Car,
  Maximize,
  MapPin,
  MessageCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Images,
} from "lucide-react";
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

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#faf7f0] px-5 py-24 text-center text-[#81796c]">
        Carregando imóvel...
      </main>
    );
  }

  if (!p) {
    return (
      <main className="min-h-screen bg-[#faf7f0] px-5 py-24 text-center">
        <h1 className="sf-serif text-4xl text-[#171717]">Imóvel não encontrado</h1>
        <p className="mt-3 text-sm text-[#81796c]">
          Este imóvel pode não estar mais disponível.
        </p>
        <Link
          to="/imoveis"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#d4a937] px-6 py-3 text-sm font-semibold text-[#171717]"
        >
          <ArrowLeft className="size-4" />
          Ver outros imóveis
        </Link>
      </main>
    );
  }

  const images = p.images ?? [];
  const wa = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(`Olá! Tenho interesse no imóvel: ${p.title}`)}`;

  const features: { icon: LucideIcon; label: string }[] = [
    { icon: BedDouble, label: `${p.bedrooms ?? "—"} quartos` },
    { icon: Bath, label: `${p.bathrooms ?? "—"} banheiros` },
    { icon: Car, label: `${p.parking ?? "—"} vagas` },
    { icon: Maximize, label: p.area ? `${Number(p.area)} m²` : "Área não informada" },
  ];

  function previousImage() {
    setIdx((current) => (current - 1 + images.length) % images.length);
  }

  function nextImage() {
    setIdx((current) => (current + 1) % images.length);
  }

  return (
    <main className="min-h-screen bg-[#faf7f0] pb-20">
      <div className="bg-[#090909] px-5 py-5 text-white">
        <div className="sf-container">
          <Link
            to="/imoveis"
            className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.13em] text-white/65 transition hover:text-[#e1bd62]"
          >
            <ArrowLeft className="size-4" />
            Voltar aos imóveis
          </Link>
        </div>
      </div>

      <section className="px-5 pt-7 sm:pt-10">
        <div className="sf-container">
          <div className="relative overflow-hidden rounded-2xl bg-[#e9e1d2] shadow-[0_18px_55px_rgba(0,0,0,0.12)]">
            <div className="relative aspect-[4/3] sm:aspect-[16/8] lg:aspect-[16/7]">
              {images.length > 0 ? (
                <img
                  src={images[idx]}
                  alt={`${p.title} - foto ${idx + 1}`}
                  className="h-full w-full object-cover transition-opacity duration-300"
                  key={idx}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-[#8b8374]">
                  <Images className="size-12" />
                  <span className="text-sm">Fotos em breve</span>
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />

              <span className="absolute left-4 top-4 rounded-full bg-[#d4a937] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#171717] shadow-lg sm:left-6 sm:top-6">
                {p.purpose === "aluguel" ? "Para alugar" : "À venda"}
              </span>

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={previousImage}
                    aria-label="Foto anterior"
                    className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-[#d4a937] hover:text-[#171717] sm:left-5 sm:size-12"
                  >
                    <ChevronLeft className="size-6" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    aria-label="Próxima foto"
                    className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/55 text-white backdrop-blur transition hover:bg-[#d4a937] hover:text-[#171717] sm:right-5 sm:size-12"
                  >
                    <ChevronRight className="size-6" />
                  </button>
                  <span className="absolute bottom-4 right-4 rounded-full bg-black/60 px-4 py-2 text-xs font-medium text-white backdrop-blur">
                    {idx + 1} / {images.length}
                  </span>
                </>
              )}
            </div>
          </div>

          {images.length > 1 && (
            <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-label={`Ver foto ${i + 1}`}
                  aria-pressed={i === idx}
                  className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-24 sm:w-36 ${
                    i === idx
                      ? "border-[#d4a937] opacity-100 shadow-md"
                      : "border-transparent opacity-65 hover:opacity-100"
                  }`}
                >
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="px-5 pt-9 sm:pt-12">
        <div className="sf-container grid items-start gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium uppercase tracking-[0.12em] text-[#8b8374]">
              <MapPin className="size-4 text-[#b68b2c]" />
              {[p.neighborhood, p.city].filter(Boolean).join(", ")}
            </div>

            <h1 className="sf-serif mt-4 max-w-3xl text-4xl leading-tight text-[#171717] sm:text-5xl lg:text-6xl">
              {p.title}
            </h1>

            <div className="mt-6 inline-block border-l-[3px] border-[#d4a937] pl-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#8b8374]">
                {p.purpose === "aluguel" ? "Valor do aluguel" : "Valor do imóvel"}
              </p>
              <p className="sf-serif mt-1 text-3xl font-semibold text-[#a98225] sm:text-4xl">
                {formatPrice(p)}
              </p>
            </div>

            <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {features.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="rounded-xl border border-[#e5ddce] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-[#d4a937]"
                >
                  <Icon className="size-5 text-[#b68b2c]" />
                  <p className="mt-3 text-sm font-semibold text-[#39352e]">{label}</p>
                </div>
              ))}
            </div>

            <div className="mt-12 border-t border-[#e5ddce] pt-9">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a98225]">
                Conheça melhor
              </p>
              <h2 className="sf-serif mt-2 text-3xl text-[#171717] sm:text-4xl">
                Sobre o imóvel
              </h2>
              <p className="mt-5 whitespace-pre-line text-sm leading-8 text-[#716b61] sm:text-base">
                {p.description || "Entre em contato para saber mais detalhes sobre este imóvel."}
              </p>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-[#e5ddce] bg-white p-5 shadow-[0_15px_45px_rgba(0,0,0,0.08)] sm:p-7 lg:sticky lg:top-24">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#a98225]">
              Atendimento SF Imóveis
            </p>
            <h2 className="sf-serif mt-3 text-3xl leading-tight text-[#171717]">
              Gostou deste imóvel?
            </h2>
            <p className="mt-3 text-sm leading-6 text-[#81796c]">
              Converse com nossa equipe e tire suas dúvidas ou agende uma visita.
            </p>

            <Button
              asChild
              className="mt-6 h-12 w-full rounded-xl bg-[#d4a937] font-bold text-[#171717] shadow-md transition hover:bg-[#e5c15d]"
            >
              <a href={wa} target="_blank" rel="noreferrer">
                <MessageCircle className="mr-2 size-5" />
                Falar no WhatsApp
              </a>
            </Button>

            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#eee8dc]" />
              <span className="text-[10px] uppercase tracking-[0.13em] text-[#a39a8a]">
                ou envie uma mensagem
              </span>
              <div className="h-px flex-1 bg-[#eee8dc]" />
            </div>

            <LeadForm
              propertyId={p.id}
              defaultMessage={`Tenho interesse no imóvel "${p.title}".`}
            />
          </aside>
        </div>
      </section>
    </main>
  );
}
