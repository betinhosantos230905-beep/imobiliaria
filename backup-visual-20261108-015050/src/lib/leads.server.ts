import { randomUUID } from "node:crypto";
import { getDb } from "./db.server";

export type NewLeadInput = {
  name: string;
  email: string;
  phone: string;
  message: string;
  property_id: string | null;
};

export async function createPublicLead(data: NewLeadInput): Promise<void> {
  const name = data.name.trim();
  const email = data.email.trim().toLowerCase();
  const phone = data.phone.trim();
  const message = data.message.trim();

  if (!name || name.length > 120) {
    throw new Error("Informe um nome válido.");
  }

  if (
    !email ||
    email.length > 200 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    throw new Error("Informe um e-mail válido.");
  }

  if (phone.length > 30 || message.length > 2000) {
    throw new Error("Algum campo ultrapassou o limite permitido.");
  }

  const db = getDb();

  if (data.property_id) {
    const [properties] = await db.execute(
      "SELECT id FROM properties WHERE id = ? AND published = TRUE LIMIT 1",
      [data.property_id],
    );

    if (!Array.isArray(properties) || properties.length === 0) {
      throw new Error("O imóvel informado não está disponível.");
    }
  }

  await db.execute(
    `INSERT INTO leads (
      id, name, email, phone, message, property_id
    ) VALUES (?, ?, ?, ?, ?, ?)`,
    [
      randomUUID(),
      name,
      email,
      phone || null,
      message || null,
      data.property_id,
    ],
  );
}
