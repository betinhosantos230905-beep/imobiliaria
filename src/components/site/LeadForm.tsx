import { useState } from "react";
import { toast } from "sonner";
import { submitLead } from "@/lib/leads.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function LeadForm({
  propertyId,
  defaultMessage = "",
}: {
  propertyId?: string;
  defaultMessage?: string;
}) {
  const [loading, setLoading] = useState(false);

  return (
    <form
      className="space-y-3"
      onSubmit={async (e) => {
        e.preventDefault();

        const form = e.currentTarget;
        const f = new FormData(form);

        setLoading(true);

        try {
          await submitLead({
            data: {
              name: String(f.get("name") ?? "").slice(0, 120),
              email: String(f.get("email") ?? "").slice(0, 200),
              phone: String(f.get("phone") ?? "").slice(0, 30),
              message: String(f.get("message") ?? "").slice(0, 2000),
              property_id: propertyId ?? null,
            },
          });

          toast.success("Mensagem enviada! Retornaremos em breve.");
          form.reset();
        } catch {
          toast.error("Não foi possível enviar. Tente novamente.");
        } finally {
          setLoading(false);
        }
      }}
    >
      <Input name="name" placeholder="Seu nome" required maxLength={120} />
      <Input
        name="email"
        type="email"
        placeholder="E-mail"
        required
        maxLength={200}
      />
      <Input
        name="phone"
        placeholder="Telefone / WhatsApp"
        maxLength={30}
      />
      <Textarea
        name="message"
        rows={4}
        defaultValue={defaultMessage}
        placeholder="Mensagem"
        maxLength={2000}
      />
      <Button
        type="submit"
        variant="gold"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Enviando…" : "Enviar mensagem"}
      </Button>
    </form>
  );
}
