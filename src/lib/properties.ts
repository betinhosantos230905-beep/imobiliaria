import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type Property = Tables<"properties">;

export const BRAND = {
  name: "SF Imóveis",
  full: "SF Imóveis e Assessoria Jurídica",
  owner: "Silvia Freire",
  phone: "(24) 2471-3065",
  whatsappLabel: "(24) 99263-6735",
  whatsapp: "5524992636735",
  instagram: "silviafreireimoveis",
  address: "Vassouras/RJ",
  creci: "CRECI nº J 7284",
};

export function formatPrice(p: Property) {
  if (!Number(p.price)) return "Consulte o valor";
  const v = Number(p.price).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  });
  return p.purpose === "aluguel" ? `${v}/mês` : v;
}

export const TYPES = ["casa", "apartamento", "terreno", "comercial"] as const;

export const propertiesQuery = (filters: { purpose?: string | undefined; type?: string | undefined; q?: string | undefined } = {}) =>
  queryOptions({
    queryKey: ["properties", filters],
    queryFn: async () => {
      let q = supabase.from("properties").select("*").eq("published", true).order("created_at", { ascending: false });
      if (filters.purpose) q = q.eq("purpose", filters.purpose);
      if (filters.type) q = q.eq("type", filters.type);
      if (filters.q) q = q.or(`city.ilike.%${filters.q}%,neighborhood.ilike.%${filters.q}%,title.ilike.%${filters.q}%`);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });

export const featuredQuery = queryOptions({
  queryKey: ["properties", "featured"],
  queryFn: async () => {
    const { data, error } = await supabase
      .from("properties").select("*").eq("published", true).eq("featured", true)
      .order("created_at", { ascending: false }).limit(6);
    if (error) throw error;
    return data;
  },
});

export const propertyQuery = (id: string) =>
  queryOptions({
    queryKey: ["property", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("properties").select("*").eq("id", id).maybeSingle();
      if (error) throw error;
      return data;
    },
  });
