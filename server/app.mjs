import { createServer } from "node:http";
import { randomBytes } from "node:crypto";
import { fail, hashPassword } from "./security.mjs";
import { accountRoutes } from "./routes/accounts.mjs";
import { orderRoutes } from "./routes/orders.mjs";
import { adminRoutes } from "./routes/admin.mjs";
import { readFile } from "node:fs/promises";
import { resolve, extname } from "node:path";
import { openDB } from "./db.mjs";
import { sessions } from "./sessions.mjs";
export function createApp({
  db = openDB(),
  origin = process.env.APP_ORIGIN || "http://localhost:5173",
  production = process.env.NODE_ENV === "production",
} = {}) {
  if (production && !origin.startsWith("https://"))
    throw new Error("Production APP_ORIGIN must use HTTPS");
  const middleware = sessions(db, production);
  const dummy = hashPassword(randomBytes(32).toString("hex"));
  const catalog = () =>
    JSON.parse(db.prepare("SELECT json FROM catalog WHERE id=1").get().json);
  const save = (c) =>
    db.prepare("UPDATE catalog SET json=? WHERE id=1").run(JSON.stringify(c));
  return createServer(async (req, res) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "same-origin");
    res.setHeader("X-Frame-Options", "DENY");
    if (production) {
      res.setHeader("Strict-Transport-Security", "max-age=31536000");
      res.setHeader(
        "Content-Security-Policy",
        "default-src 'self'; img-src 'self' https:; style-src 'self' 'unsafe-inline'; script-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
      );
    }
    const send = (status, body) => {
      res.writeHead(status, {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      });
      res.end(JSON.stringify(body));
      return true;
    };
    const path = new URL(req.url, "http://localhost").pathname;
    try {
      if (!path.startsWith("/api/")) {
        if (!production) return send(404, { error: "Not found" });
        const root = resolve("dist");
        let file = resolve(root, "." + decodeURIComponent(path));
        if (!file.startsWith(root + "/")) file = resolve(root, "index.html");
        let data;
        try {
          data = await readFile(file);
        } catch {
          file = resolve(root, "index.html");
          data = await readFile(file);
        }
        res.setHeader(
          "Content-Type",
          {
            ".html": "text/html",
            ".js": "text/javascript",
            ".css": "text/css",
            ".png": "image/png",
            ".json": "application/json",
            ".woff2": "font/woff2",
            ".ttf": "font/ttf",
          }[extname(file)] || "application/octet-stream",
        );
        res.end(data);
        return;
      }
      const mutation = !["GET", "HEAD"].includes(req.method);
      if (
        mutation &&
        (req.headers.origin !== origin ||
          req.headers["x-requested-with"] !== "DonerHere")
      )
        fail(403, "Invalid request origin");
      let body = {};
      if (mutation) {
        if (!req.headers["content-type"]?.startsWith("application/json"))
          fail(415, "JSON required");
        let raw = "";
        for await (const chunk of req) {
          raw += chunk;
          if (Buffer.byteLength(raw) > 65536) fail(413, "Request too large");
        }
        try {
          body = JSON.parse(raw || "{}");
        } catch {
          fail(400, "Invalid JSON");
        }
        if (!body || Array.isArray(body) || typeof body !== "object")
          fail(400, "Invalid body");
      }
      await new Promise((resolve, reject) =>
        middleware(req, res, (e) => (e ? reject(e) : resolve())),
      );
      const now = Date.now();
      db.prepare("DELETE FROM attempts WHERE until<?").run(now);
      const user = req.session.userId
        ? db.prepare("SELECT * FROM users WHERE id=?").get(req.session.userId)
        : null;
      const publicUser = (u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
      });
      const requireUser = () => {
        if (!user) fail(401, "Please sign in");
        return user;
      };
      const employee = () => {
        requireUser();
        if (user.role !== "employee") fail(403, "Employee access required");
      };
      const destroySession = async () => {
        await new Promise((resolve, reject) =>
          req.session.destroy((e) => (e ? reject(e) : resolve())),
        );
        res.setHeader(
          "Set-Cookie",
          `${production ? "__Host-doner_session" : "doner_session"}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${production ? "; Secure" : ""}`,
        );
      };
      const session = async (u) => {
        await new Promise((resolve, reject) =>
          req.session.regenerate((e) => (e ? reject(e) : resolve())),
        );
        req.session.userId = u.id;
        req.session.absoluteExpiry = now + 604800000;
        await new Promise((resolve, reject) =>
          req.session.save((e) => (e ? reject(e) : resolve())),
        );
      };
      if (path === "/api/catalog" && req.method === "GET")
        return send(200, catalog());
      if (path === "/api/me" && req.method === "GET")
        return send(200, { user: user ? publicUser(user) : null });
      const context = {
        path,
        req,
        body,
        db,
        now,
        dummy,
        user,
        publicUser,
        session,
        destroySession,
        requireUser,
        employee,
        catalog,
        save,
        send,
      };
      if (await accountRoutes(context)) return;
      if (await orderRoutes(context)) return;
      if (await adminRoutes(context)) return;
      fail(404, "Not found");
    } catch (e) {
      if (!e.status) console.error(e);
      if (!res.headersSent)
        send(e.status || 500, {
          error: e.status ? e.message : "Something went wrong",
        });
      else res.end();
    }
  });
}
