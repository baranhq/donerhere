import { fail, text } from "../security.mjs";
import {
  permissionOptions,
  permissionsFor,
  validatePermissions,
} from "../permissions.mjs";
export function accessRoutes({ path, req, body, db, admin, send }) {
  if (path === "/api/admin/access") {
    admin();
    if (req.method === "GET")
      return send(200, {
        options: permissionOptions,
        templates: db
          .prepare("SELECT * FROM permission_templates ORDER BY name")
          .all()
          .map((row) => ({
            id: row.id,
            name: row.name,
            permissions: JSON.parse(row.json),
          })),
      });
    if (req.method === "POST") {
      if (!text(body.name, 1, 80)) fail(400, "Enter a template name");
      const permissions = validatePermissions(body.permissions);
      try {
        db.prepare(
          "INSERT INTO permission_templates(name,json) VALUES(?,?)",
        ).run(body.name.trim(), JSON.stringify(permissions));
      } catch (error) {
        if (error.errcode === 2067)
          fail(409, "A template with this name already exists");
        throw error;
      }
      return send(201, { ok: true });
    }
  }
  const match = path.match(/^\/api\/admin\/users\/([1-9]\d*)\/permissions$/);
  if (!match) return false;
  admin();
  const target = db
    .prepare("SELECT id,role FROM users WHERE id=?")
    .get(Number(match[1]));
  if (!target) fail(404, "User not found");
  if (!["employee", "order_staff"].includes(target.role))
    fail(
      400,
      "Custom permissions apply to staff accounts. Store admins always retain full access.",
    );
  if (req.method === "PUT") {
    const permissions = validatePermissions(body.permissions);
    db.prepare(
      "INSERT INTO user_permissions VALUES(?,?) ON CONFLICT(user_id) DO UPDATE SET json=excluded.json",
    ).run(target.id, JSON.stringify(permissions));
  } else if (req.method === "DELETE")
    db.prepare("DELETE FROM user_permissions WHERE user_id=?").run(target.id);
  else return false;
  db.prepare("DELETE FROM web_sessions WHERE user_id=?").run(target.id);
  return send(200, { permissions: permissionsFor(db, target) });
}
