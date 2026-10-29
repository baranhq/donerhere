import { CheckCircle2, X } from "lucide-react";
import { useEffect, useState } from "react";
import useCart from "../store/cart";

export default function CartNotice() {
  const { notice, noticeId, setCartOpen } = useCart();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!notice) return;
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), 5000);
    return () => window.clearTimeout(timer);
  }, [notice, noticeId]);
  return (
    <div
      className="cart-toast-region"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {visible && (
        <div className="cart-toast">
          <CheckCircle2 size={23} aria-hidden="true" />
          <div>
            <strong>{notice}</strong>
            <button
              className="toast-action"
              onClick={() => {
                setVisible(false);
                setCartOpen(true);
              }}
            >
              View cart
            </button>
          </div>
          <button
            aria-label="Dismiss cart notification"
            onClick={() => setVisible(false)}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
