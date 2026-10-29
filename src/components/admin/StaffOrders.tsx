import { useState } from "react";
import type { Order } from "../../store/site";
import { api } from "../../store/site";
import OrderList from "../account/OrderList";

export default function StaffOrders({
  orders,
  onChange,
}: {
  orders: Order[];
  onChange: (orders: Order[]) => void;
}) {
  const [view, setView] = useState("active");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  async function refresh() {
    setRefreshing(true);
    setError("");
    try {
      onChange(await api<Order[]>("/admin/orders"));
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not load orders",
      );
    } finally {
      setRefreshing(false);
    }
  }
  const filtered = orders.filter(
    (order) =>
      (view === "all" ||
        (view === "active"
          ? ["received", "ready"].includes(order.status)
          : ["completed", "declined"].includes(order.status))) &&
      `${order.number} ${order.name} ${order.status}`
        .toLowerCase()
        .includes(search.toLowerCase().trim()),
  );
  return (
    <section className="admin-section">
      <div className="order-list-toolbar">
        <div className="tabs" aria-label="Order views">
          {["active", "past", "all"].map((tab) => (
            <button
              key={tab}
              className={view === tab ? "button" : "button secondary"}
              aria-pressed={view === tab}
              onClick={() => setView(tab)}
            >
              {tab === "active"
                ? "Active orders"
                : tab === "past"
                  ? "Past orders"
                  : "All orders"}
            </button>
          ))}
        </div>
        <button
          className="text-link"
          disabled={refreshing}
          onClick={() => void refresh()}
        >
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      <label className="order-search">
        Search orders
        <input
          type="search"
          placeholder="Order number, customer or status"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </label>
      {error && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <OrderList
        orders={filtered}
        onUpdate={async (order, status, note) => {
          const updated = await api<Order>(
            `/admin/orders/${order.id}`,
            "PATCH",
            { status, note, expectedStatus: order.status },
          );
          onChange(
            orders.map((current) =>
              current.id === updated.id ? updated : current,
            ),
          );
        }}
      />
    </section>
  );
}
