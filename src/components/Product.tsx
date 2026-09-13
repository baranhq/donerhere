import { ArrowLeft } from "lucide-react";
import type { Product } from "../../data/products";
import { Link, useParams } from "react-router";

function Products({
  name,
  price,
  oldPrice,
  description,
  image,
  available,
  sizes,
  link,
  category,
}: Product & { price: number; oldPrice?: number }) {
  const { size: selectedSize } = useParams();
  return (
    <>
      <div className="flex justify-center">
        <div className="max-w-[1200px] w-full">
          <Link
            className="border-2 py-[2px] px-[10px] rounded-[20px] border-orange-400 m-[5px] flex w-fit"
            to={`/menu/${category}`}
          >
            <ArrowLeft className="mr-[3px] w-[20px]" /> Go back
          </Link>
          <div className="lg:mx-[100px] md:m-0">
            <div className="flex flex-1 flex-col lg:flex-row lg:items-center lg:gap-0 gap-[50px]">
              <div className="flex justify-center lg:w-1/2 shrink-0">
                <img
                  src={image}
                  alt=""
                  className="w-[250px] h-[250px] lg:w-[400px] lg:h-[400px] object-contain shrink-0 bg-white"
                />
              </div>
              <div className="lg:w-1/2 flex justify-center">
                <div className="w-[90%]">
                  <h2 className="font-bold text-[24px]">{name}</h2>
                  <div className="flex flex-col">
                    <div className={available ? "flex flex-col" : "hidden"}>
                      <p className="text-end text-[14px] text-black line-through decoration-2 h-[20px]">
                        {oldPrice && `${oldPrice}€`}
                      </p>
                      <p
                        className={`text-end text-[24px] text-[#ff5c21]
            ${oldPrice ? "font-black" : "font-bold"}`}
                      >
                        {price}€
                      </p>
                      <div className="flex justify-center gap-[15px] my-[10px]">
                        {sizes?.map((size) => (
                          <Link
                            key={size.name}
                            to={`/product/${link}/${size.link}`}
                            className={`border-2 py-[2px] px-[10px] rounded-[20px] ${
                              size.link === selectedSize
                                ? "border-orange-400 bg-orange-100"
                                : "border-gray-300 bg-gray-200"
                            }`}
                          >
                            {size.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                    <div className="mt-[5px]">
                      <button
                        className={
                          !available
                            ? "flex justify-center font-semibold bg-gray-300 cursor-not-allowed p-[5px] rounded-[5px] text-black w-full"
                            : "flex justify-center font-semibold bg-orange-400 hover:bg-orange-500  p-[5px] rounded-[5px] text-black w-full"
                        }
                      >
                        {available ? (
                          <div className="flex">
                            <h2 className="w-full">Add to Cart</h2>
                            <div className="ml-[5px]">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                className="lucide lucide-shopping-cart-plus"
                              >
                                <path d="M16 5h6" />
                                <path d="M19 2v6" />
                                <path d="m2.05 2.05 1.099-.028a1 1 0 011.008.815l2.69 14.347A1 1 0 007.83 18H18" />
                                <path d="M4.564 5H12" />
                                <path d="M6.25 14h12.712a2 2 0 001.991-1.57l.172-1.041" />
                                <circle cx="18" cy="20" r="2" />
                                <circle cx="8" cy="20" r="2" />
                              </svg>
                            </div>
                          </div>
                        ) : (
                          "Unavailable"
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Products;
