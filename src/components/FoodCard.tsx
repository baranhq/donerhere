type ProductCardData = {
  name: string;
  price: string;
  oldPrice?: string;
  image: string;
  product: string;
};

function ProductCard({
  name,
  price,
  oldPrice,
  image,
  product,
}: ProductCardData) {
  return (
    <div className="flex flex-col sm:w-[250px] sm:h-[380px] w-[150px] h-[280px] bg-gray-100 p-[15px] rounded-[15px]">
      <a href={product}>
        <div className="flex flex-col align-center overflow-hidden aspect-square">
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
      </a>
      <div className="mt-auto">
        <p className="text-end text-[14px] text-black line-through decoration-2 w-full h-[20px]">
          {oldPrice}
        </p>
        <div className="flex">
          <div className="flex-1 flex-col">
            <button className="flex justify-center font-semibold bg-orange-300 hover:bg-orange-500  C98C3D p-[5px] rounded-[5px] text-black sm:w-[50px]">
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
            </button>
          </div>
          <div className="flex1-1 flex-col">
            <p
              className={`text-end text-[24px] text-[#ff5c21]
            ${oldPrice ? "font-black" : "font-bold"}`}
            >
              {price}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
