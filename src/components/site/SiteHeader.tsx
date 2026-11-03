import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { BRAND } from "@/lib/properties";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo-sf-imoveis.jpg";

const links = [
  { to: "/", label: "Início" },
  { to: "/imoveis", label: "Imóveis" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="SF Imóveis" className="size-11 rounded-full" />
          <span className="leading-none"><span className="font-display text-2xl font-semibold text-primary">SF Imóveis</span>
          <span className="block text-[10px] uppercase tracking-[0.2em] text-gold">e Assessoria Jurídica</span></span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} activeOptions={{ exact: l.to === "/" }}
              className="text-sm text-muted-foreground transition-colors hover:text-primary data-[status=active]:text-primary data-[status=active]:font-semibold">
              {l.label}
            </Link>
          ))}
          <Button asChild variant="gold" size="sm"><Link to="/admin">Área do cliente</Link></Button>
        </nav>
        <button className="md:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t bg-background px-5 py-4 md:hidden">
          {links.map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-2 text-lg font-display">
              {l.label}
            </Link>
          ))}
          <Button asChild variant="gold" className="mt-2"><Link to="/admin" onClick={() => setOpen(false)}>Área do cliente</Link></Button>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-3xl">{BRAND.full}</p>
          <p className="mt-3 text-sm text-primary-foreground/70">Aluguel, venda e assessoria jurídica em Vassouras e região.</p>
        </div>
        <div className="text-sm text-primary-foreground/80 space-y-1">
          <p className="text-gold uppercase tracking-widest text-xs mb-3">Contato</p>
          <p>{BRAND.phone}</p><p>WhatsApp {BRAND.whatsappLabel}</p><p><a href={`https://instagram.com/${BRAND.instagram}`} target="_blank" rel="noreferrer">@{BRAND.instagram}</a></p><p>{BRAND.address}</p>
        </div>
        <div className="text-sm text-primary-foreground/80 space-y-1">
          <p className="text-gold uppercase tracking-widest text-xs mb-3">Navegue</p>
          <p><Link to="/imoveis">Imóveis</Link></p><p><Link to="/sobre">Sobre</Link></p><p><Link to="/contato">Contato</Link></p>
        </div>
      </div>
      <p className="border-t border-primary-foreground/10 py-5 text-center text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} {BRAND.full} · {BRAND.creci}
      </p>
    </footer>
  );
}
