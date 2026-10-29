import { DatabaseSync } from "node:sqlite";
import { chmodSync, mkdirSync, readFileSync } from "node:fs";
import { dirname } from "node:path";
import { migrate } from "./migrations.mjs";

export function openDB(file = process.env.DB_PATH || "data/store.sqlite") {
  mkdirSync(dirname(file), { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(file);
  chmodSync(file, 0o600);
  db.exec(
    "PRAGMA busy_timeout=5000; PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON;",
  );
  const seed = JSON.parse(
    readFileSync(new URL("./seed.json", import.meta.url), "utf8"),
  );
  // Adopt the unversioned development schema without deleting existing data.
  const unversioned =
    db.prepare("PRAGMA user_version").get().user_version === 0;
  if (
    unversioned &&
    db
      .prepare(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='users'",
      )
      .get()
  ) {
    db.exec(
      "CREATE TABLE IF NOT EXISTS web_sessions(token TEXT PRIMARY KEY,json TEXT NOT NULL,user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,expires INTEGER NOT NULL,touched INTEGER NOT NULL); CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY,value TEXT NOT NULL); CREATE INDEX IF NOT EXISTS sessions_by_user ON web_sessions(user_id); CREATE INDEX IF NOT EXISTS orders_by_user ON orders(user_id); PRAGMA user_version=1;",
    );
  }
  migrate(db, seed);
  return db;
}
