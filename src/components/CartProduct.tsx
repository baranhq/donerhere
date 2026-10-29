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
    <article className="cart-line">
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
      <div className="cart-line-actions">
        <button
          className="cart-remove"
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
