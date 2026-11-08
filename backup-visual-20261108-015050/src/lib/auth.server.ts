import { createHmac, timingSafeEqual } from "node:crypto";
import {
  getCookie,
  setCookie,
  deleteCookie,
} from "@tanstack/react-start/server";

const COOKIE_NAME = "sf_admin_session";
const SESSION_TTL_SECONDS = 8 * 60 * 60;

function getSecrets() {
  const password = process.env["ADMIN_PASSWORD"];
  const secret = process.env["SESSION_SECRET"];

  if (!password || !secret || secret.length < 32) {
    throw new Error(
      "Configure ADMIN_PASSWORD e SESSION_SECRET (mínimo de 32 caracteres).",
    );
  }

  return { password, secret };
}

function sign(value: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(value)
    .digest("base64url");
}

function safeCompare(a: string, b: string): boolean {
  const hashA = createHmac("sha256", "sf-admin-check").update(a).digest();
  const hashB = createHmac("sha256", "sf-admin-check").update(b).digest();

  return timingSafeEqual(hashA, hashB);
}

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  };
}

export function authenticateAdmin(password: string): boolean {
  const secrets = getSecrets();

  if (!safeCompare(password, secrets.password)) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  const payload = Buffer.from(
    JSON.stringify({ iat: now, exp: now + SESSION_TTL_SECONDS }),
  ).toString("base64url");

  const signature = sign(payload, secrets.secret);

  setCookie(COOKIE_NAME, `${payload}.${signature}`, cookieOptions());

  return true;
}

export function isAdminAuthenticated(): boolean {
  const { secret } = getSecrets();
  const cookie = getCookie(COOKIE_NAME);

  if (!cookie) return false;

  const parts = cookie.split(".");
  if (parts.length !== 2) return false;

  const [payload, signature] = parts;
  if (!payload || !signature) return false;

  const expected = sign(payload, secret);

  if (!safeCompare(signature, expected)) return false;

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as { iat?: number; exp?: number };

    const now = Math.floor(Date.now() / 1000);

    return (
      typeof session.iat === "number" &&
      typeof session.exp === "number" &&
      session.iat <= now &&
      session.exp > now &&
      session.exp - session.iat <= SESSION_TTL_SECONDS
    );
  } catch {
    return false;
  }
}

export function logoutAdmin(): void {
  deleteCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    path: "/",
  });
}


export function hashAdminLoginIp(ip: string): string {
  const { secret } = getSecrets();

  return createHmac("sha256", secret)
    .update(`sf-admin-ip:${ip}`)
    .digest("hex");
}

import { getDb } from "./db.server";

export async function loginAdmin(
  password: string,
  ip: string,
): Promise<boolean> {
  const db = getDb();
  const ipHash = hashAdminLoginIp(ip);

  const [rows] = await db.execute(
    `SELECT COUNT(*) AS total
     FROM admin_login_attempts
     WHERE ip_hash = ?
       AND attempted_at >= NOW() - INTERVAL 15 MINUTE`,
    [ipHash],
  ) as [Array<{ total: number }>, unknown];

  if (Number(rows[0]?.total ?? 0) >= 5) {
    return false;
  }

  if (!authenticateAdmin(password)) {
    await db.execute(
      "INSERT INTO admin_login_attempts (ip_hash) VALUES (?)",
      [ipHash],
    );

    return false;
  }

  await db.execute(
    "DELETE FROM admin_login_attempts WHERE ip_hash = ?",
    [ipHash],
  );

  return true;
}
