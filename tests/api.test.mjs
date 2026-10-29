import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createApp } from "../server/app.mjs";
import { openDB } from "../server/db.mjs";

const origin = "http://localhost:5173";
async function fixture(t) {
  const dir = mkdtempSync(join(tmpdir(), "doner-test-"));
  const db = openDB(join(dir, "test.sqlite"));
  const server = createApp({ db, origin, uploadDir: join(dir, "uploads") });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(async () => {
    await new Promise((resolve) => server.close(resolve));
    db.close();
    rmSync(dir, { recursive: true, force: true });
  });
  function client() {
    let cookie = "";
    return async (path, method = "GET", body, headers = {}) => {
      const r = await fetch(
        `http://127.0.0.1:${server.address().port}/api${path}`,
        {
          method,
          headers: {
            cookie,
            Origin: origin,
            "Content-Type": "application/json",
            "X-Requested-With": "DonerHere",
            ...headers,
          },
          ...(body === undefined ? {} : { body: JSON.stringify(body) }),
        },
      );
      if (r.headers.has("set-cookie"))
        cookie = r.headers.get("set-cookie").split(";")[0];
      return { status: r.status, data: await r.json(), headers: r.headers };
    };
  }
  return { db, client, url: `http://127.0.0.1:${server.address().port}` };
}
const account = {
  name: "Test Customer",
  email: "customer@example.com",
  password: "A long test password 123",
  repeatPassword: "A long test password 123",
};
test("registration, login, sessions, account changes and deletion", async (t) => {
  const { db, client } = await fixture(t);
  const request = client();
  assert.equal(
    (await request("/register", "POST", { ...account, password: "short" }))
      .status,
    400,
  );
  const registered = await request("/register", "POST", {
    ...account,
    role: "employee",
  });
  assert.equal(registered.status, 201);
  assert.equal(registered.data.user.role, "customer");
  assert.match(registered.headers.get("set-cookie"), /HttpOnly/);
  assert.match(registered.headers.get("set-cookie"), /SameSite=Strict/);
  const stored = db.prepare("SELECT * FROM users").get();
  assert.notEqual(stored.password, account.password);
  assert.match(stored.password, /^[a-f0-9]{32}:[a-f0-9]{128}$/);
  assert.equal((await request("/me")).data.user.email, account.email);
  assert.equal((await request("/register", "POST", account)).status, 409);
  const session = db.prepare("SELECT token FROM web_sessions").get();
  assert.equal(session.token.length, 64);
  assert.equal((await request("/logout", "POST", {})).status, 200);
  assert.equal((await request("/me")).data.user, null);
  assert.equal(
    (
      await request("/login", "POST", {
        ...account,
        password: "wrong password",
      })
    ).status,
    401,
  );
  assert.equal((await request("/login", "POST", account)).status, 200);
  const second = client();
  assert.equal((await second("/login", "POST", account)).status, 200);
  assert.equal(
    (
      await request("/account", "PATCH", {
        ...account,
        name: "Updated",
        password: "Another long password 123",
        repeatPassword: "Another long password 123",
        currentPassword: account.password,
      })
    ).status,
    200,
  );
  assert.equal((await second("/me")).data.user, null);
  assert.equal(
    (await request("/account", "DELETE", { currentPassword: "wrong" })).status,
    400,
  );
  assert.equal(
    (
      await request("/account", "DELETE", {
        currentPassword: "Another long password 123",
      })
    ).status,
    200,
  );
  assert.equal((await request("/me")).data.user, null);
});
test("server permissions, CSRF, employee catalog and orders", async (t) => {
  const { db, client } = await fixture(t);
  const anonymous = client();
  const customer = client();
  const employee = client();
  assert.equal((await anonymous("/admin/orders")).status, 401);
  assert.equal(
    (
      await anonymous("/register", "POST", account, {
        Origin: "https://evil.example",
      })
    ).status,
    403,
  );
  assert.equal((await customer("/register", "POST", account)).status, 201);
  assert.equal((await customer("/admin/orders")).status, 403);
  assert.equal(
    (
      await employee("/register", "POST", {
        ...account,
        email: "employee@example.com",
      })
    ).status,
    201,
  );
  db.prepare("UPDATE users SET role='employee' WHERE email=?").run(
    "employee@example.com",
  );
  const catalog = (await customer("/catalog")).data;
  const original = catalog.products[0];
  const product = { ...original, name: "Test Wrap", link: "test-wrap" };
  assert.equal(
    (await customer("/admin/products", "POST", product)).status,
    403,
  );
  assert.equal(
    (await employee("/admin/products", "POST", product)).status,
    200,
  );
  assert.equal(
    (
      await employee("/admin/products/test-wrap", "PUT", {
        ...product,
        sizes: [{ ...product.sizes[0], price: -5 }],
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await employee("/admin/products/test-wrap", "PUT", {
        ...product,
        image: "javascript:alert(1)",
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await employee("/admin/products/test-wrap", "PUT", {
        ...product,
        name: "Edited Wrap",
      })
    ).status,
    200,
  );
  assert.equal(
    (
      await employee("/admin/categories", "POST", {
        name: "Test category",
        slug: "test-category",
        image: "/products/fries.png",
      })
    ).status,
    200,
  );
  assert.equal(
    (
      await employee("/admin/categories/test-category", "PUT", {
        name: "Renamed",
        slug: "test-category",
        image: "/products/fries.png",
      })
    ).status,
    200,
  );
  assert.equal(
    (await employee("/admin/categories/doner-wraps", "DELETE", {})).status,
    409,
  );
  assert.equal(
    (await employee("/admin/categories/test-category", "DELETE", {})).status,
    200,
  );
  const order = {
    requestId: crypto.randomUUID(),
    name: "Test",
    phone: "123456789",
    fulfillment: "collection",
    pickupLocation: "DönerHere! City, Country · City 1 · Country 1",
    expectedTotalCents: Math.round(original.sizes[0].price * 100) * 2,
    items: [
      {
        product: original.link,
        size: original.sizes[0].link,
        quantity: 2,
        price: 0.01,
      },
    ],
  };
  assert.equal((await anonymous("/orders", "POST", order)).status, 401);
  assert.equal(
    (await customer("/orders", "POST", { ...order, expectedTotalCents: 1 }))
      .status,
    409,
  );
  assert.equal(
    (
      await customer("/orders", "POST", {
        ...order,
        items: [{ ...order.items[0], quantity: 0 }],
      })
    ).status,
    400,
  );
  const placed = await customer("/orders", "POST", order);
  assert.equal(placed.status, 201);
  assert.equal(placed.data.totalCents, order.expectedTotalCents);
  assert.equal((await customer("/orders", "POST", order)).status, 200);
  assert.equal((await customer("/orders")).data.length, 1);

  const delivery = {
    ...order,
    requestId: crypto.randomUUID(),
    fulfillment: "delivery",
    pickupLocation: undefined,
    deliveryAddress: "123 Example Street",
    deliveryCity: "Example City",
    postalCode: "1000",
  };
  assert.equal(
    (await customer("/orders", "POST", { ...delivery, deliveryAddress: "" }))
      .status,
    400,
  );
  const delivered = await customer("/orders", "POST", delivery);
  assert.equal(delivered.status, 201);
  assert.equal(delivered.data.fulfillment, "delivery");
  assert.equal(delivered.data.deliveryAddress, "123 Example Street");
  assert.equal((await employee("/orders")).data.length, 0);
  assert.equal((await employee("/admin/orders")).data.length, 2);
  assert.equal(
    (await employee("/admin/products/test-wrap", "DELETE", {})).status,
    200,
  );
  assert.equal(
    (await employee("/admin/products/test-wrap", "DELETE", {})).status,
    404,
  );
});
test("session expiry and authentication throttling", async (t) => {
  const { db, client } = await fixture(t);
  const request = client();
  await request("/register", "POST", account);
  db.prepare("UPDATE web_sessions SET touched=?").run(Date.now() - 1800001);
  assert.equal((await request("/me")).data.user, null);
  await request("/login", "POST", account);
  db.prepare("UPDATE web_sessions SET expires=?").run(Date.now() - 1);
  assert.equal((await request("/me")).data.user, null);
  for (let i = 0; i < 10; i++)
    await request("/login", "POST", {
      email: "absent@example.com",
      password: "bad",
    });
  assert.equal(
    (
      await request("/login", "POST", {
        email: "absent@example.com",
        password: "bad",
      })
    ).status,
    429,
  );
});

test("schema migrations preserve existing catalog data across restarts", () => {
  const directory = mkdtempSync(join(tmpdir(), "doner-migrations-"));
  const file = join(directory, "store.sqlite");
  try {
    const first = openDB(file);
    const catalog = JSON.parse(
      first.prepare("SELECT json FROM catalog WHERE id=1").get().json,
    );
    catalog.products[0].name = "Persisted catalog edit";
    first
      .prepare("UPDATE catalog SET json=? WHERE id=1")
      .run(JSON.stringify(catalog));
    assert.equal(first.prepare("PRAGMA user_version").get().user_version, 3);
    first.close();
    const second = openDB(file);
    assert.equal(
      JSON.parse(
        second.prepare("SELECT json FROM catalog WHERE id=1").get().json,
      ).products[0].name,
      "Persisted catalog edit",
    );
    second.close();
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
});

test("admin users, staff permissions and image uploads", async (t) => {
  const { db, client, url } = await fixture(t);
  const admin = client();
  const employee = client();
  const customer = client();
  await admin("/register", "POST", { ...account, email: "admin@example.com" });
  await employee("/register", "POST", {
    ...account,
    email: "staff@example.com",
  });
  await customer("/register", "POST", account);
  db.prepare(
    "UPDATE users SET role='admin' WHERE email='admin@example.com'",
  ).run();
  db.prepare(
    "UPDATE users SET role='employee' WHERE email='staff@example.com'",
  ).run();
  assert.equal((await customer("/admin/users")).status, 403);
  assert.equal((await employee("/admin/users")).status, 403);
  assert.equal((await admin("/admin/users")).status, 200);
  const created = await admin("/admin/users", "POST", {
    name: "New Employee",
    email: "new@example.com",
    password: "temporary password 123",
    role: "employee",
  });
  assert.equal(created.status, 201);
  const member = created.data.find(
    (entry) => entry.email === "new@example.com",
  );
  assert.equal(member.role, "employee");
  assert.equal("password" in member, false);
  const password = db
    .prepare("SELECT password FROM users WHERE id=?")
    .get(member.id).password;
  assert.notEqual(password, "temporary password 123");
  assert.equal(
    (await admin(`/admin/users/${member.id}`, "PATCH", { role: "admin" }))
      .status,
    200,
  );
  assert.equal(
    (await admin(`/admin/users/${member.id}`, "DELETE", {})).status,
    200,
  );
  assert.equal(
    (
      await admin(
        `/admin/users/${(await admin("/me")).data.user.id}`,
        "DELETE",
        {},
      )
    ).status,
    409,
  );

  const image = readFileSync("public/products/fries.png");
  assert.equal(
    (
      await customer("/admin/uploads", "POST", {
        data: image.toString("base64"),
      })
    ).status,
    403,
  );
  const uploaded = await employee("/admin/uploads", "POST", {
    data: image.toString("base64"),
  });
  assert.equal(uploaded.status, 201);
  assert.match(uploaded.data.url, /^\/uploads\/[0-9a-f-]{36}\.png$/);
  const response = await fetch(url + uploaded.data.url);
  assert.equal(response.status, 200);
  assert.deepEqual(Buffer.from(await response.arrayBuffer()), image);
  assert.equal(
    (
      await employee("/admin/uploads", "POST", {
        data: Buffer.from("bad").toString("base64"),
      })
    ).status,
    400,
  );
});
