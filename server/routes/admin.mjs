import {
  fail,
  text,
  slug,
  image,
  emailOK,
  passwordOK,
  hashPassword,
} from "../security.mjs";
export async function adminRoutes({
  path,
  req,
  body,
  db,
  employee,
  admin,
  user,
  catalog,
  save,
  send,
}) {
  if (path.startsWith("/api/admin/")) {
    employee();
    const orderId = path.match(/^\/api\/admin\/orders\/([a-zA-Z0-9-]+)$/)?.[1];
    if (orderId && req.method === "PATCH") {
      const row = db.prepare("SELECT json FROM orders WHERE id=?").get(orderId);
      if (!row) fail(404, "Order not found");
      const order = JSON.parse(row.json);
      const allowed = {
        received: ["ready", "declined"],
        ready: ["completed", "declined"],
      };
      if (body.expectedStatus !== order.status)
        fail(409, "Order changed. Refresh before updating.");
      if (!allowed[order.status]?.includes(body.status))
        fail(400, "This status change is not allowed");
      if (body.note !== undefined && !text(body.note, 0, 300))
        fail(400, "Note must be 300 characters or fewer");
      order.status = body.status;
      order.history.push({
        status: body.status,
        at: new Date().toISOString(),
        ...(body.note?.trim() ? { note: body.note.trim() } : {}),
      });
      db.prepare("UPDATE orders SET json=? WHERE id=?").run(
        JSON.stringify(order),
        orderId,
      );
      return send(200, order);
    }
    if (path === "/api/admin/users" || path.startsWith("/api/admin/users/")) {
      admin();
      const list = () =>
        db
          .prepare("SELECT id,name,email,role FROM users ORDER BY id DESC")
          .all();
      if (path === "/api/admin/users" && req.method === "GET")
        return send(200, list());
      if (path === "/api/admin/users" && req.method === "POST") {
        if (
          !text(body.name, 1, 100) ||
          !emailOK(body.email) ||
          !passwordOK(body.password) ||
          !["customer", "employee", "admin"].includes(body.role)
        )
          fail(400, "Check name, email, password and role");
        const password = await hashPassword(body.password);
        try {
          db.prepare(
            "INSERT INTO users(name,email,password,role) VALUES(?,?,?,?)",
          ).run(
            body.name.trim(),
            body.email.trim().toLowerCase(),
            password,
            body.role,
          );
        } catch (error) {
          if (error.errcode === 2067) fail(409, "Email is already in use");
          throw error;
        }
        return send(201, list());
      }
      const id = Number(path.match(/^\/api\/admin\/users\/([1-9]\d*)$/)?.[1]);
      if (!Number.isSafeInteger(id)) return false;
      const target = db.prepare("SELECT * FROM users WHERE id=?").get(id);
      if (!target) fail(404, "User not found");
      if (req.method === "PATCH") {
        if (!["customer", "employee", "admin"].includes(body.role))
          fail(400, "Invalid role");
        if (id === user.id && body.role !== "admin")
          fail(409, "You cannot remove your own admin access");
        if (
          target.role === "admin" &&
          body.role !== "admin" &&
          db
            .prepare("SELECT count(*) AS total FROM users WHERE role='admin'")
            .get().total < 2
        )
          fail(409, "Keep at least one admin account");
        db.prepare("UPDATE users SET role=? WHERE id=?").run(body.role, id);
        if (target.role !== body.role)
          db.prepare("DELETE FROM web_sessions WHERE user_id=?").run(id);
        return send(200, list());
      }
      if (req.method === "DELETE") {
        if (id === user.id)
          fail(409, "You cannot delete your own admin account here");
        if (
          target.role === "admin" &&
          db
            .prepare("SELECT count(*) AS total FROM users WHERE role='admin'")
            .get().total < 2
        )
          fail(409, "Keep at least one admin account");
        db.prepare("DELETE FROM users WHERE id=?").run(id);
        return send(200, list());
      }
      return false;
    }
    if (path === "/api/admin/orders" && req.method === "GET")
      return send(
        200,
        db
          .prepare("SELECT json FROM orders ORDER BY created DESC")
          .all()
          .map((r) => JSON.parse(r.json)),
      );
    const match = path.match(
      /^\/api\/admin\/(products|categories)(?:\/([a-z0-9-]+))?$/,
    );
    if (match && ["POST", "PUT", "DELETE"].includes(req.method)) {
      const [, kind, id] = match;
      const c = catalog();
      const field = kind === "products" ? "link" : "slug";
      const index = c[kind].findIndex((x) => x[field] === id);
      if (req.method !== "POST" && index < 0) fail(404, "Not found");
      if (req.method === "DELETE") {
        if (kind === "categories" && c.products.some((p) => p.category === id))
          fail(409, "Move or delete products in this category first");
        c[kind].splice(index, 1);
      } else {
        if (
          !text(body.name, 1, 100) ||
          !slug(body[field]) ||
          !image(body.image)
        )
          fail(
            400,
            "Enter a name, valid slug and HTTPS or /products/ image URL",
          );
        if (id && body[field] !== id) fail(400, "Slugs cannot be changed");
        if (
          req.method === "POST" &&
          c[kind].some((x) => x[field] === body[field])
        )
          fail(409, "Slug already exists");
        let entry = {
          name: body.name.trim(),
          [field]: body[field],
          image: body.image,
        };
        if (kind === "products") {
          if (
            !c.categories.some((x) => x.slug === body.category) ||
            !text(body.description, 0, 3000) ||
            (body.seoTitle !== undefined && !text(body.seoTitle, 0, 70)) ||
            (body.seoDescription !== undefined &&
              !text(body.seoDescription, 0, 160)) ||
            typeof body.available !== "boolean" ||
            !Array.isArray(body.sizes) ||
            !body.sizes.length ||
            body.sizes.length > 3
          )
            fail(400, "Check category, description and sizes");
          const links = new Set();
          for (const s of body.sizes) {
            if (!s || typeof s !== "object") fail(400, "Invalid size");
            if (
              !["Small", "Regular", "Large"].includes(s.name) ||
              s.link !== s.name.toLowerCase() ||
              links.has(s.link) ||
              !["g", "kg", "ml", "l"].includes(s.unit) ||
              !Number.isFinite(s.weight) ||
              s.weight <= 0 ||
              s.weight > 100000 ||
              !Number.isFinite(s.price) ||
              s.price <= 0 ||
              s.price > 10000 ||
              Math.abs(s.price * 100 - Math.round(s.price * 100)) > 0.00001 ||
              typeof s.available !== "boolean" ||
              (s.oldPrice !== undefined &&
                (!Number.isFinite(s.oldPrice) ||
                  s.oldPrice <= 0 ||
                  s.oldPrice > 10000))
            )
              fail(400, "Invalid size, weight or price");
            links.add(s.link);
          }
          if (
            !Array.isArray(body.ingredients) ||
            body.ingredients.length > 50 ||
            body.ingredients.some((i) => !text(i, 1, 200))
          )
            fail(400, "Invalid ingredients");
          entry = {
            ...entry,
            description: body.description,
            seoTitle: body.seoTitle?.trim() || "",
            seoDescription: body.seoDescription?.trim() || "",
            category: body.category,
            available: body.available,
            popular: body.popular === true,
            ingredients: body.ingredients,
            sizes: body.sizes.map((s) => ({
              name: s.name,
              link: s.link,
              price: s.price,
              weight: s.weight,
              unit: s.unit,
              available: s.available,
              ...(s.oldPrice !== undefined ? { oldPrice: s.oldPrice } : {}),
            })),
          };
        }
        if (req.method === "POST") c[kind].push(entry);
        else c[kind][index] = entry;
      }
      save(c);
      return send(200, c);
    }
  }

  return false;
}
