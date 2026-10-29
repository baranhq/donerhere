import { useSite } from "../store/site";
import { useParams } from "react-router";
import MenuCategory from "../components/MenuCategory";
import FoodCard from "../components/FoodCard";
import { filterPanel } from "../components/filters/styles";
export default function Menu() {
  const {
    catalog: { products, categories },
  } = useSite();
  const { category } = useParams();
  const filtered = products.filter(
    (product) => product.category === category && product.available,
  );
  return (
    <main className="mx-auto max-w-[1200px] px-4 py-8 lg:py-10">
      <h1 className="mb-8 text-center text-3xl font-bold sm:text-4xl">
        What would you like?
      </h1>
      <div className="grid items-start gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <nav
          aria-label="Menu categories"
          className={`${filterPanel} lg:sticky lg:top-24`}
        >
          <h2 className="sr-only">Browse the menu</h2>
          <div className="flex gap-1 overflow-x-auto lg:flex-col">
            {categories.map((entry) => (
              <MenuCategory key={entry.slug} {...entry} />
            ))}
          </div>
        </nav>
        <section
          aria-label={
            categories.find((entry) => entry.slug === category)?.name ||
            "Products"
          }
          className="flex flex-wrap justify-center gap-3 lg:justify-start"
        >
          {filtered.map((product) => (
            <FoodCard
              key={product.link}
              name={product.name}
              image={product.image}
              link={product.link}
              category={product.category}
              sizes={product.sizes}
            />
          ))}
          {!filtered.length && (
            <p className="p-6 text-stone-600">
              No available products in this category.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
