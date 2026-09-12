import MenuCategory from "../components/MenuCategory";
import { categories } from "../../menuData/categories";
import { products } from "../../menuData/products";
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
      <div className="flex justify-center mt-[10px] mb-[10px]">
        <div className="flex w-full max-w-[1200px] gap-[10px]">
          <div className="lg:flex hidden">
            <div className="flex flex-col items-center bg-gray-100 rounded-[15px] p-[15px] w-[280px] font-semibold h-fit">
              {categories.map((category) => (
                <MenuCategory key={category.slug} {...category} />
              ))}
            </div>
          </div>
          <div className="flex-1">
            <div className="lg:hidden block w-full h-[50px]">
              <MenuCategoryButton>
                {categories.map((category) => (
                  <MenuCategory key={category.slug} {...category} />
                ))}
              </MenuCategoryButton>
            </div>
            <div className="flex lg:justify-start justify-center">
              <div className="flex flex-wrap justify-center gap-[5px]">
                {filteredProducts.map((product) => (
                  <FoodCard
                    key={product.name}
                    name={product.name}
                    price={product.price}
                    oldPrice={product.oldPrice}
                    image={product.image}
                    product={product.name}
                  />
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
