import { fail, text, emailOK } from "../security.mjs";
export function messageRoutes({
  path,
  req,
  body,
  db,
  now,
  production,
  requirePermission,
  send,
}) {
  if (path === "/api/admin/messages" && req.method === "GET") {
    requirePermission("messages.read");
    return send(
      200,
      db.prepare("SELECT * FROM messages ORDER BY created DESC,id DESC").all(),
    );
  }
  if (path !== "/api/messages" || req.method !== "POST") return false;
  if (production) {
    const privacy = JSON.parse(
      db.prepare("SELECT value FROM settings WHERE key='policy:privacy'").get()
        ?.value || "{}",
    );
    if (process.env.PUBLIC_FORMS_ENABLED !== "true" || !privacy.published)
      fail(503, "Submissions are not enabled for this deployment");
  }
  if (
    !["contact", "feedback"].includes(body.kind) ||
    !text(body.name, 0, 100) ||
    !text(body.email, 0, 254) ||
    !text(body.message, 5, 3000) ||
    body.website ||
    (body.kind === "contact" &&
      (!text(body.name, 1, 100) || !emailOK(body.email))) ||
    (body.email && !emailOK(body.email)) ||
    (body.kind === "feedback" &&
      (!Number.isInteger(body.rating) || body.rating < 1 || body.rating > 5))
  )
    fail(400, "Check your name, email, message and feedback rating");
  const key = `message:${req.socket.remoteAddress || "unknown"}`;
  if (
    (db.prepare("SELECT count FROM attempts WHERE key=?").get(key)?.count ||
      0) >= 5
  )
    fail(429, "Too many messages. Please try again in 15 minutes.");
  db.prepare(
    "INSERT INTO attempts VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1",
  ).run(key, now + 900000);
  db.prepare(
    "INSERT INTO messages(kind,name,email,message,rating,created) VALUES(?,?,?,?,?,?)",
  ).run(
    body.kind,
    body.name.trim(),
    body.email.trim().toLowerCase(),
    body.message.trim(),
    body.kind === "feedback" ? body.rating : null,
    new Date().toISOString(),
  );
  return send(201, { ok: true });
}
