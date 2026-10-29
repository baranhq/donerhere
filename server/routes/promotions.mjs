import { fail, text, image, slug } from "../security.mjs";
export function promotionRoutes({
  path,
  req,
  body,
  requirePermission,
  catalog,
  save,
  send,
}) {
  if (path !== "/api/admin/promotions") return false;
  requirePermission("promotions.write");
  const current = catalog();
  const result = () => ({
    promotions: current.promotions,
    revision: current.promotionsRevision,
  });
  if (req.method === "GET") return send(200, result());
  if (req.method !== "PUT") return false;
  if (body.revision !== current.promotionsRevision)
    fail(409, "Promotions changed. Reload before saving.");
  if (!Array.isArray(body.promotions) || body.promotions.length > 10)
    fail(400, "Use up to 10 promotion slides");
  const ids = new Set();
  for (const slide of body.promotions) {
    if (
      !slide ||
      !slug(slide.id) ||
      ids.has(slide.id) ||
      !image(slide.image) ||
      !text(slide.alt, 1, 200) ||
      typeof slide.available !== "boolean" ||
      !text(slide.link, 0, 300) ||
      (slide.link && !/^\/(?!\/)[a-zA-Z0-9/\-?=&_.%#]*$/.test(slide.link))
    )
      fail(400, "Check slide images, descriptions and internal website links");
    ids.add(slide.id);
  }
  current.promotions = body.promotions.map((slide) => ({
    id: slide.id,
    image: slide.image,
    alt: slide.alt.trim(),
    link: slide.link,
    available: slide.available,
  }));
  current.promotionsRevision++;
  save(current);
  return send(200, result());
}
