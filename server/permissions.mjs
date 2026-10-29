import { fail } from "./security.mjs";
export const permissionOptions = [
  {
    key: "promotions.write",
    label: "Manage homepage promotions",
    description:
      "Edit carousel slides, links, order, visibility and image uploads.",
  },
  {
    key: "catalog.write",
    label: "Edit products and categories",
    description: "Includes prices, availability and image uploads.",
  },
  {
    key: "orders.read",
    label: "View orders",
    description: "Includes customer contact details and order history.",
  },
  {
    key: "orders.write",
    label: "Update order status",
    description:
      "Mark orders ready, completed or declined. Requires View orders.",
  },
  {
    key: "messages.read",
    label: "Read Contact Us and Feedback",
    description: "View submitted messages and contact details.",
  },
];
const defaults = {
  customer: [],
  employee: ["catalog.write", "orders.read", "orders.write"],
  order_staff: ["orders.read", "orders.write"],
};
export function permissionsFor(db, user) {
  if (!user) return [];
  if (user.role === "admin")
    return permissionOptions.map((option) => option.key);
  if (user.role === "customer") return [];
  const row = db
    .prepare("SELECT json FROM user_permissions WHERE user_id=?")
    .get(user.id);
  return row ? JSON.parse(row.json) : defaults[user.role] || [];
}
export function validatePermissions(value) {
  if (
    !Array.isArray(value) ||
    value.length > permissionOptions.length ||
    new Set(value).size !== value.length ||
    value.some(
      (key) => !permissionOptions.some((option) => option.key === key),
    ) ||
    (value.includes("orders.write") && !value.includes("orders.read"))
  )
    fail(
      400,
      "Choose valid permissions. Updating orders also requires viewing orders.",
    );
  return value;
}
