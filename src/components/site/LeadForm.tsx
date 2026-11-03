import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function LeadForm({ propertyId, defaultMessage = "" }: { propertyId?: string; defaultMessage?: string }) {
  const [loading, setLoading] = useState(false);
  return (
    <form className="space-y-3" onSubmit={async (e) => {
      e.preventDefault();
      const f = new FormData(e.currentTarget);
      setLoading(true);
      const { error } = await supabase.from("leads").insert({
        name: String(f.get("name")).slice(0, 120),
        email: String(f.get("email")).slice(0, 200),
        phone: String(f.get("phone") ?? "").slice(0, 40),
        message: String(f.get("message") ?? "").slice(0, 2000),
        property_id: propertyId ?? null,
      });
      setLoading(false);
      if (error) { toast.error("Não foi possível enviar. Tente novamente."); return; }
      toast.success("Mensagem enviada! Retornaremos em breve.");
      (e.target as HTMLFormElement).reset();
    }}>
      <Input name="name" placeholder="Seu nome" required maxLength={120} />
      <Input name="email" type="email" placeholder="E-mail" required maxLength={200} />
      <Input name="phone" placeholder="Telefone / WhatsApp" maxLength={40} />
      <Textarea name="message" rows={4} defaultValue={defaultMessage} placeholder="Mensagem" maxLength={2000} />
      <Button type="submit" variant="gold" className="w-full" disabled={loading}>{loading ? "Enviando…" : "Enviar mensagem"}</Button>
    </form>
  );
}
