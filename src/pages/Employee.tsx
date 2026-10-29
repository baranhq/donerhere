import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import { useSite, api, money } from "../store/site";
import type { Order } from "../store/site";
import type { Product } from "../data/products";
import type { Category } from "../data/categories";
import OrderList from "../components/account/OrderList";
const blankProduct: Product = {
  name: "",
  link: "",
  description: "",
  image: "/products/doner-wrap.png",
  category: "",
  available: true,
  ingredients: [],
  sizes: [
    {
      name: "Regular",
      link: "regular",
      weight: 350,
      unit: "g",
      price: 1,
      available: true,
    },
  ],
};
export default function Employee() {
  const { user, catalog, refresh } = useSite();
  const [tab, setTab] = useState("products");
  const [orders, setOrders] = useState<Order[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [deleting, setDeleting] = useState<{
    kind: string;
    slug: string;
    name: string;
  } | null>(null);
  useEffect(() => {
    if (user?.role === "employee")
      api<Order[]>("/admin/orders")
        .then(setOrders)
        .catch((e) => setError(e.message));
  }, [user]);
  if (!user)
    return (
      <main className="page">
        <h1>Employee dashboard</h1>
        <p>Sign in with an employee account.</p>
        <Link to="/account" className="button">
          Sign in
        </Link>
      </main>
    );
  if (user.role !== "employee")
    return (
      <main className="page">
        <h1>Access denied</h1>
        <p>This dashboard is restricted to employees.</p>
      </main>
    );
  async function save(e: FormEvent) {
    e.preventDefault();
    if (!product && !category) return;
    setBusy(true);
    setError("");
    try {
      const kind = product ? "products" : "categories";
      const entry = product || category!;
      const slug = product ? product.link : category!.slug;
      await api(
        "/admin/" + kind + (editing ? "/" + slug : ""),
        editing ? "PUT" : "POST",
        entry,
      );
      await refresh();
      setProduct(null);
      setCategory(null);
      setMessage("Changes saved.");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    if (!deleting) return;
    setBusy(true);
    setError("");
    try {
      await api("/admin/" + deleting.kind + "/" + deleting.slug, "DELETE", {});
      await refresh();
      setMessage("Deleted " + deleting.name);
      setDeleting(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="page">
      <h1>Employee dashboard</h1>
      <p>Manage the menu and view orders.</p>
      <div className="tabs" role="group" aria-label="Dashboard sections">
        {["products", "categories", "orders"].map((t) => (
          <button
            key={t}
            className={tab === t ? "button" : "button secondary"}
            onClick={() => {
              setTab(t);
              setProduct(null);
              setCategory(null);
              setError("");
            }}
          >
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      <p role="alert" className="error">
        {error}
      </p>
      <p role="status">{message}</p>
      {deleting && (
        <section className="panel stack">
          <h2>Delete {deleting.name}?</h2>
          <p>
            This cannot be undone. Existing order records will be preserved.
          </p>
          <div className="tabs">
            <button className="button danger" disabled={busy} onClick={remove}>
              Confirm deletion
            </button>
            <button
              className="button secondary"
              disabled={busy}
              onClick={() => setDeleting(null)}
            >
              Cancel
            </button>
          </div>
        </section>
      )}
      {tab === "products" && (
        <>
          <button
            className="button"
            onClick={() => {
              setProduct({
                ...structuredClone(blankProduct),
                category: catalog.categories[0]?.slug || "",
              });
              setCategory(null);
              setEditing(false);
            }}
          >
            Add product
          </button>
          <div className="admin-grid">
            {catalog.products.map((p) => (
              <article className="panel" key={p.link}>
                <img className="admin-image" src={p.image} alt="" />
                <h2>{p.name}</h2>
                <p>
                  {p.category} · {p.available ? "Available" : "Unavailable"}
                </p>
                <p>
                  {p.sizes
                    ?.map(
                      (s) => `${s.name}: ${money(Math.round(s.price * 100))}`,
                    )
                    .join(" · ")}
                </p>
                <div className="tabs">
                  <button
                    className="text-link"
                    onClick={() => {
                      setProduct(structuredClone(p));
                      setCategory(null);
                      setEditing(true);
                    }}
                  >
                    Edit {p.name}
                  </button>
                  <button
                    className="text-link"
                    onClick={() =>
                      setDeleting({
                        kind: "products",
                        slug: p.link,
                        name: p.name,
                      })
                    }
                  >
                    Delete {p.name}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
      {tab === "categories" && (
        <>
          <button
            className="button"
            onClick={() => {
              setCategory({
                name: "",
                slug: "",
                image: "/products/doner-wrap.png",
              });
              setProduct(null);
              setEditing(false);
            }}
          >
            Add category
          </button>
          <div className="admin-grid">
            {catalog.categories.map((c) => (
              <article className="panel" key={c.slug}>
                <h2>{c.name}</h2>
                <p>{c.slug}</p>
                <button
                  className="text-link"
                  onClick={() => {
                    setCategory({ ...c });
                    setProduct(null);
                    setEditing(true);
                  }}
                >
                  Edit {c.name}
                </button>
                <button
                  className="text-link"
                  onClick={() =>
                    setDeleting({
                      kind: "categories",
                      slug: c.slug,
                      name: c.name,
                    })
                  }
                >
                  Delete {c.name}
                </button>
              </article>
            ))}
          </div>
        </>
      )}
      {tab === "orders" && (
        <>
          <button
            className="text-link"
            onClick={() =>
              api<Order[]>("/admin/orders")
                .then(setOrders)
                .catch((e) => setError(e.message))
            }
          >
            Refresh orders
          </button>
          <OrderList orders={orders} />
        </>
      )}
      {(product || category) && (
        <section className="panel editor">
          <h2>
            {editing ? "Edit" : "Add"} {product ? "product" : "category"}
          </h2>
          <form className="stack" onSubmit={save}>
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
              Image URL (HTTPS or /products/filename)
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
            <p>
              Use an image you own or have permission to redistribute, and
              update the Licenses page when adding third-party assets.
            </p>
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
                              j === i
                                ? { ...v, available: e.target.checked }
                                : v,
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
              <button
                type="button"
                className="button secondary"
                onClick={() => {
                  setProduct(null);
                  setCategory(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}
    </main>
  );
}
