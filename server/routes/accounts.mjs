import {
  fail,
  text,
  emailOK,
  passwordOK,
  hashPassword,
  verify,
} from "../security.mjs";
export async function accountRoutes({
  path,
  req,
  body,
  db,
  now,
  dummy,
  user,
  publicUser,
  session,
  destroySession,
  requireUser,
  send,
}) {
  if (
    (["/api/register", "/api/login"].includes(path) && req.method === "POST") ||
    (path === "/api/account" && ["PATCH", "DELETE"].includes(req.method))
  ) {
    const ip = req.socket.remoteAddress || "unknown";
    const keys = [
      "ip:" + ip,
      "email:" +
        String(user?.email || body.email)
          .toLowerCase()
          .slice(0, 254),
    ];
    for (const key of keys) {
      const a = db.prepare("SELECT * FROM attempts WHERE key=?").get(key);
      if (a && a.count >= (key.startsWith("ip:") ? 30 : 10))
        fail(429, "Too many attempts. Try again in 15 minutes.");
      db.prepare(
        "INSERT INTO attempts VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1",
      ).run(key, now + 900000);
    }
  }
  if (["/api/register", "/api/login"].includes(path) && req.method === "POST") {
    if (!emailOK(body.email) || !text(body.password, 1, 128))
      fail(400, "Enter a valid email and password");
    const email = body.email.trim().toLowerCase();
    if (path === "/api/register") {
      if (body.password !== body.repeatPassword)
        fail(400, "Passwords do not match");
      if (!text(body.name, 1, 100) || !passwordOK(body.password))
        fail(400, "Name is required; password must be 12–128 characters");
      const password = await hashPassword(body.password);
      let id;
      try {
        id = db
          .prepare("INSERT INTO users(email,name,password) VALUES(?,?,?)")
          .run(email, body.name.trim(), password).lastInsertRowid;
      } catch (e) {
        if (e.errcode === 2067) fail(409, "Unable to register with this email");
        throw e;
      }
      const u = db.prepare("SELECT * FROM users WHERE id=?").get(id);
      await session(u);
      return send(201, { user: publicUser(u) });
    }
    const u = db.prepare("SELECT * FROM users WHERE email=?").get(email);
    if (!(await verify(body.password, u?.password || (await dummy))) || !u)
      fail(401, "Invalid email or password");
    await session(u);
    return send(200, { user: publicUser(u) });
  }
  if (path === "/api/logout" && req.method === "POST") {
    await destroySession();
    return send(200, { ok: true });
  }
  if (path === "/api/account" && ["PATCH", "DELETE"].includes(req.method)) {
    requireUser();
    if (
      !text(body.currentPassword, 1, 128) ||
      !(await verify(body.currentPassword, user.password))
    )
      fail(400, "Current password is incorrect");
    if (req.method === "DELETE") {
      db.prepare("DELETE FROM users WHERE id=?").run(user.id);
      await destroySession();
      return send(200, { ok: true });
    }
    if (
      !text(body.name, 1, 100) ||
      !emailOK(body.email) ||
      (body.password && !passwordOK(body.password))
    )
      fail(400, "Check name, email and password (12–128 characters)");
    if (body.password && body.password !== body.repeatPassword)
      fail(400, "Passwords do not match");
    const password = body.password
      ? await hashPassword(body.password)
      : user.password;
    try {
      db.prepare("UPDATE users SET name=?, email=?, password=? WHERE id=?").run(
        body.name.trim(),
        body.email.trim().toLowerCase(),
        password,
        user.id,
      );
    } catch (e) {
      if (e.errcode === 2067) fail(409, "Email is unavailable");
      throw e;
    }
    db.prepare("DELETE FROM web_sessions WHERE user_id=?").run(user.id);
    const u = db.prepare("SELECT * FROM users WHERE id=?").get(user.id);
    await session(u);
    return send(200, { user: publicUser(u) });
  }

  return false;
}
