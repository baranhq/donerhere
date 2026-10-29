import { spawn } from "node:child_process";
const children = [
  spawn(process.execPath, ["--env-file-if-exists=.env", "server/index.mjs"], {
    stdio: "inherit",
  }),
  spawn(
    process.execPath,
    ["node_modules/vite/bin/vite.js", "--host", "127.0.0.1"],
    { stdio: "inherit" },
  ),
];
let stopping = false;
const stop = () => {
  if (stopping) return;
  stopping = true;
  children.forEach((c) => c.kill());
};
children.forEach((c) => c.on("exit", stop));
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
