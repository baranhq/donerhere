import { openDB } from "../server/db.mjs";

const email = process.argv[2]?.trim().toLowerCase();
if (!email) throw new Error("Usage: npm run admin -- registered-email");

const db = openDB();
try {
  const result = db
    .prepare("UPDATE users SET role='admin' WHERE email=?")
    .run(email);
  if (!result.changes) throw new Error("Register this account first.");
  db.prepare(
    "DELETE FROM web_sessions WHERE user_id=(SELECT id FROM users WHERE email=?)",
  ).run(email);
  console.log("Admin access granted. Sign in again to use it.");
} finally {
  db.close();
}
