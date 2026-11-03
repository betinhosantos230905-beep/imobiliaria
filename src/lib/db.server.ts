import { createPool, type Pool } from "mysql2/promise";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

let pool: Pool | undefined;

export function getDb(): Pool {
  if (pool) return pool;

  const {
    TIDB_HOST,
    TIDB_PORT,
    TIDB_USER,
    TIDB_PASSWORD,
    TIDB_DATABASE,
    TIDB_CA_PATH,
  } = process.env;

  const required = {
    TIDB_HOST,
    TIDB_USER,
    TIDB_PASSWORD,
    TIDB_DATABASE,
  };

  const missing = Object.entries(required)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length) {
    throw new Error(`Variáveis do TiDB ausentes: ${missing.join(", ")}`);
  }

  const ssl = {
    rejectUnauthorized: true,
    ...(TIDB_CA_PATH
      ? { ca: readFileSync(resolve(TIDB_CA_PATH)) }
      : {}),
  };

  pool = createPool({
    host: TIDB_HOST!,
    port: Number(TIDB_PORT || 4000),
    user: TIDB_USER!,
    password: TIDB_PASSWORD!,
    database: TIDB_DATABASE!,
    ssl,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    decimalNumbers: true,
    enableKeepAlive: true,
  });

  return pool;
}

