import { Link } from "@tanstack/react-router";
import { BedDouble, Bath, Car, Maximize, MapPin } from "lucide-react";
import { formatPrice, type Property } from "@/lib/properties";

export function PropertyCard({ p }: { p: Property }) {
  return (
    <Link to="/imoveis/$id" params={{ id: p.id }}
      className="group block overflow-hidden rounded-xl bg-card shadow-card transition-transform hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {p.images[0] && (
          <img src={p.images[0]} alt={p.title} loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-gold px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold-foreground">
          {p.purpose === "aluguel" ? "Aluguel" : "Venda"}
        </span>
      </div>
      <div className="p-5">
        <p className="flex items-center gap-1 text-xs uppercase tracking-wider text-muted-foreground">
          <MapPin className="size-3" /> {p.neighborhood}, {p.city}
        </p>
        <h3 className="mt-1 text-2xl leading-tight text-primary">{p.title}</h3>
        <p className="mt-2 text-lg font-semibold">{formatPrice(p)}</p>
        <div className="mt-4 flex flex-wrap gap-4 border-t pt-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><BedDouble className="size-4" />{p.bedrooms}</span>
          <span className="flex items-center gap-1"><Bath className="size-4" />{p.bathrooms}</span>
          <span className="flex items-center gap-1"><Car className="size-4" />{p.parking}</span>
          <span className="flex items-center gap-1"><Maximize className="size-4" />{Number(p.area)} m²</span>
        </div>
      </div>
    </Link>
  );
}
