import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import { useSite, api } from "../store/site";
import type { Order } from "../store/site";
import type { Product } from "../data/products";
import type { Category } from "../data/categories";
import OrderList from "../components/account/OrderList";
import CatalogEditor from "../components/admin/CatalogEditor";
import { ProductTable, CategoryTable } from "../components/admin/CatalogTables";
import {
  Boxes,
  ClipboardList,
  Folder,
  Plus,
  Trash2,
  Users,
  X,
} from "lucide-react";
import type { User } from "../store/site";
const blankProduct: Product = {
  name: "",
  link: "",
  description: "",
  seoTitle: "",
  seoDescription: "",
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
  const [tab, setTab] = useState<
    "products" | "categories" | "orders" | "users" | "editor"
  >("products");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });
  const [showUserForm, setShowUserForm] = useState(false);
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
    if (user?.role === "employee" || user?.role === "admin")
      api<Order[]>("/admin/orders")
        .then(setOrders)
        .catch((e) => setError(e.message));
    if (user?.role === "admin")
      api<User[]>("/admin/users")
        .then(setUsers)
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
  if (user.role !== "employee" && user.role !== "admin")
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
      setTab(kind);
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
      if (deleting.kind === "users") {
        setUsers(
          await api<User[]>("/admin/users/" + deleting.slug, "DELETE", {}),
        );
      } else {
        await api(
          "/admin/" + deleting.kind + "/" + deleting.slug,
          "DELETE",
          {},
        );
        await refresh();
      }
      setMessage("Deleted " + deleting.name);
      setDeleting(null);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function addUser(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      setUsers(await api<User[]>("/admin/users", "POST", newUser));
      setNewUser({ name: "", email: "", password: "", role: "customer" });
      setShowUserForm(false);
      setMessage("User created.");
    } catch (cause) {
      setError((cause as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function changeRole(id: number, role: User["role"]) {
    setError("");
    try {
      setUsers(await api<User[]>(`/admin/users/${id}`, "PATCH", { role }));
      setMessage("Role updated. The user must sign in again.");
    } catch (cause) {
      setError((cause as Error).message);
    }
  }
  async function uploadImage(file: File) {
    if (file.size > 2_000_000) {
      setError("Image must be 2 MB or smaller.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () =>
          resolve(String(reader.result).split(",")[1] || "");
        reader.onerror = () => reject(new Error("Could not read image"));
        reader.readAsDataURL(file);
      });
      const uploaded = await api<{ url: string }>("/admin/uploads", "POST", {
        data,
      });
      setProduct((current) =>
        current ? { ...current, image: uploaded.url } : current,
      );
      setCategory((current) =>
        current ? { ...current, image: uploaded.url } : current,
      );
      setMessage("Image uploaded. Save the item to use it.");
    } catch (cause) {
      setError((cause as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const sections: {
    id: "products" | "categories" | "orders" | "users";
    label: string;
    icon: typeof Boxes;
  }[] = [
    { id: "products", label: "Products", icon: Boxes },
    { id: "categories", label: "Categories", icon: Folder },
    { id: "orders", label: "Orders", icon: ClipboardList },
    ...(user.role === "admin"
      ? [{ id: "users" as const, label: "Users", icon: Users }]
      : []),
  ];
  return (
    <main className="admin-layout">
      <aside className="admin-sidebar" aria-label="Dashboard navigation">
        <div className="admin-sidebar-heading">Store management</div>
        <nav aria-label="Dashboard sections">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={
                tab === id ? "admin-nav-item active" : "admin-nav-item"
              }
              aria-current={tab === id ? "page" : undefined}
              onClick={() => {
                setTab(id);
                setProduct(null);
                setCategory(null);
                setError("");
              }}
            >
              <Icon size={19} aria-hidden="true" />
              {label}
            </button>
          ))}
        </nav>
        <p>Signed in as {user.name}</p>
      </aside>
      <div className="admin-content page">
        <div className="admin-page-heading">
          <div>
            <span className="eyebrow">DönerHere! / Dashboard</span>
            <h1>
              {tab === "editor"
                ? `${editing ? "Edit" : "Add"} ${product ? "product" : "category"}`
                : sections.find((section) => section.id === tab)?.label}
            </h1>
          </div>
          {tab === "products" && (
            <button
              className="button"
              onClick={() => {
                setProduct({
                  ...structuredClone(blankProduct),
                  category: catalog.categories[0]?.slug || "",
                });
                setCategory(null);
                setEditing(false);
                setTab("editor");
              }}
            >
              <Plus size={18} aria-hidden="true" /> Add product
            </button>
          )}
          {tab === "categories" && (
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
                setTab("editor");
              }}
            >
              <Plus size={18} aria-hidden="true" /> Add category
            </button>
          )}
          {tab === "users" && (
            <button
              className="button"
              onClick={() => setShowUserForm((open) => !open)}
            >
              <Plus size={18} aria-hidden="true" /> Add user
            </button>
          )}
        </div>
        {error && (
          <p role="alert" className="error">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="admin-status">
            {message}
          </p>
        )}
        {deleting && (
          <section
            className="panel stack"
            role="alertdialog"
            aria-label={`Delete ${deleting.name}`}
          >
            <h2>Delete {deleting.name}?</h2>
            <p>
              This cannot be undone. Existing order records will be preserved.
            </p>
            <div className="tabs">
              <button
                className="button danger"
                disabled={busy}
                onClick={remove}
              >
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
          <ProductTable
            products={catalog.products}
            categories={catalog.categories}
            search={search}
            onSearch={setSearch}
            onEdit={(entry) => {
              setProduct(structuredClone(entry));
              setCategory(null);
              setEditing(true);
              setTab("editor");
            }}
            onDelete={(entry) =>
              setDeleting({
                kind: "products",
                slug: entry.link,
                name: entry.name,
              })
            }
          />
        )}
        {tab === "categories" && (
          <CategoryTable
            products={catalog.products}
            categories={catalog.categories}
            onEdit={(entry) => {
              setCategory({ ...entry });
              setProduct(null);
              setEditing(true);
              setTab("editor");
            }}
            onDelete={(entry) =>
              setDeleting({
                kind: "categories",
                slug: entry.slug,
                name: entry.name,
              })
            }
          />
        )}
        {tab === "orders" && (
          <section className="admin-section">
            <button
              className="button secondary"
              onClick={() =>
                api<Order[]>("/admin/orders")
                  .then(setOrders)
                  .catch((cause) => setError(cause.message))
              }
            >
              Refresh orders
            </button>
            <OrderList orders={orders} />
          </section>
        )}
        {tab === "users" && user.role === "admin" && (
          <section className="admin-section">
            {showUserForm && (
              <form className="panel stack admin-user-form" onSubmit={addUser}>
                <div className="admin-form-title">
                  <h2>Add user</h2>
                  <button
                    type="button"
                    aria-label="Close add user form"
                    onClick={() => setShowUserForm(false)}
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="admin-form-grid">
                  <label>
                    Name
                    <input
                      required
                      maxLength={100}
                      value={newUser.name}
                      onChange={(event) =>
                        setNewUser({ ...newUser, name: event.target.value })
                      }
                    />
                  </label>
                  <label>
                    Email
                    <input
                      required
                      type="email"
                      autoComplete="off"
                      value={newUser.email}
                      onChange={(event) =>
                        setNewUser({ ...newUser, email: event.target.value })
                      }
                    />
                  </label>
                  <label>
                    Initial password
                    <input
                      required
                      type="password"
                      minLength={12}
                      maxLength={128}
                      autoComplete="new-password"
                      value={newUser.password}
                      onChange={(event) =>
                        setNewUser({ ...newUser, password: event.target.value })
                      }
                    />
                  </label>
                  <label>
                    Role
                    <select
                      value={newUser.role}
                      onChange={(event) =>
                        setNewUser({ ...newUser, role: event.target.value })
                      }
                    >
                      <option value="customer">Customer</option>
                      <option value="employee">Employee</option>
                      <option value="admin">Admin</option>
                    </select>
                  </label>
                </div>
                <button className="button" disabled={busy}>
                  {busy ? "Creating…" : "Create user"}
                </button>
              </form>
            )}
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((entry) => (
                    <tr key={entry.id}>
                      <td>
                        <strong>{entry.name}</strong>
                      </td>
                      <td>{entry.email}</td>
                      <td>
                        <select
                          aria-label={`Role for ${entry.name}`}
                          value={entry.role}
                          onChange={(event) =>
                            void changeRole(
                              entry.id,
                              event.target.value as User["role"],
                            )
                          }
                        >
                          <option value="customer">Customer</option>
                          <option value="employee">Employee</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button
                            aria-label={`Delete ${entry.name}`}
                            disabled={entry.id === user.id}
                            onClick={() =>
                              setDeleting({
                                kind: "users",
                                slug: String(entry.id),
                                name: entry.name,
                              })
                            }
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
        {tab === "editor" && (product || category) && (
          <CatalogEditor
            product={product}
            category={category}
            catalog={catalog}
            editing={editing}
            busy={busy}
            setProduct={setProduct}
            setCategory={setCategory}
            onSave={save}
            onUpload={uploadImage}
            onClose={() => {
              setTab(product ? "products" : "categories");
              setProduct(null);
              setCategory(null);
            }}
          />
        )}
      </div>
    </main>
  );
}
