import { queryOptions } from "@tanstack/react-query";
import {
  getProperties,
  getFeaturedProperties,
  getPropertyById,
} from "./properties.functions";
import type { Property } from "./properties.server";

export type { Property } from "./properties.server";

export const BRAND = {
  name: "Abbud Imóveis",
  full: "Abbud Imóveis",
  owner: "Paulo Renato",
  phone: "(24) 99999-1358",
  whatsappLabel: "(24) 99999-1358",
  whatsapp: "5524999991358",
  instagram: "abbud.imoveis",
  address: "Barra do Piraí/RJ",
  creci: "CRECI 3764",
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

export const propertiesQuery = (filters: {
  purpose?: string | undefined;
  type?: string | undefined;
  q?: string | undefined;
} = {}) =>
  queryOptions({
    queryKey: ["properties", filters],
    queryFn: () => getProperties({ data: filters }),
  });

export const featuredQuery = queryOptions({
  queryKey: ["properties", "featured"],
  queryFn: () => getFeaturedProperties(),
});

export const propertyQuery = (id: string) =>
  queryOptions({
    queryKey: ["property", id],
    queryFn: () => getPropertyById({ data: id }),
  });
