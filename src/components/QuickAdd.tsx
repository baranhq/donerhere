import { useState } from "react";
import { ShoppingCartPlus } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../../@/components/ui/dialog";
import { useSite, money } from "../store/site";
import useCart from "../store/cart";
import { ui } from "../styles/ui";
export default function QuickAdd({ productLink }: { productLink: string }) {
  const { catalog } = useSite();
  const { addToCart } = useCart();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const product = catalog.products.find((entry) => entry.link === productLink);
  const available = product?.sizes?.filter((size) => size.available) || [];
  const size = available.find((entry) => entry.link === selected);
  if (!product) return null;
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (value) setSelected(available[0]?.link || "");
      }}
    >
      <DialogTrigger
        aria-label={`Choose size for ${product.name}`}
        disabled={!product.available || !available.length}
        className="flex h-10 w-[50px] items-center justify-center rounded-[5px] bg-orange-300 text-black hover:bg-orange-500"
      >
        <ShoppingCartPlus size={24} aria-hidden="true" />
      </DialogTrigger>
      <DialogContent className="max-w-[440px] rounded-2xl! p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {product.name}
          </DialogTitle>
          <DialogDescription className="text-base">
            Choose your size.
          </DialogDescription>
        </DialogHeader>
        <form
          className="mt-4 space-y-5 text-base sm:text-lg"
          onSubmit={(event) => {
            event.preventDefault();
            if (size && product.available) {
              addToCart(product, size);
              setOpen(false);
            }
          }}
        >
          <fieldset className="space-y-2">
            <legend className="sr-only">Available sizes</legend>
            {available.map((option) => (
              <label
                key={option.link}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${selected === option.link ? "border-[#f58153] bg-orange-50" : "border-stone-200 bg-white hover:bg-stone-50"}`}
              >
                <input
                  type="radio"
                  name="size"
                  value={option.link}
                  checked={selected === option.link}
                  onChange={() => setSelected(option.link)}
                  className="accent-[#d74e16]"
                />
                <span className="flex-1">
                  <strong className="block">{option.name}</strong>
                  <small className="text-sm text-stone-500">
                    {option.weight} {option.unit}
                  </small>
                </span>
                <strong>{money(Math.round(option.price * 100))}</strong>
              </label>
            ))}
          </fieldset>
          <button
            className={`${ui.button} mb-0 w-full gap-2 text-base`}
            disabled={!size}
          >
            <ShoppingCartPlus size={18} aria-hidden="true" />
            Add to cart{size && ` · ${money(Math.round(size.price * 100))}`}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
