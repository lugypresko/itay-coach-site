import { createHash, randomBytes, randomUUID } from "node:crypto";
import { VERSION, ANALYSIS_VERSION, type Session } from "./contracts";
import { score } from "./scoring";
// pg is already a runtime dependency of this repository.
import pg from "pg";
import { normalizedStore } from "./normalized-store";
import type { Analysis, PartialAnalysis, FullAnalysis } from "./contracts";
const { Pool } = pg;
export const hash = (v: string) => createHash("sha256").update(v).digest("hex");
export const token = () => randomBytes(32).toString("base64url");
export class Conflict extends Error {}
export interface Store {
  recordViews?(s: Session, names: string[]): Promise<void>;
  beginAnalysis?(s: Session, pass: "partial" | "full"): Promise<string>;
  finishAnalysis?(s: Session, id: string, read: Analysis<PartialAnalysis | FullAnalysis>): Promise<string>;
  failAnalysis?(s: Session, id: string, reason: string): Promise<void>;
  create(s: Session, auth: string): Promise<void>;
  read(auth: string): Promise<Session | null>;
  save(s: Session, expected: number): Promise<boolean>;
  remove(auth: string): Promise<void>;
  consumeReturn(value: string, newAuth: string): Promise<boolean>;
}
// Prompt contract changes invalidate derived reads, never answers or identity.
export function currentAnalysis(s: Session): Session {
  if ([s.partial, s.full].some((read) => read && read.analysis_version !== ANALYSIS_VERSION)) {
    delete s.partial;
    delete s.full;
    delete s.mail;
    s.stage = "answering";
    s.step = 8;
  }
  return s;
}
const runtime = globalThis as typeof globalThis & {
  __diagnosticV3Store?: Store;
};
export function memoryStore(): Store {
  const rows = new Map<string, { s: Session; auth: string }>();
  return {
    async create(s, auth) {
      rows.set(s.id, { s: structuredClone(s), auth: hash(auth) });
    },
    async read(auth) {
      const row = [...rows.values()].find((r) => r.auth === hash(auth));
      return row && Date.parse(row.s.expires_at) > Date.now()
        ? currentAnalysis(structuredClone(row.s))
        : null;
    },
    async save(s, expected) {
      const row = rows.get(s.id);
      if (
        !row ||
        row.s.record_version !== expected ||
        Date.parse(row.s.expires_at) <= Date.now()
      )
        return false;
      rows.set(s.id, {
        ...row,
        s: structuredClone({ ...s, record_version: expected + 1 }),
      });
      return true;
    },
    async remove(auth) {
      for (const [id, r] of rows) if (r.auth === hash(auth)) rows.delete(id);
    },
    async consumeReturn(value, newAuth) {
      const row = [...rows.values()].find(
        (r) => r.s.return_hash === hash(value),
      );
      if (!row || Date.parse(row.s.return_expires_at ?? "") <= Date.now())
        return false;
      row.auth = hash(newAuth);
      delete row.s.return_hash;
      delete row.s.return_expires_at;
      row.s.record_version++;
      return true;
    },
  };
}
export function getStore(): Store {
  if (["preview", "production"].includes(process.env.VERCEL_ENV ?? "") && !process.env.DIAGNOSTIC_V3_DATABASE_URL)
    throw new Error("V3 isolated database is not configured");
  if (runtime.__diagnosticV3Store) return runtime.__diagnosticV3Store;
  if (!process.env.DIAGNOSTIC_V3_DATABASE_URL) {
    if (process.env.VERCEL_ENV === "production")
      throw new Error("V3 isolated database is not configured");
    return (runtime.__diagnosticV3Store = memoryStore());
  }
  const pool = new Pool({
    connectionString: process.env.DIAGNOSTIC_V3_DATABASE_URL,
    max: 3,
    connectionTimeoutMillis: 5000,
  });
  return (runtime.__diagnosticV3Store = normalizedStore(pool));
}
export function newSession(): Session {
  const now = new Date();
  return {
    id: randomUUID(),
    diagnostic_version: VERSION,
    record_version: 0,
    answer_revision: 0,
    answers: {},
    step: 0,
    stage: "entry",
    scoring: score({}),
    events: [],
    created_at: now.toISOString(),
    expires_at: new Date(now.getTime() + 30 * 86400000).toISOString(),
  };
}
export async function save(store: Store, s: Session, expected: number) {
  if (!(await store.save(s, expected)))
    throw new Conflict(
      "This case changed in another request. Reload your latest answers.",
    );
  s.record_version = expected + 1;
  return s;
}
