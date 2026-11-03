import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — Área do cliente SF Imóveis" },
      { name: "description", content: "Acesso à área administrativa da SF Imóveis." },
      { property: "og:title", content: "Área do cliente — SF Imóveis" },
      { property: "og:description", content: "Acesso à área administrativa." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [loading, setLoading] = useState(false);

  return (
    <main className="grid min-h-screen md:grid-cols-2">
      <div className="relative hidden md:block">
        <img src="/images/interior-1.jpg" alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-hero-overlay" />
        <p className="absolute bottom-10 left-10 font-display text-4xl text-primary-foreground">SF Imóveis<br />Área do cliente</p>
      </div>
      <div className="flex items-center justify-center px-6">
        <form className="w-full max-w-sm space-y-4" onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          const email = String(f.get("email")); const password = String(f.get("password"));
          setLoading(true);
          if (mode === "in") {
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            setLoading(false);
            if (error) { toast.error("E-mail ou senha inválidos."); return; }
            navigate({ to: "/admin" });
          } else {
            const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin` } });
            setLoading(false);
            if (error) { toast.error(error.message); return; }
            toast.success("Conta criada! Confirme pelo link enviado ao seu e-mail.");
            setMode("in");
          }
        }}>
          <Link to="/" className="text-sm text-muted-foreground">← Voltar ao site</Link>
          <h1 className="text-4xl text-primary">{mode === "in" ? "Entrar" : "Criar acesso"}</h1>
          <Input name="email" type="email" placeholder="E-mail" required />
          <Input name="password" type="password" placeholder="Senha" minLength={6} required />
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Aguarde…" : mode === "in" ? "Entrar" : "Criar conta"}</Button>
          <button type="button" className="w-full text-sm text-muted-foreground underline" onClick={() => setMode(mode === "in" ? "up" : "in")}>
            {mode === "in" ? "Primeiro acesso? Criar conta" : "Já tenho conta"}
          </button>
        </form>
      </div>
    </main>
  );
}
