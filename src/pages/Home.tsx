import MenuCategoryCard from "../components/MenuCategoryCard";
import PromotionCarousel from "../components/PromotionCarousel";

function Home() {
  return (
    <div className="flex justify-center lg:pl-[5px] lg:pr-[5px]">
      <div className="max-w-[1200px]">
        <PromotionCarousel></PromotionCarousel>
        <div className="lg:flex justify-center mt-[10px]">
          <div className="grid lg:grid-cols-4 gap-[15px]">
            <MenuCategoryCard
              category={"Döner Wraps"}
              image={"src/assets/products/doner-wrap.png"}
              link={"/menu/Doner-Wraps"}
            ></MenuCategoryCard>
            <MenuCategoryCard
              category={"Fries"}
              image={"src/assets/products/fries.png"}
              link={"/menu"}
            ></MenuCategoryCard>
            <MenuCategoryCard
              category={"Desserts"}
              image={"src/assets/products/baklava.png"}
              link={"/menu"}
            ></MenuCategoryCard>
            <MenuCategoryCard
              category={"Drinks"}
              image={"src/assets/products/ayran.png"}
              link={"/menu"}
            ></MenuCategoryCard>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
