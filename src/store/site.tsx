import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import type { Product } from "../data/products";
import type { Category } from "../data/categories";
export type User = {
  id: number;
  name: string;
  email: string;
  role: "customer" | "employee" | "admin";
};
export type Catalog = {
  products: Product[];
  categories: Category[];
  pickupLocations: string[];
};
export type Order = {
  id: string;
  name: string;
  phone: string;
  fulfillment: "delivery" | "collection";
  pickupLocation?: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  postalCode?: string;
  totalCents: number;
  status: string;
  payment: string;
  created: string;
  items: { name: string; size: string; quantity: number; unitCents: number }[];
};
export async function api<T>(
  path: string,
  method = "GET",
  body?: unknown,
): Promise<T> {
  const response = await fetch("/api" + path, {
    method,
    credentials: "same-origin",
    headers:
      method === "GET"
        ? {}
        : {
            "Content-Type": "application/json",
            "X-Requested-With": "DonerHere",
          },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Request failed");
  return data;
}
const Context = createContext<{
  catalog: Catalog;
  user: User | null;
  setUser: (u: User | null) => void;
  refresh: () => Promise<void>;
} | null>(null);
export function SiteProvider({
  children,
  initialCatalog,
}: {
  children: ReactNode;
  initialCatalog?: Catalog;
}) {
  const [catalog, setCatalog] = useState<Catalog>(
    initialCatalog || {
      products: [],
      categories: [],
      pickupLocations: [],
    },
  );
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(Boolean(initialCatalog));
  const [error, setError] = useState("");
  const refresh = useCallback(async () => {
    setCatalog(await api<Catalog>("/catalog"));
  }, []);
  const load = useCallback(async () => {
    try {
      await Promise.all([
        refresh(),
        api<{ user: User | null }>("/me").then((r) => setUser(r.user)),
      ]);
      setError("");
      setReady(true);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [refresh]);
  useEffect(() => {
    if (!initialCatalog) void load();
  }, [load, initialCatalog]);
  if (error)
    return (
      <main className="page">
        <p role="alert">Unable to load the store: {error}</p>
        <button className="button" onClick={() => void load()}>
          Try again
        </button>
      </main>
    );
  if (!ready)
    return (
      <main className="page" role="status">
        Loading DönerHere!…
      </main>
    );
  return (
    <Context value={{ catalog, user, setUser, refresh }}>{children}</Context>
  );
}
export function useSite() {
  const c = useContext(Context);
  if (!c) throw new Error("SiteProvider is required");
  return c;
}
export const money = (cents: number) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR" }).format(
    cents / 100,
  );
