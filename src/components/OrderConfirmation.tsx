import SuccessHeader from "./SuccessHeader";
import { ui } from "../styles/ui";
import { Link } from "react-router";
import { money } from "../store/site";
import type { Order } from "../store/site";

export default function OrderConfirmation({ order }: { order: Order }) {
  const delivery = order.fulfillment === "delivery";
  return (
    <main className={`${ui.page} max-w-[900px]! pt-14! max-[650px]:pt-[30px]!`}>
      <SuccessHeader
        title="Order placed successfully"
        eyebrow={`DönerHere! · Order #${order.number}`}
        description={`Thanks, ${order.name}. Your order has been saved. Check its status below or in your order history.`}
      />
      <div className="grid grid-cols-[1.2fr_1fr] overflow-hidden rounded-[10px] border border-[#e9dbd2] max-[650px]:grid-cols-1">
        <section
          className="min-w-0 p-7 [&_ul]:my-5 [&_li]:flex [&_li]:items-baseline [&_li]:gap-3 [&_li]:border-b [&_li]:border-[#eee5df] [&_li]:py-3.5 [&_li>div]:flex-1 [&_li>div_span]:mt-1 [&_li>div_span]:block [&_li>div_span]:text-[.85rem] [&_li>div_span]:text-[#807065] max-[650px]:p-[22px]"
          aria-label="Order receipt"
        >
          <h2>Your order</h2>
          <ul>
            {order.items.map((item, index) => (
              <li key={index}>
                <span className="text-[.9rem] text-[#807065]">
                  {item.quantity} ×
                </span>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.size}</span>
                </div>
                <strong>{money(item.unitCents * item.quantity)}</strong>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex items-center justify-between gap-4 font-[650] [&_strong]:text-[1.7rem]">
            <span>Total</span>
            <strong>{money(order.totalCents)}</strong>
          </div>
          <p className="text-right text-[.85rem] text-[#807065]">
            {order.payment}
          </p>
        </section>
        <section
          className="min-w-0 border-l border-[#e9dbd2] bg-[#fff7f1] p-7 [&_dl]:mt-7 [&_dl]:border-t [&_dl]:border-[#e9dbd2] [&_dl]:pt-5 [&_dt]:mb-1.5 [&_dt]:text-[.8rem] [&_dt]:text-[#807065] [&_dd]:font-mono [&_dd]:text-[.8rem] [&_dd]:wrap-anywhere max-[650px]:border-t max-[650px]:border-l-0 max-[650px]:p-[22px]"
          aria-label="Fulfillment details"
        >
          <span className="inline-block pb-6 text-[.8rem] text-[#92502a]">
            {order.status === "received"
              ? "Awaiting store review"
              : order.status === "ready"
                ? "Ready"
                : order.status === "completed"
                  ? "Completed"
                  : "Declined"}
          </span>
          <h2>{delivery ? "Delivery" : "Collection"}</h2>
          <p>
            {delivery
              ? `${order.deliveryAddress}, ${order.deliveryCity} ${order.postalCode}`
              : order.pickupLocation}
          </p>
          <p className="mt-5! text-[.9rem] text-[#807065]">
            Contact the store to confirm {delivery ? "delivery" : "collection"}{" "}
            timing.
          </p>
          <dl>
            <dt>Order reference</dt>
            <dd>#{order.number}</dd>
          </dl>
        </section>
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-5">
        <Link className={`${ui.button}`} to="/orders">
          View your orders
        </Link>
        <Link className={`${ui.textLink}`} to="/menu">
          Back to the menu
        </Link>
      </div>
    </main>
  );
}
