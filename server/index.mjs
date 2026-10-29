import { createApp } from "./app.mjs";
createApp().listen(Number(process.env.API_PORT || 3001), "127.0.0.1", () =>
  console.log(
    "API listening on http://localhost:" + (process.env.API_PORT || 3001),
  ),
);
