import type { RowDataPacket } from "mysql2";
import { getDb } from "./db.server";
import {
  mapProperty,
  type Property,
  type PropertyRow,
} from "./properties.server";
import { isAdminAuthenticated } from "./auth.server";

function requireAdmin(): void {
  if (!isAdminAuthenticated()) {
    throw new Error("Acesso não autorizado.");
  }
}

export type AdminLead = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  property_id: string | null;
  property_title: string | null;
  created_at: string;
};

type LeadRow = RowDataPacket & {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  message: string | null;
  property_id: string | null;
  property_title: string | null;
  created_at: Date | string;
};

function formatLeadDate(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : value;
}

export async function listAdminProperties(): Promise<Property[]> {
  requireAdmin();

  const [rows] = await getDb().execute<PropertyRow[]>(
    `SELECT *
     FROM properties
     ORDER BY created_at DESC`,
  );

  return rows.map(mapProperty);
}

export async function listAdminLeads(): Promise<AdminLead[]> {
  requireAdmin();

  const [rows] = await getDb().execute<LeadRow[]>(
    `SELECT
       l.id,
       l.name,
       l.email,
       l.phone,
       l.message,
       l.property_id,
       p.title AS property_title,
       l.created_at
     FROM leads l
     LEFT JOIN properties p ON p.id = l.property_id
     ORDER BY l.created_at DESC`,
  );

  return rows.map((row) => ({
    ...row,
    created_at: formatLeadDate(row.created_at),
  }));
}

export async function setAdminPropertyPublished(
  id: string,
  published: boolean,
): Promise<void> {
  requireAdmin();

  const [result] = await getDb().execute(
    "UPDATE properties SET published = ? WHERE id = ?",
    [published, id],
  );

  if ("affectedRows" in result && result.affectedRows === 0) {
    throw new Error("Imóvel não encontrado.");
  }
}

export async function deleteAdminProperty(id: string): Promise<void> {
  requireAdmin();

  const [result] = await getDb().execute(
    "DELETE FROM properties WHERE id = ?",
    [id],
  );

  if ("affectedRows" in result && result.affectedRows === 0) {
    throw new Error("Imóvel não encontrado.");
  }
}

import { createHash, createHmac, randomUUID } from "node:crypto";

export type AdminPropertyInput = {
  id?: string;
  title: string;
  description: string;
  purpose: string;
  type: string;
  price: number;
  city: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  area: number;
  images: string[];
  featured: boolean;
  published: boolean;
};

export async function saveAdminProperty(
  data: AdminPropertyInput,
): Promise<{ id: string }> {
  requireAdmin();

  if (!data.title.trim()) {
    throw new Error("O título do imóvel é obrigatório.");
  }

  if (!Array.isArray(data.images)) {
    throw new Error("Lista de imagens inválida.");
  }

  const db = getDb();
  const id = data.id || randomUUID();

  const values = [
    data.title.trim(),
    data.description,
    data.purpose,
    data.type,
    data.price,
    data.city,
    data.neighborhood,
    data.bedrooms,
    data.bathrooms,
    data.parking,
    data.area,
    JSON.stringify(data.images),
    data.featured,
    data.published,
  ];

  if (data.id) {
    await db.execute(
      `UPDATE properties SET
        title = ?, description = ?, purpose = ?, type = ?,
        price = ?, city = ?, neighborhood = ?, bedrooms = ?,
        bathrooms = ?, parking = ?, area = ?, images = ?,
        featured = ?, published = ?
       WHERE id = ?`,
      [...values, id],
    );
  } else {
    await db.execute(
      `INSERT INTO properties (
        id, title, description, purpose, type, price, city,
        neighborhood, bedrooms, bathrooms, parking, area,
        images, featured, published
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, ...values],
    );
  }

  return { id };
}

export function createCloudinaryUploadSignature(): {
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
} {
  requireAdmin();

  const cloudName = process.env["CLOUDINARY_CLOUD_NAME"];
  const apiKey = process.env["CLOUDINARY_API_KEY"];
  const apiSecret = process.env["CLOUDINARY_API_SECRET"];

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Configure as variáveis do Cloudinary no servidor.");
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const folder = "sf-imoveis/properties";
  const parameters = `folder=${folder}&timestamp=${timestamp}`;

  const signature = createHash("sha1")
    .update(`${parameters}${apiSecret}`)
    .digest("hex");

  return { cloudName, apiKey, timestamp, folder, signature };
}


