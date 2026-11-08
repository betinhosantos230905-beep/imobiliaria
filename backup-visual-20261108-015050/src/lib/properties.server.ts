import type { RowDataPacket } from "mysql2";
import { getDb } from "./db.server";

export type Property = {
  id: string;
  title: string;
  description: string | null;
  purpose: string;
  type: string;
  price: number | null;
  city: string | null;
  neighborhood: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parking: number | null;
  area: number | null;
  images: string[];
  featured: boolean;
  published: boolean;
  created_at: string;
  updated_at?: string;
};

export type PropertyRow = RowDataPacket & Omit<Property, "images" | "created_at" | "updated_at"> & {
  images: unknown;
  created_at: Date | string;
  updated_at: Date | string;
};

function parseImages(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string");
  }

  if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);

      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === "string");
      }
    } catch {
      return [];
    }
  }

  return [];
}

function formatDate(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : value;
}

export function mapProperty(row: PropertyRow): Property {
  return {
    ...row,
    price: row.price === null ? null : Number(row.price),
    area: row.area === null ? null : Number(row.area),
    images: parseImages(row.images),
    featured: Boolean(row.featured),
    published: Boolean(row.published),
    created_at: formatDate(row.created_at),
    updated_at: formatDate(row.updated_at),
  };
}

export async function listPublishedProperties(filters: {
  purpose?: string | undefined;
  type?: string | undefined;
  q?: string | undefined;
} = {}): Promise<Property[]> {
  const conditions = ["published = TRUE"];
  const params: (string | number)[] = [];

  if (filters.purpose) {
    conditions.push("purpose = ?");
    params.push(filters.purpose);
  }

  if (filters.type) {
    conditions.push("type = ?");
    params.push(filters.type);
  }

  if (filters.q?.trim()) {
    const term = `%${filters.q.trim()}%`;
    conditions.push("(title LIKE ? OR city LIKE ? OR neighborhood LIKE ?)");
    params.push(term, term, term);
  }

  const sql = `
    SELECT *
    FROM properties
    WHERE ${conditions.join(" AND ")}
    ORDER BY created_at DESC
  `;

  const [rows] = await getDb().execute<PropertyRow[]>(sql, params);

  return rows.map(mapProperty);
}

export async function listFeaturedProperties(): Promise<Property[]> {
  const [rows] = await getDb().execute<PropertyRow[]>(
    `SELECT *
     FROM properties
     WHERE published = TRUE AND featured = TRUE
     ORDER BY created_at DESC
     LIMIT 6`
  );

  return rows.map(mapProperty);
}

export async function findPublishedProperty(id: string): Promise<Property | null> {
  const [rows] = await getDb().execute<PropertyRow[]>(
    `SELECT *
     FROM properties
     WHERE id = ? AND published = TRUE
     LIMIT 1`,
    [id]
  );

  const row = rows[0];
  return row ? mapProperty(row) : null;
}






