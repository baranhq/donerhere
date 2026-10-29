// Append migrations; never rewrite an applied migration on a deployed database.
export const migrations = [
  (db, seed) => {
    db.exec(`
      CREATE TABLE users(id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL, password TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'customer' CHECK(role IN ('customer','employee')));
      CREATE TABLE catalog(id INTEGER PRIMARY KEY CHECK(id=1), json TEXT NOT NULL);
      CREATE TABLE orders(id TEXT PRIMARY KEY, user_id INTEGER REFERENCES users(id) ON DELETE SET NULL, json TEXT NOT NULL, created TEXT NOT NULL);
      CREATE TABLE attempts(key TEXT PRIMARY KEY, count INTEGER NOT NULL, until INTEGER NOT NULL);
      CREATE TABLE web_sessions(token TEXT PRIMARY KEY,json TEXT NOT NULL,user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,expires INTEGER NOT NULL,touched INTEGER NOT NULL);
      CREATE INDEX sessions_by_user ON web_sessions(user_id);
      CREATE INDEX orders_by_user ON orders(user_id);
      CREATE TABLE settings(key TEXT PRIMARY KEY,value TEXT NOT NULL);
    `);
    db.prepare("INSERT INTO catalog VALUES(1,?)").run(JSON.stringify(seed));
  },
  (db, seed) => {
    const catalog = JSON.parse(
      db.prepare("SELECT json FROM catalog WHERE id=1").get().json,
    );
    if (!catalog.pickupLocations) {
      catalog.pickupLocations = seed.pickupLocations;
      db.prepare("UPDATE catalog SET json=? WHERE id=1").run(
        JSON.stringify(catalog),
      );
    }
  },
  (db) => {
    db.exec(`
      CREATE TABLE users_new(id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL, password TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'customer' CHECK(role IN ('customer','employee','admin')));
      INSERT INTO users_new SELECT id,email,name,password,role FROM users;
      DROP TABLE users;
      ALTER TABLE users_new RENAME TO users;
    `);
  },
  (db) => {
    db.exec(
      "CREATE TABLE order_numbers(number INTEGER PRIMARY KEY AUTOINCREMENT, order_id TEXT UNIQUE NOT NULL REFERENCES orders(id)); INSERT INTO sqlite_sequence(name,seq) VALUES('order_numbers',1000);",
    );
    for (const row of db
      .prepare("SELECT id,json FROM orders ORDER BY created,id")
      .all()) {
      const number = Number(
        db.prepare("INSERT INTO order_numbers(order_id) VALUES(?)").run(row.id)
          .lastInsertRowid,
      );
      const order = JSON.parse(row.json);
      order.number = number;
      order.history = [{ status: order.status, at: order.created }];
      db.prepare("UPDATE orders SET json=? WHERE id=?").run(
        JSON.stringify(order),
        row.id,
      );
    }
  },
  (db) => {
    db.exec(`CREATE TABLE users_new(id INTEGER PRIMARY KEY, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL, password TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'customer' CHECK(role IN ('customer','employee','order_staff','admin')));
      INSERT INTO users_new SELECT id,email,name,password,role FROM users;
      DROP TABLE users; ALTER TABLE users_new RENAME TO users;`);
  },
  (db) => {
    db.exec(`
    CREATE TABLE user_permissions(user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, json TEXT NOT NULL);
    CREATE TABLE permission_templates(id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL UNIQUE, json TEXT NOT NULL);
    CREATE TABLE messages(id INTEGER PRIMARY KEY AUTOINCREMENT, kind TEXT NOT NULL CHECK(kind IN ('contact','feedback')), name TEXT NOT NULL, email TEXT NOT NULL, message TEXT NOT NULL, rating INTEGER, created TEXT NOT NULL);
  `);
  },
];
export function migrate(db, seed) {
  const version = db.prepare("PRAGMA user_version").get().user_version;
  if (version > migrations.length)
    throw new Error("Database schema is newer than this application");
  for (let index = version; index < migrations.length; index++) {
    if (index === 2 || index === 4) db.exec("PRAGMA foreign_keys=OFF");
    db.exec("BEGIN IMMEDIATE");
    try {
      migrations[index](db, seed);
      db.exec(`PRAGMA user_version=${index + 1}; COMMIT;`);
    } catch (error) {
      db.exec("ROLLBACK");
      throw error;
    } finally {
      if (index === 2 || index === 4) db.exec("PRAGMA foreign_keys=ON");
    }
  }
  if (db.prepare("PRAGMA foreign_key_check").get())
    throw new Error("Database migration left invalid references");
}
