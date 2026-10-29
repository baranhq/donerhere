import { fail, text, slug, image } from "../security.mjs";
export async function adminRoutes({
  path,
  req,
  body,
  db,
  employee,
  catalog,
  save,
  send,
}) {
  if (path.startsWith("/api/admin/")) {
    employee();
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
