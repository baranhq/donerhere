import { ui } from "../../styles/ui";
import { Pencil, Search, Trash2 } from "lucide-react";
import type { Category } from "../../data/categories";
import type { Product } from "../../data/products";
import { money } from "../../store/site";

type CatalogProps = {
  products: Product[];
  categories: Category[];
  readOnly?: boolean;
};

export function ProductTable({
  products,
  categories,
  search,
  onSearch,
  onEdit,
  onDelete,
  readOnly = false,
}: CatalogProps & {
  search: string;
  onSearch: (query: string) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}) {
  const matching = products.filter((product) =>
    [product.name, product.link, product.category].some((value) =>
      value.toLowerCase().includes(search.toLowerCase().trim()),
    ),
  );
  return (
    <section className="min-w-0" aria-label="Products">
      <div className="mb-[17px] flex items-center justify-between gap-3.5 text-[#765a4f] max-[560px]:flex-col max-[560px]:items-start">
        <label className="flex! w-full max-w-[390px] flex-row! items-center gap-[9px]! rounded-[9px] border border-[#e8cfc3] bg-white px-3 text-[#9d5030] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[#b14a18] [&_input]:border-0! [&_input]:bg-transparent! [&_input]:px-0! [&_input]:py-[11px]! [&_input]:font-normal [&_input]:outline-0! [&_input]:shadow-none!">
          <Search size={19} aria-hidden="true" />
          <input
            type="search"
            placeholder="Search products, slugs or categories"
            aria-label="Search products"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
          />
        </label>
        <span>{matching.length} products</span>
      </div>
      <div className="overflow-x-auto rounded-[13px] border border-[#eadbd3]">
        <table className={`${ui.table}`}>
          <thead>
            <tr>
              <th scope="col">Product</th>
              <th scope="col">Category</th>
              <th scope="col">Prices</th>
              <th scope="col">Status</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {matching.map((product) => (
              <tr key={product.link}>
                <td>
                  <div className="flex min-w-[170px] items-center gap-[13px] [&_img]:size-[58px] [&_img]:rounded-lg [&_img]:bg-[#fff5ee] [&_img]:object-contain [&_small]:mt-[3px] [&_small]:block [&_small]:text-[#80695d]">
                    <img src={product.image} alt="" />
                    <div>
                      <strong>{product.name}</strong>
                      <small>/{product.link}</small>
                    </div>
                  </div>
                </td>
                <td>
                  {categories.find(
                    (category) => category.slug === product.category,
                  )?.name || product.category}
                </td>
                <td>
                  {product.sizes
                    ?.map(
                      (size) =>
                        `${size.name} ${money(Math.round(size.price * 100))}`,
                    )
                    .join(" · ")}
                </td>
                <td>
                  <span
                    className={
                      product.available
                        ? "inline-flex rounded-full bg-[#e8f5e9] px-[9px] py-[5px] text-[.8rem] font-bold text-[#206329]"
                        : "inline-flex rounded-full bg-[#e8f5e9] px-[9px] py-[5px] text-[.8rem] font-bold text-[#206329] bg-[#f1eae6]! text-[#6f6058]!"
                    }
                  >
                    {product.available ? "Available" : "Hidden"}
                  </span>
                </td>
                <td>
                  <div
                    className={`${readOnly ? "hidden" : "flex"} justify-end gap-1 [&_button]:inline-grid [&_button]:size-9 [&_button]:place-items-center [&_button]:rounded-lg [&_button]:text-[#704e3e] [&_button:hover]:bg-[#ffe7da] [&_button:hover]:text-[#a4380a]`}
                  >
                    <button
                      aria-label={`Edit ${product.name}`}
                      title={`Edit ${product.name}`}
                      onClick={() => onEdit(product)}
                    >
                      <Pencil size={18} aria-hidden="true" />
                    </button>
                    <button
                      aria-label={`Delete ${product.name}`}
                      title={`Delete ${product.name}`}
                      onClick={() => onDelete(product)}
                    >
                      <Trash2 size={18} aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {matching.length === 0 && (
          <p className="p-6 text-center">No products match your search.</p>
        )}
      </div>
    </section>
  );
}

export function CategoryTable({
  products,
  categories,
  onEdit,
  onDelete,
  readOnly = false,
}: CatalogProps & {
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}) {
  return (
    <section className="min-w-0" aria-label="Categories">
      <div className="overflow-x-auto rounded-[13px] border border-[#eadbd3]">
        <table className={`${ui.table}`}>
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">Slug</th>
              <th scope="col">Products</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.slug}>
                <td>
                  <strong>{category.name}</strong>
                </td>
                <td>/{category.slug}</td>
                <td>
                  {
                    products.filter(
                      (product) => product.category === category.slug,
                    ).length
                  }
                </td>
                <td>
                  <div
                    className={`${readOnly ? "hidden" : "flex"} justify-end gap-1 [&_button]:inline-grid [&_button]:size-9 [&_button]:place-items-center [&_button]:rounded-lg [&_button]:text-[#704e3e] [&_button:hover]:bg-[#ffe7da] [&_button:hover]:text-[#a4380a]`}
                  >
                    <button
                      aria-label={`Edit ${category.name}`}
                      onClick={() => onEdit(category)}
                    >
                      <Pencil size={18} aria-hidden="true" />
                    </button>
                    <button
                      aria-label={`Delete ${category.name}`}
                      onClick={() => onDelete(category)}
                    >
                      <Trash2 size={18} aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
