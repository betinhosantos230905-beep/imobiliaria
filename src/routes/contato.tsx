import { createFileRoute } from "@tanstack/react-router";
import {
  Phone,
  Instagram,
  MapPin,
  MessageCircle,
  ArrowUpRight,
  Clock3,
  ShieldCheck,
} from "lucide-react";
import { LeadForm } from "@/components/site/LeadForm";
import { BRAND } from "@/lib/properties";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Contato — Abbud Imóveis" },
      { name: "description", content: "Entre em contato com a Abbud Imóveis e encontre seu próximo imóvel em Barra do Piraí/RJ." },
      { property: "og:title", content: "Contato — Abbud Imóveis" },
      { property: "og:description", content: "Estamos prontos para ajudar você a encontrar seu próximo imóvel." },
    ],
  }),
  component: Contato,
});

function Contato() {
  return (
    <main className="sf-public-theme overflow-hidden bg-[#f7f3e9]">
      <section className="relative overflow-hidden bg-[#11100e] text-[#f8f4e9]">
        <div className="pointer-events-none absolute -right-32 -top-40 h-[440px] w-[440px] rounded-full border border-[#c6a45b]/15" />
        <div className="pointer-events-none absolute -right-16 -top-24 h-[310px] w-[310px] rounded-full border border-[#c6a45b]/20" />
        <div className="pointer-events-none absolute bottom-[-180px] left-[35%] h-[360px] w-[360px] rounded-full bg-[#c6a45b]/[0.07] blur-3xl" />

        <div className="sf-container relative grid gap-12 py-16 md:grid-cols-[1fr_0.8fr] md:items-end md:py-24">
          <div className="max-w-2xl">
            <p className="sf-eyebrow text-[#d9bd7b]">ABBUD IMÓVEIS · ATENDIMENTO</p>
            <h1 className="sf-serif mt-6 text-5xl leading-[1.08] tracking-tight text-[#f8f4e9] sm:text-6xl lg:text-7xl">
              Boas escolhas
              <br />
              começam com uma
              <br />
              <span className="sf-gold-text italic">conversa.</span>
            </h1>
            <p className="mt-7 max-w-lg text-base leading-8 text-white/65 sm:text-lg">
              Estamos aqui para ouvir seus planos, esclarecer suas dúvidas e
              ajudar você a encontrar o imóvel certo, com atenção em cada detalhe.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${BRAND.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="sf-btn sf-btn-gold"
              >
                <MessageCircle size={18} />
                Conversar pelo WhatsApp
                <ArrowUpRight size={16} />
              </a>
              <a href="#formulario" className="sf-btn sf-btn-outline">
                Enviar uma mensagem
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1">
            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-sm">
              <div className="mb-4 grid size-11 place-items-center rounded-full bg-[#c6a45b]/15 text-[#d9bd7b]">
                <ShieldCheck size={21} />
              </div>
              <p className="sf-serif text-2xl text-[#e3c77f]">Atendimento próximo</p>
              <p className="mt-2 text-sm leading-6 text-white/55">
                Orientação atenciosa para você tomar decisões com mais tranquilidade.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-sm">
              <div className="mb-4 grid size-11 place-items-center rounded-full bg-[#c6a45b]/15 text-[#d9bd7b]">
                <Clock3 size={21} />
              </div>
              <p className="sf-serif text-2xl text-[#e3c77f]">Vamos conversar</p>
              <p className="mt-2 text-sm leading-6 text-white/55">
                Conte o que você procura. Nossa equipe entrará em contato.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="sf-container grid gap-12 py-14 md:grid-cols-[0.82fr_1.18fr] md:gap-16 md:py-20">
        <div>
          <p className="sf-eyebrow">FALE COM A GENTE</p>
          <h2 className="sf-serif mt-4 text-4xl leading-tight text-[#242019] sm:text-5xl">
            Estamos por
            <br />
            <span className="sf-gold-text italic">perto de você.</span>
          </h2>
          <p className="mt-5 max-w-md leading-7 text-[#716b60]">
            Escolha o canal que preferir. Será um prazer atender você e entender
            como podemos ajudar.
          </p>

          <div className="mt-9 space-y-3">
            <a
              href={`tel:${BRAND.phone.replace(/[^0-9+]/g, "")}`}
              className="group flex items-center gap-4 rounded-2xl border border-[#e8e0cf] bg-white/70 p-4 transition hover:border-[#c6a45b]/60 hover:shadow-lg"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#f0e7d3] text-[#9b7837]">
                <Phone size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs uppercase tracking-[0.16em] text-[#9a907e]">Telefone</span>
                <span className="mt-1 block break-words font-medium text-[#29251e]">{BRAND.phone}</span>
              </span>
              <ArrowUpRight className="text-[#b18c46] transition group-hover:-translate-y-1 group-hover:translate-x-1" size={18} />
            </a>

            <a
              href={`https://wa.me/${BRAND.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-[#e8e0cf] bg-white/70 p-4 transition hover:border-[#c6a45b]/60 hover:shadow-lg"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#e5efe3] text-[#39794b]">
                <MessageCircle size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs uppercase tracking-[0.16em] text-[#9a907e]">WhatsApp</span>
                <span className="mt-1 block break-words font-medium text-[#29251e]">{BRAND.whatsappLabel}</span>
              </span>
              <ArrowUpRight className="text-[#b18c46] transition group-hover:-translate-y-1 group-hover:translate-x-1" size={18} />
            </a>

            <a
              href={`https://instagram.com/${BRAND.instagram}`}
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-4 rounded-2xl border border-[#e8e0cf] bg-white/70 p-4 transition hover:border-[#c6a45b]/60 hover:shadow-lg"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#f3e6e3] text-[#a65c50]">
                <Instagram size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs uppercase tracking-[0.16em] text-[#9a907e]">Instagram</span>
                <span className="mt-1 block break-words font-medium text-[#29251e]">@{BRAND.instagram}</span>
              </span>
              <ArrowUpRight className="text-[#b18c46] transition group-hover:-translate-y-1 group-hover:translate-x-1" size={18} />
            </a>

            <div className="flex items-center gap-4 rounded-2xl border border-[#e8e0cf] bg-white/70 p-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#f0e7d3] text-[#9b7837]">
                <MapPin size={20} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs uppercase tracking-[0.16em] text-[#9a907e]">Localização</span>
                <span className="mt-1 block break-words font-medium text-[#29251e]">{BRAND.address}</span>
              </span>
            </div>
          </div>
        </div>

        <div id="formulario" className="scroll-mt-24">
          <div className="overflow-hidden rounded-3xl border border-[#e8e0cf] bg-white shadow-[0_24px_70px_rgba(47,37,20,0.09)]">
            <div className="bg-[#171510] px-7 py-7 text-[#f8f4e9] sm:px-9">
              <p className="sf-eyebrow text-[#d9bd7b]">FALE COM A ABBUD IMÓVEIS</p>
              <h2 className="sf-serif mt-3 text-3xl sm:text-4xl">Como podemos ajudar?</h2>
              <p className="mt-3 text-sm leading-6 text-white/55">
                Preencha seus dados e envie sua mensagem. Vamos conversar sobre o que você procura.
              </p>
            </div>
            <div className="p-6 sm:p-9">
              <LeadForm />
            </div>
          </div>
          <p className="mt-5 text-center text-xs leading-5 text-[#928978]">
            Seus dados serão utilizados para que nossa equipe possa retornar seu contato.
          </p>
        </div>
      </section>

      <section className="border-t border-[#e7decb] bg-[#eee7d8]">
        <div className="sf-container flex flex-col gap-3 py-8 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="sf-serif text-xl text-[#332b1e]">Abbud Imóveis <span className="text-[#a98542]">—</span> seu próximo capítulo começa aqui.</p>
          <p className="text-xs tracking-[0.12em] text-[#817764]">BARRA DO PIRAÍ · RJ</p>
        </div>
      </section>
    </main>
  );
}

