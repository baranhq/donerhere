import MenuCategoryCard from "../components/MenuCategoryCard";
import PromotionCarousel from "../components/PromotionCarousel";

function Home() {
  return (
    <div className="flex justify-center lg:pl-[5px] lg:pr-[5px]">
      <div className="max-w-[1200px]">
        <PromotionCarousel></PromotionCarousel>
        <div className="mt-[10px]">
          <p className="text-center font-semibold text-[24px]">
            Popular Choices
          </p>
          <div className="bg-[#ff5a1e] h-[5px]"></div>
          <div className="lg:flex justify-center mt-[10px]">
            <div className="grid lg:grid-cols-4 gap-[15px]">
              <MenuCategoryCard
                category={"Döner Wraps"}
                image={"src/assets/products/doner-wrap.png"}
                link={"/menu/doner"}
              ></MenuCategoryCard>
              <MenuCategoryCard
                category={"Fries"}
                image={"src/assets/products/fries.png"}
                link={"/menu/fries"}
              ></MenuCategoryCard>
              <MenuCategoryCard
                category={"Desserts"}
                image={"src/assets/products/baklava.png"}
                link={"/menu/desserts"}
              ></MenuCategoryCard>
              <MenuCategoryCard
                category={"Drinks"}
                image={"src/assets/products/ayran.png"}
                link={"/menu/drinks"}
              ></MenuCategoryCard>
            </div>
          </div>
          <div className="w-full flex justify-center m-[10px]">
            <a
              href="/menu"
              className="hover:bg-[#ff5a1e] hover:text-white p-[5px] pl-[15px] pr-[15px] border-[#ff5a1e] border-2 rounded-[20px]"
            >
              View Menu
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
