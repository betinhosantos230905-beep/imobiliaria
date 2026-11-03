import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, LogOut, Home, Mail, Building2, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PropertyForm } from "@/components/admin/PropertyForm";
import { formatPrice, type Property } from "@/lib/properties";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Painel — SF Imóveis" },
      { name: "description", content: "Gerencie anúncios, fotos e mensagens." },
      { property: "og:title", content: "Painel — SF Imóveis" },
      { property: "og:description", content: "Área administrativa." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

function useAdminStatus() {
  const [state, setState] = useState<{ loading: boolean; email?: string | undefined; admin: boolean }>({ loading: true, admin: false });
  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setState({ loading: false, admin: false }); return; }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
      setState({ loading: false, email: user.email, admin: !!data });
    })();
  }, []);
  return state;
}

function Admin() {
  const navigate = useNavigate();
  const status = useAdminStatus();
  const qc = useQueryClient();
  const [tab, setTab] = useState<"imoveis" | "mensagens">("imoveis");
  const [editing, setEditing] = useState<Property | "new" | null>(null);

  useEffect(() => {
    if (!status.loading && !status.email) navigate({ to: "/login" });
  }, [status, navigate]);

  const props = useQuery({
    queryKey: ["admin-properties"], enabled: status.admin,
    queryFn: async () => (await supabase.from("properties").select("*").order("created_at", { ascending: false })).data ?? [],
  });
  const leads = useQuery({
    queryKey: ["admin-leads"], enabled: status.admin,
    queryFn: async () => (await supabase.from("leads").select("*, properties(title)").order("created_at", { ascending: false })).data ?? [],
  });

  if (status.loading || !status.email) return <div className="p-10 text-muted-foreground">Carregando…</div>;
  if (!status.admin) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-3xl text-primary">Sem permissão de administrador</h1>
      <p className="text-muted-foreground">Esta conta ({status.email}) não tem acesso ao painel.</p>
      <Button variant="outline" onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/login" }))}>Sair</Button>
    </div>
  );

  const refresh = () => { qc.invalidateQueries({ queryKey: ["admin-properties"] }); qc.invalidateQueries({ queryKey: ["properties"] }); };
  const list = props.data ?? [];

  async function remove(p: Property) {
    if (!confirm(`Excluir "${p.title}"?`)) return;
    const { error } = await supabase.from("properties").delete().eq("id", p.id);
    if (error) { toast.error("Erro ao excluir"); return; }
    toast.success("Anúncio excluído"); refresh();
  }
  async function togglePublished(p: Property) {
    await supabase.from("properties").update({ published: !p.published }).eq("id", p.id); refresh();
  }

  const nav = [
    { k: "imoveis" as const, label: "Anúncios", icon: Building2 },
    { k: "mensagens" as const, label: "Mensagens", icon: Mail },
  ];

  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className="flex items-center justify-between bg-sidebar p-4 text-sidebar-foreground md:flex-col md:items-stretch md:justify-start md:gap-8 md:p-6">
        <p className="font-display text-2xl">SF Imóveis <span className="block text-xs uppercase tracking-widest text-sidebar-primary">Painel</span></p>
        <nav className="flex gap-1 md:flex-col">
          {nav.map(({ k, label, icon: Icon }) => (
            <button key={k} onClick={() => setTab(k)}
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${tab === k ? "bg-sidebar-accent text-sidebar-accent-foreground" : "opacity-80"}`}>
              <Icon className="size-4" /><span className="hidden sm:inline">{label}</span>
            </button>
          ))}
          <Link to="/" className="flex items-center gap-2 rounded-md px-3 py-2 text-sm opacity-80"><Home className="size-4" /><span className="hidden sm:inline">Ver site</span></Link>
          <button onClick={() => supabase.auth.signOut().then(() => navigate({ to: "/login" }))} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm opacity-80">
            <LogOut className="size-4" /><span className="hidden sm:inline">Sair</span>
          </button>
        </nav>
      </aside>

      <main className="p-5 md:p-10">
        {tab === "imoveis" ? (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl text-primary">Anúncios</h1>
                <p className="text-sm text-muted-foreground">{list.length} imóveis · {list.filter((p) => p.published).length} publicados</p>
              </div>
              <Button variant="gold" onClick={() => setEditing("new")}><Plus /> Novo anúncio</Button>
            </div>
            <div className="mt-8 grid gap-4">
              {list.map((p) => (
                <div key={p.id} className="flex flex-col gap-4 rounded-xl bg-card p-3 shadow-card sm:flex-row sm:items-center">
                  <img src={p.images[0] ?? "/images/interior-1.jpg"} alt="" className="h-40 w-full rounded-lg object-cover sm:h-20 sm:w-28" />
                  <div className="flex-1">
                    <p className="font-semibold">{p.title}</p>
                    <p className="text-sm text-muted-foreground">{p.neighborhood}, {p.city} · {formatPrice(p)} · {p.images.length} fotos</p>
                    <div className="mt-1 flex gap-2 text-xs">
                      <span className={`rounded-full px-2 py-0.5 ${p.published ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>{p.published ? "Publicado" : "Rascunho"}</span>
                      {p.featured && <span className="rounded-full bg-gold px-2 py-0.5 text-gold-foreground">Destaque</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="outline" title={p.published ? "Despublicar" : "Publicar"} onClick={() => togglePublished(p)}><Eye /></Button>
                    <Button size="icon" variant="outline" title="Editar" onClick={() => setEditing(p)}><Pencil /></Button>
                    <Button size="icon" variant="outline" title="Excluir" onClick={() => remove(p)}><Trash2 /></Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h1 className="text-4xl text-primary">Mensagens</h1>
            <div className="mt-8 grid gap-4">
              {(leads.data ?? []).length === 0 && <p className="text-muted-foreground">Nenhuma mensagem ainda.</p>}
              {(leads.data ?? []).map((l) => (
                <div key={l.id} className="rounded-xl bg-card p-5 shadow-card">
                  <div className="flex flex-wrap justify-between gap-2">
                    <p className="font-semibold">{l.name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(l.created_at).toLocaleString("pt-BR")}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{l.email} {l.phone && `· ${l.phone}`}</p>
                  {l.properties?.title && <p className="mt-1 text-xs text-gold">Imóvel: {l.properties.title}</p>}
                  <p className="mt-3 text-sm">{l.message}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      <Sheet open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader><SheetTitle className="font-display text-3xl">{editing === "new" ? "Novo anúncio" : "Editar anúncio"}</SheetTitle></SheetHeader>
          <div className="px-4 pb-8">
            {editing && <PropertyForm initial={editing === "new" ? undefined : editing} onDone={() => { setEditing(null); refresh(); }} />}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
