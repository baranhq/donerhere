import session from "express-session";
import { createHash, randomBytes } from "node:crypto";
const hash = (s) => createHash("sha256").update(s).digest("hex");
class SQLiteStore extends session.Store {
  constructor(db) {
    super();
    this.db = db;
  }
  get(sid, done) {
    try {
      const row = this.db
        .prepare("SELECT * FROM web_sessions WHERE token=?")
        .get(hash(sid));
      if (
        !row ||
        row.expires < Date.now() ||
        row.touched < Date.now() - 1800000
      )
        return done(null, null);
      done(null, JSON.parse(row.json));
    } catch (e) {
      done(e);
    }
  }
  set(sid, value, done = () => {}) {
    try {
      const now = Date.now();
      this.db
        .prepare("DELETE FROM web_sessions WHERE expires<? OR touched<?")
        .run(now, now - 1800000);
      this.db
        .prepare(
          "INSERT INTO web_sessions VALUES(?,?,?,?,?) ON CONFLICT(token) DO UPDATE SET json=excluded.json,user_id=excluded.user_id,touched=excluded.touched,expires=excluded.expires",
        )
        .run(
          hash(sid),
          JSON.stringify(value),
          value.userId || null,
          value.absoluteExpiry || now + 604800000,
          now,
        );
      done();
    } catch (e) {
      done(e);
    }
  }
  touch(sid, value, done = () => {}) {
    try {
      this.db
        .prepare("UPDATE web_sessions SET touched=? WHERE token=?")
        .run(Date.now(), hash(sid));
      done();
    } catch (error) {
      done(error);
    }
  }
  destroy(sid, done = () => {}) {
    try {
      this.db.prepare("DELETE FROM web_sessions WHERE token=?").run(hash(sid));
      done();
    } catch (e) {
      done(e);
    }
  }
}
export function sessions(db, production) {
  if (
    production &&
    (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 32)
  )
    throw new Error("Set SESSION_SECRET to at least 32 random characters");
  db.prepare("INSERT OR IGNORE INTO settings VALUES(?,?)").run(
    "dev-session-secret",
    randomBytes(32).toString("hex"),
  );
  return session({
    store: new SQLiteStore(db),
    secret:
      process.env.SESSION_SECRET ||
      db
        .prepare("SELECT value FROM settings WHERE key=?")
        .get("dev-session-secret").value,
    name: production ? "__Host-doner_session" : "doner_session",
    resave: false,
    saveUninitialized: false,
    proxy: production,
    cookie: {
      httpOnly: true,
      secure: production,
      sameSite: "strict",
      path: "/",
      maxAge: 604800000,
    },
  });
}
