import type { Product } from "../../data/products";

function Products({
  name,
  price,
  oldPrice,
  description,
  image,
  category,
}: Product) {
  return (
    <>
      <div className="max-w-[1200px]">
        <div className="ml-[15px] mr-[15px]">
          <div className="flex justify-center">
            <img
              src={image}
              alt=""
              className="w-[250px] h-[250px] object-contain"
            />
          </div>
          <div>
            <h2 className="font-black">{name}</h2>
          </div>
          <div className="flex flex1-1 flex-col h-[60px]">
            <p className="text-end text-[14px] text-black line-through decoration-2 w-full h-[20px]">
              {oldPrice}
            </p>
            <p
              className={`text-end text-[24px] text-[#ff5c21]
            ${oldPrice ? "font-black" : "font-bold"}`}
            >
              {price}
            </p>
            <div className="mt-[5px]">
              <button className="flex justify-center font-semibold bg-orange-400 hover:bg-orange-500  C98C3D p-[5px] rounded-[5px] text-black sm:w-[50px] w-full max-w-[300px]">
                Add to Cart
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
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Products;
