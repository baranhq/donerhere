import FoodCard from "../components/FoodCard";
import FoodCarousel from "../components/FoodCarousel";
import PromotionCarousel from "../components/PromotionCarousel";

import { CarouselItem } from "../../@/components/ui/carousel";

function Home() {
  return (
    <>
      <div className="flex justify-center lg:pl-[5px] lg:pr-[5px] mt-[10px] mb-[10px]">
        <div className="max-w-[1200px]">
          <PromotionCarousel>
            <CarouselItem>
              <a href="" className="flex w-full h-full ">
                <img
                  src="src/assets/promotions/promotion.png"
                  alt=""
                  className="flex justify-center align-middle items-center w-full h-full lg:rounded-[15px]"
                />
              </a>
            </CarouselItem>
            <CarouselItem>
              <a href="" className="flex w-full h-full ">
                <img
                  src="src/assets/promotions/promotion2.png"
                  alt=""
                  className="flex justify-center align-middle items-center w-full h-full lg:rounded-[15px]"
                />
              </a>
            </CarouselItem>
          </PromotionCarousel>

          <div className="mt-[10px]">
            <p className="text-center font-semibold text-[24px]">Döner Wraps</p>
            <div className="bg-[#ff5a1e] h-[2px] mb-[5px]"></div>
            <FoodCarousel>
              <CarouselItem>
                <div className="flex justify-center gap-[10px]">
                  <FoodCard
                    name={"Döner Wrap"}
                    price={"11,99€"}
                    image={"src/assets/products/doner-wrap.png"}
                    product={"/menu"}
                  ></FoodCard>
                  <FoodCard
                    name={"Döner Wrap 2"}
                    price={"7,99€"}
                    oldPrice={"10,99€"}
                    image={"src/assets/products/doner-wrap2.png"}
                    product={""}
                  ></FoodCard>
                  <FoodCard
                    name={"Döner Wrap"}
                    price={"11,99€"}
                    image={"src/assets/products/doner-wrap.png"}
                    product={""}
                  ></FoodCard>
                  <FoodCard
                    name={"Döner Wrap 2"}
                    price={"7,99€"}
                    oldPrice={"10,99€"}
                    image={"src/assets/products/doner-wrap2.png"}
                    product={""}
                  ></FoodCard>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="flex justify-center gap-[10px]">
                  <FoodCard
                    name={"Döner Wrap"}
                    price={"11,99€"}
                    image={"src/assets/products/doner-wrap.png"}
                    product={""}
                  ></FoodCard>
                  <FoodCard
                    name={"Döner Wrap 2"}
                    price={"7,99€"}
                    oldPrice={"10,99€"}
                    image={"src/assets/products/doner-wrap2.png"}
                    product={""}
                  ></FoodCard>
                  <FoodCard
                    name={"Döner Wrap"}
                    price={"11,99€"}
                    image={"src/assets/products/doner-wrap.png"}
                    product={""}
                  ></FoodCard>
                  <FoodCard
                    name={"Döner Wrap 2"}
                    price={"7,99€"}
                    oldPrice={"10,99€"}
                    image={"src/assets/products/doner-wrap2.png"}
                    product={""}
                  ></FoodCard>
                </div>
              </CarouselItem>
            </FoodCarousel>
            <div className="w-full flex justify-center m-[10px]">
              <a
                href="/menu"
                className="hover:bg-[#ff5a1e] hover:text-white p-[5px] pl-[15px] pr-[15px] border-[#ff5a1e] border-2 rounded-[10px]"
              >
                View Menu
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
