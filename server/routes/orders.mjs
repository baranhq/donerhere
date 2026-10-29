import { fail, text } from "../security.mjs";
export async function orderRoutes({
  path,
  req,
  body,
  db,
  user,
  requireUser,
  catalog,
  send,
}) {
  if (path === "/api/orders" && req.method === "POST") {
    requireUser();
    if (
      !text(body.name, 1, 100) ||
      !text(body.phone, 5, 40) ||
      !Array.isArray(body.items) ||
      !body.items.length ||
      body.items.length > 100 ||
      !text(body.requestId, 10, 80)
    )
      fail(400, "Check order details and cart");
    const existing = db
      .prepare("SELECT * FROM orders WHERE id=?")
      .get(body.requestId);
    if (existing) {
      if (existing.user_id !== user.id)
        fail(409, "Order reference unavailable");
      return send(200, JSON.parse(existing.json));
    }
    const c = catalog();
    if (!["delivery", "collection"].includes(body.fulfillment))
      fail(400, "Choose delivery or collection");
    if (
      body.fulfillment === "collection" &&
      !c.pickupLocations.includes(body.pickupLocation)
    )
      fail(400, "Choose a valid collection location");
    if (
      body.fulfillment === "delivery" &&
      (!text(body.deliveryAddress, 5, 200) ||
        !text(body.deliveryCity, 1, 100) ||
        !text(body.postalCode, 2, 30))
    )
      fail(400, "Enter a valid delivery address, city and postal code");
    const seen = new Set();
    const items = body.items.map((item) => {
      if (!item || typeof item !== "object") fail(400, "Invalid cart item");
      const p = c.products.find((p) => p.link === item.product);
      const s = p?.sizes?.find((s) => s.link === item.size);
      if (
        !p?.available ||
        !s?.available ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 99
      )
        fail(400, "An item is unavailable or has an invalid quantity");
      const key = p.link + ":" + s.link;
      if (seen.has(key)) fail(400, "Duplicate cart item");
      seen.add(key);
      return {
        product: p.link,
        name: p.name,
        size: s.name,
        quantity: item.quantity,
        unitCents: Math.round(s.price * 100),
      };
    });
    const totalCents = items.reduce(
      (sum, i) => sum + i.unitCents * i.quantity,
      0,
    );
    if (body.expectedTotalCents !== totalCents)
      fail(409, "Prices changed. Refresh your cart before placing the order.");
    const order = {
      id: body.requestId,
      name: body.name.trim(),
      phone: body.phone.trim(),
      fulfillment: body.fulfillment,
      ...(body.fulfillment === "collection"
        ? { pickupLocation: body.pickupLocation }
        : {
            deliveryAddress: body.deliveryAddress.trim(),
            deliveryCity: body.deliveryCity.trim(),
            postalCode: body.postalCode.trim(),
          }),
      items,
      totalCents,
      status: "received",
      payment:
        body.fulfillment === "delivery"
          ? "Payment on delivery"
          : "Payment on collection",
      created: new Date().toISOString(),
    };
    order.history = [{ status: order.status, at: order.created }];
    db.exec("BEGIN IMMEDIATE");
    try {
      db.prepare("INSERT INTO orders VALUES(?,?,?,?)").run(
        order.id,
        user.id,
        JSON.stringify(order),
        order.created,
      );
      order.number = Number(
        db
          .prepare("INSERT INTO order_numbers(order_id) VALUES(?)")
          .run(order.id).lastInsertRowid,
      );
      db.prepare("UPDATE orders SET json=? WHERE id=?").run(
        JSON.stringify(order),
        order.id,
      );
      db.exec("COMMIT");
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    }
    return send(201, order);
  }
  if (path === "/api/orders" && req.method === "GET") {
    requireUser();
    return send(
      200,
      db
        .prepare(
          "SELECT json FROM orders WHERE user_id=? ORDER BY created DESC",
        )
        .all(user.id)
        .map((r) => JSON.parse(r.json)),
    );
  }

  return false;
}
