import { Link } from "@tanstack/react-router";
import {
  BedDouble,
  Bath,
  Car,
  Maximize,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import { formatPrice, type Property } from "@/lib/properties";

export function PropertyCard({ p }: { p: Property }) {
  return (
    <Link
      to="/imoveis/$id"
      params={{ id: p.id }}
      className="group block overflow-hidden rounded-2xl border border-[#e5ddce] bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:border-[#d4a937] hover:shadow-2xl"
    >
      <div className="sf-card-media relative aspect-[4/3] overflow-hidden bg-[#eee8dc]">
        {p.images?.[0] ? (
          <img
            src={p.images[0]}
            alt={p.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="grid h-full place-items-center text-sm text-[#8b8374]">
            Foto em breve
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10 opacity-70 transition-opacity group-hover:opacity-100" />

        <span className="absolute left-4 top-4 rounded-full border border-[#f2d57a]/50 bg-[#d4a937] px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#171717] shadow-lg">
          {p.purpose === "aluguel" ? "Para alugar" : "À venda"}
        </span>

        <span className="absolute bottom-4 right-4 grid size-10 translate-y-2 place-items-center rounded-full bg-white text-[#171717] opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="size-5" />
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <p className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.12em] text-[#8b8374]">
          <MapPin className="size-3.5 text-[#b68b2c]" />
          {[p.neighborhood, p.city].filter(Boolean).join(", ")}
        </p>

        <h3 className="sf-serif mt-3 line-clamp-2 min-h-[3.5rem] text-2xl leading-tight text-[#171717] transition-colors group-hover:text-[#a98225]">
          {p.title}
        </h3>

        <div className="mt-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#8b8374]">
              {p.purpose === "aluguel" ? "Valor do aluguel" : "Valor do imóvel"}
            </p>
            <p className="mt-1 text-xl font-bold tracking-tight text-[#a98225]">
              {formatPrice(p)}
            </p>
          </div>
          <span className="mb-1 text-xs font-medium text-[#8b8374] transition-colors group-hover:text-[#a98225]">
            Ver detalhes
          </span>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 border-t border-[#eee8dc] pt-4 text-xs text-[#716b61]">
          <span className="flex items-center gap-1.5">
            <BedDouble className="size-4 text-[#b68b2c]" />
            {p.bedrooms ?? "—"}
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="size-4 text-[#b68b2c]" />
            {p.bathrooms ?? "—"}
          </span>
          <span className="flex items-center gap-1.5">
            <Car className="size-4 text-[#b68b2c]" />
            {p.parking ?? "—"}
          </span>
          <span className="flex items-center gap-1.5">
            <Maximize className="size-4 text-[#b68b2c]" />
            {p.area ? `${Number(p.area)} m²` : "—"}
          </span>
        </div>
      </div>
    </Link>
  );
}
