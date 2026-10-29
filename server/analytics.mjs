export function orderAnalytics(db, period, now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  const start = new Date(`${today}T00:00:00.000Z`);
  if (period !== "all")
    start.setUTCDate(start.getUTCDate() - Number(period) + 1);
  const orders = db
    .prepare(
      "SELECT json FROM orders WHERE created<=? AND created>=? ORDER BY created",
    )
    .all(now.toISOString(), period === "all" ? "" : start.toISOString())
    .map((row) => JSON.parse(row.json));
  const statuses = { received: 0, ready: 0, completed: 0, declined: 0 };
  const daily = new Map();
  const products = new Map();
  let completedValueCents = 0;
  for (const order of orders) {
    statuses[order.status] = (statuses[order.status] || 0) + 1;
    const date = order.created.slice(0, 10);
    const day = daily.get(date) || { date, orders: 0, completedValueCents: 0 };
    day.orders++;
    if (order.status === "completed") {
      completedValueCents += order.totalCents;
      day.completedValueCents += order.totalCents;
      for (const item of order.items) {
        const key = item.product || item.name;
        const product = products.get(key) || {
          name: item.name,
          quantity: 0,
          valueCents: 0,
        };
        product.quantity += item.quantity;
        product.valueCents += item.unitCents * item.quantity;
        products.set(key, product);
      }
    }
    daily.set(date, day);
  }
  return {
    period,
    timezone: "UTC",
    totalOrders: orders.length,
    statuses,
    completedValueCents,
    averageCompletedCents: statuses.completed
      ? Math.round(completedValueCents / statuses.completed)
      : 0,
    daily: [...daily.values()].reverse(),
    topProducts: [...products.values()]
      .sort((a, b) => b.quantity - a.quantity || a.name.localeCompare(b.name))
      .slice(0, 10),
  };
}
