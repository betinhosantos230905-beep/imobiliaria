import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { adminLogin } from "@/lib/auth.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar — Área administrativa Abbud Imóveis" },
      {
        name: "description",
        content: "Acesso à área administrativa da Abbud Imóveis.",
      },
      { property: "og:title", content: "Área administrativa — Abbud Imóveis" },
      {
        property: "og:description",
        content: "Acesso à área administrativa.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const password = String(formData.get("password") ?? "");

    if (!password) {
      toast.error("Informe a senha de acesso.");
      return;
    }

    setLoading(true);

    try {
      const result = await adminLogin({
        data: { password },
      });

      if (!result.authenticated) {
        toast.error("Senha inválida ou limite de tentativas atingido.");
        return;
      }

      toast.success("Acesso autorizado!");
      await navigate({ to: "/admin" });
    } catch {
      toast.error("Não foi possível realizar o acesso. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen md:grid-cols-2">
      <div className="relative hidden md:block">
        <img
          src="/images/interior-1.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-hero-overlay" />
        <p className="absolute bottom-10 left-10 font-display text-4xl text-primary-foreground">
          Abbud Imóveis
          <br />
          Área administrativa
        </p>
      </div>

      <div className="flex items-center justify-center px-6 py-12">
        <form
          className="w-full max-w-sm space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="space-y-2">
            <p className="text-sm font-medium text-primary">
              ABBUD IMÓVEIS
            </p>

            <h1 className="font-display text-3xl font-semibold">
              Área administrativa
            </h1>

            <p className="text-sm text-muted-foreground">
              Informe sua senha para acessar o painel de gerenciamento.
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium"
            >
              Senha de acesso
            </label>

            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Digite sua senha"
              autoComplete="current-password"
              required
              disabled={loading}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Verificando..." : "Entrar no painel"}
          </Button>

          <div className="text-center">
            <Link
              to="/"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Voltar ao site
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}

