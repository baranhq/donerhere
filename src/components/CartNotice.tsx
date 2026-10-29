import { ArrowRight, X } from "lucide-react";
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
      className="fixed right-6 bottom-6 z-100 max-w-[calc(100vw-32px)] max-[600px]:right-4 max-[600px]:bottom-4 max-[600px]:left-4"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {visible && (
        <div className="flex max-w-[420px] animate-[toast-appear_180ms_ease] items-center gap-3 rounded-md border border-[#e5ddd8] bg-white py-3 pr-3.5 pl-[18px] shadow-[0_3px_12px_#211c1914] [&>div]:flex [&>div]:flex-col [&>div]:gap-1.5 [&>div]:text-[.9rem] [&_button]:rounded-[5px] [&_button]:p-1.5 [&_button:hover]:bg-[#ffe5d9] max-[600px]:w-full max-[600px]:[&>div]:flex-1">
          <div>
            <span>{notice}</span>
            <button
              className="inline-flex w-fit items-center gap-1.5 p-0! text-left text-[.85rem] font-semibold text-[#b33e12]"
              onClick={() => {
                setVisible(false);
                setCartOpen(true);
              }}
            >
              View cart
              <ArrowRight size={15} aria-hidden="true" />
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
