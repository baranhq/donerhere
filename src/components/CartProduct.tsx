import type { Product } from "@/src/data/products";
import { X } from "lucide-react";
import useCart from "../store/cart";

function CartProduct({
  product,
  selectedSize,
  index,
}: {
  product: Product;
  selectedSize: NonNullable<Product["sizes"]>[number];
  index: number;
}) {
  const { removeFromCart } = useCart();
  return (
    <>
      <div className="flex w-full min-w-0 items-center min-h-[100px] py-[10px]">
        <div className="flex min-w-0 flex-1">
          <img
            className="min-w-[90px] max-w-[90px] min-h-[90px] max-h-[90px] mx-[15px] object-contain"
            src={product.image}
            alt=""
          />
          <div className="flex-1 flex items-start w-full flex-col">
            <h1 className="font-semibold text-[16px]/[20px]">{product.name}</h1>
            <div className="flex flex-1 flex-col text-[16px] text-gray-400">
              <p>{selectedSize.name}</p>
              <p className="text-[#ff5c21] font-bold mt-auto text-[18px]">
                {selectedSize.price}
              </p>
            </div>
          </div>
        </div>
        <div className="flex-1 max-w-fit pr-[19px] py-[15px] text-gray-400 flex items-start h-full hover:text-black cursor-pointer">
          <X size={16} onClick={() => removeFromCart(index)} />
        </div>
      </div>
    </>
  );
}

export default CartProduct;
