import type { Dispatch, FormEvent, SetStateAction } from "react";
import type { Product } from "../../data/products";
import type { Category } from "../../data/categories";
import type { Catalog } from "../../store/site";
import { X } from "lucide-react";

type Props = {
  product: Product | null;
  category: Category | null;
  catalog: Catalog;
  editing: boolean;
  busy: boolean;
  setProduct: Dispatch<SetStateAction<Product | null>>;
  setCategory: Dispatch<SetStateAction<Category | null>>;
  onSave: (event: FormEvent) => void;
  onClose: () => void;
  onUpload: (file: File) => void;
};

export default function CatalogEditor({
  product,
  category,
  catalog,
  editing,
  busy,
  setProduct,
  setCategory,
  onSave,
  onClose,
  onUpload,
}: Props) {
  return (
    <section className="panel editor">
      <div className="admin-form-title">
        <div>
          <span className="eyebrow">Catalog editor</span>
          <h2>
            {editing ? "Edit" : "Add"} {product ? "product" : "category"}
          </h2>
        </div>
        <button type="button" aria-label="Close editor" onClick={onClose}>
          <X size={21} />
        </button>
      </div>
      <form className="stack" onSubmit={onSave}>
        <label>
          Name
          <input
            required
            maxLength={100}
            value={(product || category)!.name}
            onChange={(e) =>
              product
                ? setProduct({ ...product, name: e.target.value })
                : setCategory({ ...category!, name: e.target.value })
            }
          />
        </label>
        <label>
          Slug (lowercase letters, numbers and hyphens)
          <input
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            maxLength={80}
            disabled={editing}
            value={product ? product.link : category!.slug}
            onChange={(e) =>
              product
                ? setProduct({ ...product, link: e.target.value })
                : setCategory({ ...category!, slug: e.target.value })
            }
          />
        </label>
        <label>
          Image URL (HTTPS, /products/ or /uploads/)
          <input
            required
            maxLength={500}
            value={(product || category)!.image}
            onChange={(e) =>
              product
                ? setProduct({ ...product, image: e.target.value })
                : setCategory({ ...category!, image: e.target.value })
            }
          />
        </label>
        <label className="admin-upload">
          Upload image (PNG, JPEG or WebP, up to 2 MB)
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            disabled={busy}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void onUpload(file);
              event.target.value = "";
            }}
          />
        </label>
        <img
          className="admin-image-preview"
          src={(product || category)!.image}
          alt="Current catalog item preview"
        />
        {product && (
          <>
            <label>
              Category
              <select
                required
                value={product.category}
                onChange={(e) =>
                  setProduct({ ...product, category: e.target.value })
                }
              >
                {catalog.categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Description
              <textarea
                maxLength={3000}
                value={product.description}
                onChange={(e) =>
                  setProduct({ ...product, description: e.target.value })
                }
              />
            </label>
            <fieldset className="admin-seo stack">
              <legend>Search appearance</legend>
              <p>
                Optional page title and description shown in search results.
                Leave blank to use the product name and description.
              </p>
              <label>
                SEO title <small>{product.seoTitle?.length || 0}/70</small>
                <input
                  maxLength={70}
                  value={product.seoTitle || ""}
                  onChange={(event) =>
                    setProduct({
                      ...product,
                      seoTitle: event.target.value,
                    })
                  }
                />
              </label>
              <label>
                SEO description{" "}
                <small>{product.seoDescription?.length || 0}/160</small>
                <textarea
                  maxLength={160}
                  value={product.seoDescription || ""}
                  onChange={(event) =>
                    setProduct({
                      ...product,
                      seoDescription: event.target.value,
                    })
                  }
                />
              </label>
              <div className="admin-search-preview">
                <small>
                  donerhere · /product/{product.link || "product"}/regular
                </small>
                <strong>
                  {product.seoTitle ||
                    `${product.name || "Product name"} | DönerHere!`}
                </strong>
                <p>
                  {product.seoDescription ||
                    product.description ||
                    "Add a product description to preview your search snippet."}
                </p>
              </div>
            </fieldset>
            <label>
              Ingredients (one per line)
              <textarea
                value={product.ingredients?.join("\n")}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    ingredients: e.target.value.split("\n"),
                  })
                }
              />
            </label>
            <label className="check">
              <input
                type="checkbox"
                checked={product.available}
                onChange={(e) =>
                  setProduct({ ...product, available: e.target.checked })
                }
              />
              Product available
            </label>
            <h3>Sizes and prices</h3>
            {product.sizes?.map((s, i) => (
              <fieldset className="size-grid" key={i}>
                <legend>Size {i + 1}</legend>
                <label>
                  Size
                  <select
                    value={s.name}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        sizes: product.sizes!.map((v, j) =>
                          j === i
                            ? {
                                ...v,
                                name: e.target.value as typeof s.name,
                                link: e.target.value.toLowerCase(),
                              }
                            : v,
                        ),
                      })
                    }
                  >
                    {["Small", "Regular", "Large"].map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                </label>
                {(["price", "oldPrice", "weight"] as const).map((field) => (
                  <label key={field}>
                    {field === "price"
                      ? "Price (€)"
                      : field === "oldPrice"
                        ? "Previous price (€, optional)"
                        : "Weight"}
                    <input
                      type="number"
                      step={field === "weight" ? "any" : "0.01"}
                      min="0.01"
                      max={field === "weight" ? 100000 : 10000}
                      required={field !== "oldPrice"}
                      value={s[field] ?? ""}
                      onChange={(e) =>
                        setProduct({
                          ...product,
                          sizes: product.sizes!.map((v, j) =>
                            j === i
                              ? {
                                  ...v,
                                  [field]:
                                    e.target.value === ""
                                      ? undefined
                                      : Number(e.target.value),
                                }
                              : v,
                          ),
                        })
                      }
                    />
                  </label>
                ))}
                <label>
                  Unit
                  <select
                    value={s.unit}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        sizes: product.sizes!.map((v, j) =>
                          j === i
                            ? {
                                ...v,
                                unit: e.target.value as typeof s.unit,
                              }
                            : v,
                        ),
                      })
                    }
                  >
                    {["g", "kg", "ml", "l"].map((u) => (
                      <option key={u}>{u}</option>
                    ))}
                  </select>
                </label>
                <label className="check">
                  <input
                    type="checkbox"
                    checked={s.available}
                    onChange={(e) =>
                      setProduct({
                        ...product,
                        sizes: product.sizes!.map((v, j) =>
                          j === i ? { ...v, available: e.target.checked } : v,
                        ),
                      })
                    }
                  />
                  Size available
                </label>
                <button
                  type="button"
                  className="text-link"
                  disabled={product.sizes!.length === 1}
                  onClick={() =>
                    setProduct({
                      ...product,
                      sizes: product.sizes!.filter((_, j) => j !== i),
                    })
                  }
                >
                  Remove size
                </button>
              </fieldset>
            ))}
            <button
              type="button"
              className="text-link"
              disabled={product.sizes!.length >= 3}
              onClick={() => {
                const name = (["Small", "Regular", "Large"] as const).find(
                  (n) => !product.sizes!.some((s) => s.name === n),
                )!;
                setProduct({
                  ...product,
                  sizes: [
                    ...product.sizes!,
                    {
                      name,
                      link: name.toLowerCase(),
                      price: 1,
                      weight: 100,
                      unit: "g",
                      available: true,
                    },
                  ],
                });
              }}
            >
              Add size
            </button>
          </>
        )}
        <div className="tabs">
          <button className="button" disabled={busy}>
            {busy ? "Saving…" : "Save changes"}
          </button>
          <button type="button" className="button secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
