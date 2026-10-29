import { Pencil, Search, Trash2 } from "lucide-react";
import type { Category } from "../../data/categories";
import type { Product } from "../../data/products";
import { money } from "../../store/site";

type CatalogProps = {
  products: Product[];
  categories: Category[];
};

export function ProductTable({
  products,
  categories,
  search,
  onSearch,
  onEdit,
  onDelete,
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
    <section className="admin-section" aria-label="Products">
      <div className="admin-toolbar">
        <label className="admin-search">
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
      <div className="admin-table-wrap">
        <table className="admin-table">
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
                  <div className="admin-product-cell">
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
                      product.available ? "admin-badge" : "admin-badge muted"
                    }
                  >
                    {product.available ? "Available" : "Hidden"}
                  </span>
                </td>
                <td>
                  <div className="admin-actions">
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
          <p className="admin-empty">No products match your search.</p>
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
}: CatalogProps & {
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}) {
  return (
    <section className="admin-section" aria-label="Categories">
      <div className="admin-table-wrap">
        <table className="admin-table">
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
                  <div className="admin-actions">
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
