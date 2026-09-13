import MenuCategory from "../components/MenuCategory";
import { categories } from "../../data/categories";
import { products } from "../../data/products";
import { useParams } from "react-router";
import FoodCard from "../components/FoodCard";
import MenuCategoryButton from "../components/MenuCategoryButton";

function Menu() {
  const { category } = useParams();

  const filteredProducts = products.filter(
    (product) => product.category === category,
  );

  return (
    <>
      <div className="sm:h-[120px] h-[70px] flex items-center justify-center">
        <h2 className="text-center font-bold sm:text-[36px] text-[24px]">
          What Would You Like?
        </h2>
      </div>
      <div className="flex justify-center mb-[10px]">
        <div className="flex w-full max-w-[1200px] gap-[10px]">
          <div className="lg:flex hidden">
            <div className="flex flex-col items-center bg-gray-100 rounded-[15px] p-[15px] w-[280px] font-semibold h-fit">
              {categories.map((category) => (
                <MenuCategory key={category.slug} {...category} />
              ))}
            </div>
          </div>
          <div className="flex-1">
            <div className="lg:hidden block w-full h-[50px] ">
              <MenuCategoryButton>
                <div className="flex flex-col items-center rounded-[15px] w-fit font-semibold h-fit">
                  {categories.map((category) => (
                    <MenuCategory key={category.slug} {...category} />
                  ))}
                </div>
              </MenuCategoryButton>
            </div>
            <div className="flex lg:justify-start justify-center">
              <div className="flex flex-wrap justify-center gap-[5px] ">
                {filteredProducts.map((product) => (
                  <div
                    key={product.name}
                    className={!product.available ? "hidden" : ""}
                  >
                    <FoodCard
                      key={product.name}
                      name={product.name}
                      price={product.price}
                      oldPrice={product.oldPrice}
                      image={product.image}
                      link={product.link}
                      category={product.category}
                      sizes={product.sizes}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Menu;
