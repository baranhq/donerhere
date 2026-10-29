import { X } from "lucide-react";
import useCart from "../store/cart";
import type { CartItem } from "../store/cart";
import { money } from "../store/site";
export default function CartProduct({
  product,
  selectedSize,
  quantity,
  index,
}: CartItem & { index: number }) {
  const { setQuantity, removeFromCart } = useCart();
  return (
    <article className="flex items-center gap-[18px] border-b border-[#e6cfc3] py-[18px] [&_img]:size-20 [&_img]:object-contain [&>div]:min-w-0 [&>div]:flex-1 [&_input]:max-w-[85px] [&>strong]:whitespace-nowrap max-[700px]:items-start max-[700px]:gap-2.5 max-[700px]:[&_img]:h-15 max-[700px]:[&_img]:w-12">
      <img src={product.image} alt="" />
      <div>
        <strong>{product.name}</strong>
        <p>
          {selectedSize.name} · {money(Math.round(selectedSize.price * 100))}{" "}
          each
        </p>
        <label>
          Quantity{" "}
          <input
            aria-label={`Quantity for ${product.name} ${selectedSize.name}`}
            type="number"
            min="1"
            max="99"
            value={quantity}
            onChange={(e) => setQuantity(index, Number(e.target.value))}
          />
        </label>
      </div>
      <div className="flex flex-none! flex-col items-end self-stretch justify-between gap-[22px] pb-2">
        <button
          className="flex size-8 items-center justify-center rounded-md text-[#766d67] hover:bg-[#ffede4] hover:text-[#a43d0a]"
          aria-label={`Remove ${product.name} ${selectedSize.name}`}
          title="Remove item"
          onClick={() => removeFromCart(index)}
        >
          <X size={18} aria-hidden="true" />
        </button>
        <strong>
          {money(Math.round(selectedSize.price * 100) * quantity)}
        </strong>
      </div>
    </article>
  );
}
