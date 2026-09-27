import type { Product } from "@/src/data/products";
import { X } from "lucide-react";

function CartProdcut({ name, sizes, image, link }: Product) {
  return (
    <>
      <div className="flex w-full min-w-0 items-center h-fit py-[10px]">
        <div className="flex min-w-0 flex-1">
          <img className="max-w-[90px] mx-[15px]" src={image} alt="" />
          <div className="flex-1 flex items-start w-full flex-col">
            <h1 className="font-semibold text-[16px]/[20px]">{name}</h1>
            <div className="text-[16px] text-gray-400">
              <p>Regular</p>
              <p className="text-[#ff5c21] font-bold">7,99</p>
            </div>
          </div>
        </div>
        <div className="flex-1 max-w-fit pr-[19px] py-[15px] text-gray-400 flex items-start h-full hover:text-black cursor-pointer">
          <X size={16} />
        </div>
      </div>
    </>
  );
}

export default CartProdcut;
