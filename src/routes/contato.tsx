import { createFileRoute } from "@tanstack/react-router";
import { Phone, Instagram, MapPin, MessageCircle } from "lucide-react";
import { LeadForm } from "@/components/site/LeadForm";
import { BRAND } from "@/lib/properties";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — SF Imóveis" },
      { name: "description", content: "Fale com um corretor da SF Imóveis." },
      { property: "og:title", content: "Contato — SF Imóveis" },
      { property: "og:description", content: "Fale com um corretor da SF Imóveis." },
    ],
  }),
  component: Contato,
});

function Contato() {
  return (
    <main className="mx-auto grid max-w-6xl gap-12 px-5 py-16 md:grid-cols-2">
      <div>
        <h1 className="text-5xl text-primary">Vamos conversar?</h1>
        <p className="mt-4 text-muted-foreground">Envie sua mensagem e um corretor retorna no mesmo dia útil.</p>
        <ul className="mt-10 space-y-4">
          <li className="flex gap-3"><Phone className="text-gold" />{BRAND.phone}</li>
          <li className="flex gap-3"><MessageCircle className="text-gold" /><a href={`https://wa.me/${BRAND.whatsapp}`} target="_blank" rel="noreferrer">{BRAND.whatsappLabel}</a></li>
          <li className="flex gap-3"><Instagram className="text-gold" /><a href={`https://instagram.com/${BRAND.instagram}`} target="_blank" rel="noreferrer">@{BRAND.instagram}</a></li>
          <li className="flex gap-3"><MapPin className="text-gold" />{BRAND.address}</li>
        </ul>
      </div>
      <div className="rounded-2xl bg-card p-6 shadow-card"><LeadForm /></div>
    </main>
  );
}
