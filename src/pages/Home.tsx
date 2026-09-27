import PromotionCarousel from "../components/PromotionCarousel";
import { promotions } from "../data/promotions";

import { CarouselItem } from "../../@/components/ui/carousel";
import MenuCategoryCard from "../components/MenuCategoryCard";
import { categories } from "../data/categories";

function Home() {
  return (
    <>
      <div className="flex w-full min-w-0 justify-center mb-[10px] lg:mt-[10px] lg:px-[5px]">
        <div className="w-full min-w-0 max-w-[1200px]">
          <PromotionCarousel>
            {promotions.map((promotions, index) => (
              <CarouselItem key={index}>
                <a href={promotions.link} className="flex w-full h-full ">
                  <img
                    src={promotions.image}
                    alt=""
                    className="flex justify-center align-middle items-center w-full h-full lg:rounded-[15px]"
                  />
                </a>
              </CarouselItem>
            ))}
          </PromotionCarousel>

          <div className="mt-[10px]">
            <p className="text-center font-semibold text-[24px]">
              What Would You Like?
            </p>
            <div className="bg-[#ff5a1e] h-[5px]"></div>
            <div className="lg:flex justify-center mt-[10px]">
              <div className="grid lg:grid-cols-4 gap-[15px]">
                {categories.map((categories) => (
                  <MenuCategoryCard
                    category={categories.name}
                    image={categories.image}
                    link={`/menu/${categories.slug}`}
                  />
                ))}
              </div>
            </div>
            <div className="flex w-full justify-center my-[10px]">
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
