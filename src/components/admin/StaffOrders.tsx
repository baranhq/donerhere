import { ui } from "../../styles/ui";
import { useState } from "react";
import type { Order } from "../../store/site";
import { api } from "../../store/site";
import OrderList from "../account/OrderList";

export default function StaffOrders({
  orders,
  onChange,
  canUpdate,
}: {
  canUpdate: boolean;
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
    <section className="min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3" aria-label="Order views">
          {["active", "past", "all"].map((tab) => (
            <button
              key={tab}
              className={
                view === tab
                  ? `${ui.button}`
                  : `${ui.button} bg-[#f5e9e5]! text-[#29201c]! hover:bg-[#ead7cf]!`
              }
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
          className={`${ui.textLink}`}
          disabled={refreshing}
          onClick={() => void refresh()}
        >
          {refreshing ? "Refreshing…" : "Refresh"}
        </button>
      </div>
      <label className="mt-4 mb-6 max-w-[400px]">
        Search orders
        <input
          type="search"
          placeholder="Order number, customer or status"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </label>
      {error && (
        <p role="alert" className="text-[#a51b12]">
          {error}
        </p>
      )}
      <OrderList
        orders={filtered}
        onUpdate={
          canUpdate
            ? async (order, status, note) => {
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
              }
            : undefined
        }
      />
    </section>
  );
}
