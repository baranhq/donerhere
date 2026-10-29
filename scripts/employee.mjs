import { openDB } from "../server/db.mjs";
const email = process.argv[2]?.trim().toLowerCase();
if (!email) throw new Error("Usage: npm run employee -- registered-email");
const db = openDB();
const result = db
  .prepare("UPDATE users SET role='employee' WHERE email=? AND role='customer'")
  .run(email);
if (!result.changes) throw new Error("Register a customer account first.");
console.log("Employee access granted to the registered account.");
db.close();
