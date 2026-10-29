import { ui } from "../styles/ui";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import { useSite, api } from "../store/site";
import type { Order } from "../store/site";
import type { Product } from "../data/products";
import type { Category } from "../data/categories";
import AccessManager from "../components/admin/AccessManager";
import Inbox from "../components/admin/Inbox";
import PolicyEditor from "../components/admin/PolicyEditor";
import Analytics from "../components/admin/Analytics";
import StaffOrders from "../components/admin/StaffOrders";
import CatalogEditor from "../components/admin/CatalogEditor";
import { ProductTable, CategoryTable } from "../components/admin/CatalogTables";
import {
  BarChart3,
  Mail,
  ShieldCheck,
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
    | "products"
    | "categories"
    | "orders"
    | "users"
    | "analytics"
    | "messages"
    | "access"
    | "policies"
    | "editor"
  >("products");
  const canEditCatalog = Boolean(user?.permissions?.includes("catalog.write"));
  const canReadOrders = Boolean(user?.permissions?.includes("orders.read"));
  const canEditOrders = Boolean(user?.permissions?.includes("orders.write"));
  const canReadMessages = Boolean(user?.permissions?.includes("messages.read"));
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
    if (canReadOrders)
      api<Order[]>("/admin/orders")
        .then(setOrders)
        .catch((e) => setError(e.message));
    if (user?.role === "admin")
      api<User[]>("/admin/users")
        .then(setUsers)
        .catch((e) => setError(e.message));
  }, [user, canReadOrders]);
  if (!user)
    return (
      <main className={`${ui.page}`}>
        <h1>Employee dashboard</h1>
        <p>Sign in with an employee account.</p>
        <Link to="/account" className={`${ui.button}`}>
          Sign in
        </Link>
      </main>
    );
  if (
    user.role !== "employee" &&
    user.role !== "order_staff" &&
    user.role !== "admin"
  )
    return (
      <main className={`${ui.page}`}>
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
    id:
      | "products"
      | "categories"
      | "orders"
      | "users"
      | "analytics"
      | "messages"
      | "access"
      | "policies";
    label: string;
    icon: typeof Boxes;
  }[] = [
    { id: "products", label: "Products", icon: Boxes },
    { id: "categories", label: "Categories", icon: Folder },
    ...(canReadOrders
      ? [{ id: "orders" as const, label: "Orders", icon: ClipboardList }]
      : []),
    ...(canReadMessages
      ? [{ id: "messages" as const, label: "Inbox", icon: Mail }]
      : []),
    ...(user.role === "admin"
      ? [
          { id: "users" as const, label: "Users", icon: Users },
          { id: "access" as const, label: "Permissions", icon: ShieldCheck },
          { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
          {
            id: "policies" as const,
            label: "Legal pages",
            icon: ClipboardList,
          },
        ]
      : []),
  ];
  return (
    <main className="grid min-h-[calc(100vh-70px)] grid-cols-[238px_minmax(0,1fr)] bg-white max-[850px]:block">
      <aside
        className="border-r border-[#efded5] bg-[#fff7f4] px-[15px] py-[30px] [&_nav]:grid [&_nav]:gap-[5px] [&_p]:mx-3.5 [&_p]:mt-8 [&_p]:text-[.83rem] [&_p]:text-[#785b4d] [&_p]:wrap-anywhere max-[850px]:border-r-0 max-[850px]:border-b max-[850px]:px-3.5 max-[850px]:py-2.5 max-[850px]:[&_p]:hidden max-[850px]:[&_nav]:flex max-[850px]:[&_nav]:overflow-x-auto"
        aria-label="Dashboard navigation"
      >
        <div className="px-3.5 pb-4 text-[.77rem] font-extrabold tracking-[.09em] text-[#9d5030] uppercase max-[850px]:hidden">
          Store management
        </div>
        <nav aria-label="Dashboard sections">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={
                tab === id
                  ? "flex w-full items-center gap-3 rounded-[9px] px-3.5 py-3 text-left font-[650] hover:bg-[#f9e7dd] hover:text-[#a8390b] focus-visible:bg-[#f9e7dd] max-[850px]:w-auto max-[850px]:flex-none max-[850px]:whitespace-nowrap bg-[#ffe5d7]! text-[#a8390b]!"
                  : "flex w-full items-center gap-3 rounded-[9px] px-3.5 py-3 text-left font-[650] hover:bg-[#f9e7dd] hover:text-[#a8390b] focus-visible:bg-[#f9e7dd] max-[850px]:w-auto max-[850px]:flex-none max-[850px]:whitespace-nowrap"
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
        <p>
          Signed in as {user.name}
          <br />
          {user.role === "admin"
            ? "Store admin"
            : user.role === "order_staff"
              ? "Order staff · catalog is view only"
              : "Employee"}
        </p>
      </aside>
      <div
        className={`w-full max-w-[1400px]! px-[clamp(20px,4vw,54px)]! pt-[34px]! pb-[70px]! ${ui.page}`}
      >
        <div className="mb-6 flex items-center justify-between gap-4 [&_h1]:mt-[3px] [&_h1]:mb-0 [&_button]:gap-2 [&_button]:whitespace-nowrap max-[560px]:flex-col max-[560px]:items-start">
          <div>
            <span className="text-[.77rem] font-extrabold tracking-[.09em] text-[#9d5030] uppercase">
              DönerHere! / Dashboard
            </span>
            <h1>
              {tab === "editor"
                ? `${editing ? "Edit" : "Add"} ${product ? "product" : "category"}`
                : sections.find((section) => section.id === tab)?.label}
            </h1>
          </div>
          {tab === "products" && canEditCatalog && (
            <button
              className={`${ui.button}`}
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
          {tab === "categories" && canEditCatalog && (
            <button
              className={`${ui.button}`}
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
              className={`${ui.button}`}
              onClick={() => setShowUserForm((open) => !open)}
            >
              <Plus size={18} aria-hidden="true" /> Add user
            </button>
          )}
        </div>
        {error && (
          <p role="alert" className="text-[#a51b12]">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="mb-4! text-[#26652e]">
            {message}
          </p>
        )}
        {deleting && (
          <section
            className={`${ui.panel} flex flex-col gap-4`}
            role="alertdialog"
            aria-label={`Delete ${deleting.name}`}
          >
            <h2>Delete {deleting.name}?</h2>
            <p>
              This cannot be undone. Existing order records will be preserved.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                className={`${ui.button} bg-[#a82216]! hover:bg-[#881a12]!`}
                disabled={busy}
                onClick={remove}
              >
                Confirm deletion
              </button>
              <button
                className={`${ui.button} bg-[#f5e9e5]! text-[#29201c]! hover:bg-[#ead7cf]!`}
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
            readOnly={!canEditCatalog}
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
            readOnly={!canEditCatalog}
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
        {tab === "policies" && user.role === "admin" && <PolicyEditor />}
        {tab === "analytics" && user.role === "admin" && <Analytics />}
        {tab === "access" && user.role === "admin" && <AccessManager />}
        {tab === "messages" && canReadMessages && <Inbox />}
        {tab === "orders" && canReadOrders && (
          <StaffOrders
            orders={orders}
            onChange={setOrders}
            canUpdate={canEditOrders}
          />
        )}
        {tab === "users" && user.role === "admin" && (
          <section className="min-w-0">
            {showUserForm && (
              <form
                className={`${ui.panel} flex flex-col gap-4 mt-0!`}
                onSubmit={addUser}
              >
                <div className="mb-3 flex items-start justify-between gap-5 [&_h2]:mt-[2px] [&_h2]:mb-0 [&>button]:inline-grid [&>button]:size-9 [&>button]:place-items-center [&>button]:rounded-lg [&>button]:text-[#704e3e] [&>button:hover]:bg-[#ffe7da]">
                  <h2>Add user</h2>
                  <button
                    type="button"
                    aria-label="Close add user form"
                    onClick={() => setShowUserForm(false)}
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
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
                      <option value="order_staff">
                        Order staff (catalog view only)
                      </option>
                      <option value="admin">Store admin</option>
                    </select>
                  </label>
                </div>
                <button className={`${ui.button}`} disabled={busy}>
                  {busy ? "Creating…" : "Create user"}
                </button>
              </form>
            )}
            <div className="overflow-x-auto rounded-[13px] border border-[#eadbd3]">
              <table className={`${ui.table}`}>
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
                          <option value="order_staff">
                            Order staff (catalog view only)
                          </option>
                          <option value="admin">Store admin</option>
                        </select>
                      </td>
                      <td>
                        <div className="flex justify-end gap-1 [&_button]:inline-grid [&_button]:size-9 [&_button]:place-items-center [&_button]:rounded-lg [&_button]:text-[#704e3e] [&_button:hover]:bg-[#ffe7da] [&_button:hover]:text-[#a4380a]">
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
        {tab === "editor" && canEditCatalog && (product || category) && (
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
