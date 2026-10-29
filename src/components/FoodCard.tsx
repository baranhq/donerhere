import QuickAdd from "./QuickAdd";
import type { Product } from "../data/products";
import { Link } from "react-router";

function ProductCard({ name, image, link, sizes }: Product) {
  const cheapestSize = sizes
    ?.filter((size) => size.available)
    .sort((a, b) => a.price - b.price)[0];
  return (
    <div className="transition-colors flex flex-col sm:w-[250px] sm:h-[380px] w-[150px] h-[280px] bg-gray-100 p-[15px] rounded-[15px]">
      <Link to={`/product/${link}/${cheapestSize?.link}`}>
        <div className="flex flex-col items-center overflow-hidden aspect-square">
          <img
            className="sm:w-[220px] w-[180px] sm:h-[220px] h-[200px] object-contain w-full h-full bg-white rounded-[15px]"
            src={image}
            alt=""
          />
        </div>
        <div className="flex flex-col mt-[10px] flex-1">
          <h2 className="text-[18px] line-clamp-2 text-start font-semibold overflow-hidden ">
            {name}
          </h2>
        </div>
      </Link>
      <div className="mt-auto flex items-end justify-between gap-3">
        <QuickAdd productLink={link} />
        <div className="text-right">
          <p className="mb-1 text-sm leading-5">Starting at</p>
          <p className="text-2xl leading-none font-bold text-[#ff5c21]">
            {cheapestSize ? `${cheapestSize.price.toFixed(2)}€` : "Unavailable"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
