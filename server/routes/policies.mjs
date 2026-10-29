import { fail, text } from "../security.mjs";
export function policyRoutes({ path, req, body, db, admin, send }) {
  const match = path.match(/^\/api\/(admin\/)?policies\/(terms|privacy)$/);
  if (!match) return false;
  const [, restricted, kind] = match;
  const key = `policy:${kind}`;
  const current = JSON.parse(
    db.prepare("SELECT value FROM settings WHERE key=?").get(key)?.value ||
      '{"draft":"","published":null,"publishedAt":null,"revision":0}',
  );
  if (!restricted) {
    if (req.method !== "GET") return false;
    return send(200, {
      content: current.published,
      publishedAt: current.publishedAt,
    });
  }
  admin();
  if (req.method === "GET") return send(200, current);
  if (!["PUT", "POST"].includes(req.method)) return false;
  if (body.revision !== current.revision)
    fail(409, "This document changed. Reload it before saving.");
  if (req.method === "PUT") {
    if (!text(body.draft, 0, 20000))
      fail(400, "Document must be 20,000 characters or fewer");
    current.draft = body.draft;
  } else {
    if (body.approved !== true || !current.draft.trim())
      fail(400, "Review and approve a saved, nonempty draft before publishing");
    current.published = current.draft;
    current.publishedAt = new Date().toISOString();
  }
  current.revision++;
  db.prepare(
    "INSERT INTO settings(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value",
  ).run(key, JSON.stringify(current));
  return send(200, current);
}
