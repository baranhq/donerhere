import {
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import { promisify } from "node:util";
const scrypt = promisify(scryptCallback);
export async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const key = await scrypt(password, salt, 64, {
    N: 32768,
    r: 8,
    p: 3,
    maxmem: 64 * 1024 * 1024,
  });
  return `${salt}:${key.toString("hex")}`;
}
export async function verify(password, stored) {
  const [salt, key] = stored.split(":");
  const actual = await scrypt(password, salt, 64, {
    N: 32768,
    r: 8,
    p: 3,
    maxmem: 64 * 1024 * 1024,
  });
  return timingSafeEqual(actual, Buffer.from(key, "hex"));
}
export const fail = (status, message) => {
  throw Object.assign(new Error(message), { status });
};
export const text = (s, min = 1, max = 200) =>
  typeof s === "string" && s.trim().length >= min && s.length <= max;
export const slug = (s) =>
  text(s, 1, 80) && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);
export const image = (s) =>
  typeof s === "string" &&
  s.length <= 500 &&
  (/^\/products\/[a-zA-Z0-9._-]+$/.test(s) || /^https:\/\/[^\s]+$/.test(s));
export const emailOK = (s) =>
  text(s, 3, 254) && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
export const passwordOK = (s) =>
  typeof s === "string" && s.length >= 12 && s.length <= 128;
