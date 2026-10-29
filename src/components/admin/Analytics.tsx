import { ui } from "../../styles/ui";
import { useEffect, useState } from "react";
import { api, money } from "../../store/site";

type Report = {
  totalOrders: number;
  completedValueCents: number;
  averageCompletedCents: number;
  statuses: {
    received: number;
    ready: number;
    completed: number;
    declined: number;
  };
  daily: { date: string; orders: number; completedValueCents: number }[];
  topProducts: { name: string; quantity: number; valueCents: number }[];
};
export default function Analytics() {
  const [period, setPeriod] = useState("30");
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setReport(null);
    setError("");
    api<Report>(`/admin/analytics?days=${period}`)
      .then((value) => {
        if (!cancelled) setReport(value);
      })
      .catch((cause) => {
        if (!cancelled)
          setError(
            cause instanceof Error ? cause.message : "Could not load analytics",
          );
      });
    return () => {
      cancelled = true;
    };
  }, [period, revision]);
  return (
    <section className="space-y-6" aria-label="Store analytics">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <label className="max-w-60">
          Reporting period
          <select
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="all">All time</option>
          </select>
        </label>
        <button
          className={`${ui.button} bg-[#f5e9e5]! text-[#29201c]! hover:bg-[#ead7cf]!`}
          onClick={() => setRevision((value) => value + 1)}
        >
          Refresh analytics
        </button>
      </div>
      <p className="text-sm text-stone-600">
        Based on saved orders, grouped by the date they were placed (UTC).
        Completed order value does not confirm payment was collected.
      </p>
      {error && (
        <p role="alert" className="text-[#a51b12]">
          {error}
        </p>
      )}
      {!report && !error && <p role="status">Loading store analytics…</p>}
      {report && (
        <>
          <dl className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Orders placed", String(report.totalOrders)],
              ["Completed order value", money(report.completedValueCents)],
              ["Average completed order", money(report.averageCompletedCents)],
              [
                "Awaiting completion",
                String(report.statuses.received + report.statuses.ready),
              ],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-orange-100 bg-orange-50/40 p-5"
              >
                <dt className="text-sm text-stone-600">{label}</dt>
                <dd className="mt-2 text-2xl font-bold">{value}</dd>
              </div>
            ))}
          </dl>
          <section className="rounded-xl border border-stone-200 p-5">
            <h2>Order status</h2>
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {Object.entries(report.statuses).map(([status, count]) => (
                <div key={status}>
                  <dt className="capitalize text-stone-600">{status}</dt>
                  <dd className="mt-1 text-xl font-semibold">{count}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section>
            <h2>Daily orders</h2>
            <div className="overflow-x-auto rounded-[13px] border border-[#eadbd3]">
              <table className={`${ui.table}`}>
                <thead>
                  <tr>
                    <th scope="col">Date (UTC)</th>
                    <th scope="col">Orders placed</th>
                    <th scope="col">Completed order value</th>
                  </tr>
                </thead>
                <tbody>
                  {report.daily.map((day) => (
                    <tr key={day.date}>
                      <td>
                        <time dateTime={day.date}>{day.date}</time>
                      </td>
                      <td>{day.orders}</td>
                      <td>{money(day.completedValueCents)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!report.daily.length && (
                <p className="p-6 text-center">No orders in this period.</p>
              )}
            </div>
          </section>
          <section>
            <h2>Top products</h2>
            <p className="text-sm text-stone-600">
              Quantities from completed orders only.
            </p>
            <div className="overflow-x-auto rounded-[13px] border border-[#eadbd3]">
              <table className={`${ui.table}`}>
                <thead>
                  <tr>
                    <th scope="col">Product</th>
                    <th scope="col">Items sold</th>
                    <th scope="col">Order value</th>
                  </tr>
                </thead>
                <tbody>
                  {report.topProducts.map((product) => (
                    <tr key={product.name}>
                      <td>{product.name}</td>
                      <td>{product.quantity}</td>
                      <td>{money(product.valueCents)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!report.topProducts.length && (
                <p className="p-6 text-center">
                  Complete an order to see product totals.
                </p>
              )}
            </div>
          </section>
        </>
      )}
    </section>
  );
}
