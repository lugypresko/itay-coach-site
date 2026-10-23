import { createHash, randomBytes, randomUUID } from "node:crypto";
import { VERSION, ANALYSIS_VERSION, type Session } from "./contracts";
import { score } from "./scoring";
// pg is already a runtime dependency of this repository.
import pg from "pg";
const { Pool } = pg;
export const hash = (v: string) => createHash("sha256").update(v).digest("hex");
export const token = () => randomBytes(32).toString("base64url");
export class Conflict extends Error {}
export interface Store {
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
  return (runtime.__diagnosticV3Store = {
    async create(s, auth) {
      await pool.query(
        "INSERT INTO diagnostic_v3_sessions (id,auth_hash,payload,record_version,expires_at) VALUES ($1,$2,$3,0,$4)",
        [s.id, hash(auth), s, s.expires_at],
      );
    },
    async read(auth) {
      const r = await pool.query(
        "SELECT payload FROM diagnostic_v3_sessions WHERE auth_hash=$1 AND expires_at>now()",
        [hash(auth)],
      );
      return r.rows[0]?.payload ? currentAnalysis(r.rows[0].payload) : null;
    },
    async save(s, expected) {
      const next = { ...s, record_version: expected + 1 };
      const r = await pool.query(
        "UPDATE diagnostic_v3_sessions SET payload=$1,record_version=$2,expires_at=$3 WHERE id=$4 AND record_version=$5 AND expires_at>now()",
        [next, expected + 1, s.expires_at, s.id, expected],
      );
      return r.rowCount === 1;
    },
    async remove(auth) {
      await pool.query(
        "DELETE FROM diagnostic_v3_sessions WHERE auth_hash=$1",
        [hash(auth)],
      );
    },
    async consumeReturn(value, newAuth) {
      const r = await pool.query(
        "UPDATE diagnostic_v3_sessions SET auth_hash=$1, record_version=record_version+1, payload=(payload-'return_hash'-'return_expires_at') || jsonb_build_object('record_version',record_version+1) WHERE payload->>'return_hash'=$2 AND (payload->>'return_expires_at')::timestamptz>now() AND expires_at>now()",
        [hash(newAuth), hash(value)],
      );
      return r.rowCount === 1;
    },
  });
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
