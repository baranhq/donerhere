import { useSite } from "../store/site";
import PromotionCarousel from "../components/PromotionCarousel";

import { CarouselItem } from "../../@/components/ui/carousel";
import MenuCategoryCard from "../components/MenuCategoryCard";

function Home() {
  const {
    catalog: { categories, promotions },
  } = useSite();
  return (
    <>
      <div className="flex w-full min-w-0 justify-center mb-[10px] lg:mt-[10px] lg:px-[5px]">
        <div className="w-full min-w-0 max-w-[1200px]">
          {promotions.some((slide) => slide.available) && (
            <PromotionCarousel>
              {promotions
                .filter((slide) => slide.available)
                .map((slide) => (
                  <CarouselItem key={slide.id}>
                    {slide.link ? (
                      <a href={slide.link} className="flex h-full w-full">
                        <img
                          src={slide.image}
                          alt={slide.alt}
                          className="h-full w-full object-contain lg:rounded-[15px]"
                        />
                      </a>
                    ) : (
                      <img
                        src={slide.image}
                        alt={slide.alt}
                        className="h-full w-full object-contain lg:rounded-[15px]"
                      />
                    )}
                  </CarouselItem>
                ))}
            </PromotionCarousel>
          )}

          <div className="mt-[10px]">
            <p className="text-center font-semibold text-[24px]">
              What Would You Like?
            </p>
            <div className="bg-[#ff5a1e] h-[5px]"></div>
            <div className="lg:flex justify-center mt-[10px]">
              <div className="grid lg:grid-cols-4 gap-[15px]">
                {categories.map((categories) => (
                  <MenuCategoryCard
                    key={categories.slug}
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
