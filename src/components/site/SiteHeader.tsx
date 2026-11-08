import { Link } from "@tanstack/react-router";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { BRAND } from "@/lib/properties";
import { Button } from "@/components/ui/button";

const links = [
  { to: "/", label: "Início" },
  { to: "/imoveis", label: "Imóveis" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sf-header">
      <div className="sf-container flex h-[76px] items-center justify-between gap-4">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <span className="grid size-12 place-items-center rounded-full border border-[#d4a937] bg-[#17130c] shadow-lg">
            <span className="sf-serif text-xl font-bold text-[#d9bd7b]">A</span>
          </span>
          <span className="leading-tight">
            <span className="sf-serif block text-2xl font-semibold tracking-wide text-white">
              Abbud <span className="sf-gold-text">Imóveis</span>
            </span>
            <span className="mt-1 block text-[9px] uppercase tracking-[0.22em] text-[#d9c99d]">
              Paulo Renato · Corretor
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              activeOptions={{ exact: link.to === "/" }}
              className="sf-nav-link"
            >
              {link.label}
            </Link>
          ))}
          <Button
            asChild
            variant="gold"
            size="sm"
            className="rounded-full px-5 font-semibold shadow-lg transition-transform hover:-translate-y-0.5"
          >
            <Link to="/admin">
              Área Administrativa
              <ArrowUpRight className="ml-1 size-4" />
            </Link>
          </Button>
        </nav>

        <button
          type="button"
          className="grid size-11 place-items-center rounded-xl border border-[#d4a937]/40 text-[#f2d57a] transition-colors hover:bg-[#d4a937]/10 md:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-[#d4a937]/20 bg-[#101010] px-5 py-5 shadow-2xl md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                activeOptions={{ exact: link.to === "/" }}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 font-medium text-[#eee8d9] transition-colors hover:bg-[#d4a937]/10 hover:text-[#f2d57a]"
              >
                {link.label}
              </Link>
            ))}
            <Button asChild variant="gold" className="mt-3 w-full rounded-full">
              <Link to="/admin" onClick={() => setOpen(false)}>
                Área Administrativa
                <ArrowUpRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-0 border-t border-[#d4a937]/20 bg-[#090909] text-[#f3efe4]">
      <div className="sf-container grid gap-10 py-14 md:grid-cols-3">
        <div>
          <p className="sf-serif text-3xl font-semibold">
            Abbud <span className="sf-gold-text">Imóveis</span>
          </p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/60">
            Compra, venda e aluguel de imóveis em Barra do Piraí e região.
          </p>
          <p className="mt-4 text-xs tracking-wider text-[#d4a937]">
            {BRAND.creci}
          </p>
          <p className="mt-2 text-sm text-white/70">{BRAND.owner}</p>
        </div>

        <div className="space-y-2 text-sm text-white/70">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#d4a937]">
            Contato
          </p>
          <p>WhatsApp {BRAND.whatsappLabel}</p>
          <p>
            <a
              href={`https://instagram.com/${BRAND.instagram}`}
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-[#f2d57a]"
            >
              @{BRAND.instagram}
            </a>
          </p>
          <p>{BRAND.address}</p>
        </div>

        <div className="space-y-3 text-sm text-white/70">
          <p className="mb-4 text-xs uppercase tracking-[0.25em] text-[#d4a937]">
            Navegue
          </p>
          <p><Link to="/imoveis" className="hover:text-[#f2d57a]">Imóveis</Link></p>
          <p><Link to="/sobre" className="hover:text-[#f2d57a]">Sobre</Link></p>
          <p><Link to="/contato" className="hover:text-[#f2d57a]">Contato</Link></p>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/40">
        © {new Date().getFullYear()} {BRAND.full} · {BRAND.creci}
      </div>
    </footer>
  );
}
