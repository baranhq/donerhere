import { ui } from "../../styles/ui";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import { api, useSite } from "../../store/site";
import type { User } from "../../store/site";

export default function ProfileCard({ user }: { user: User }) {
  const { setUser } = useSite();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    if (data.password && data.password !== data.repeatPassword) {
      setError("Passwords do not match");
      return;
    }
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const result = await api<{ user: User }>("/account", "PATCH", data);
      setUser(result.user);
      setMessage("Account updated. Other sessions have been signed out.");
      form
        .querySelectorAll<HTMLInputElement>('input[type="password"]')
        .forEach((input) => {
          input.value = "";
        });
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to update account",
      );
    } finally {
      setBusy(false);
    }
  }
  async function logout() {
    setBusy(true);
    setError("");
    try {
      await api("/logout", "POST", {});
      setUser(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to sign out");
    } finally {
      setBusy(false);
    }
  }
  async function remove(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    setBusy(true);
    setError("");
    try {
      await api("/account", "DELETE", data);
      setUser(null);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to delete account",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6 sm:p-8">
      <p role="alert" className="text-[#a51b12]">
        {error}
      </p>
      <p role="status">{message}</p>
      <form className="space-y-6" onSubmit={save}>
        <section>
          <h2>Personal details</h2>
          <p className="text-sm text-stone-500">
            Used to identify your account and your orders.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              Name
              <input
                name="name"
                required
                maxLength={100}
                autoComplete="name"
                defaultValue={user.name}
              />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                required
                maxLength={254}
                autoComplete="email"
                defaultValue={user.email}
              />
            </label>
          </div>
        </section>
        <details className="border-t border-stone-200 pt-5">
          <summary className="cursor-pointer font-semibold">
            Change password
          </summary>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label>
              New password
              <input
                name="password"
                type="password"
                minLength={12}
                maxLength={128}
                autoComplete="new-password"
              />
            </label>
            <label>
              Repeat new password
              <input
                name="repeatPassword"
                type="password"
                maxLength={128}
                autoComplete="new-password"
              />
            </label>
          </div>
        </details>
        <section className="border-t border-stone-200 pt-5">
          <label className="max-w-sm">
            Current password
            <input
              name="currentPassword"
              type="password"
              required
              maxLength={128}
              autoComplete="current-password"
            />
          </label>
          <p className="text-sm text-stone-500">
            Confirm your current password to save changes.
          </p>
          <button className={ui.button} disabled={busy}>
            {busy ? "Saving…" : "Save changes"}
          </button>
        </section>
      </form>
      <div className="mt-5 border-t border-stone-200 pt-5">
        <h2>Account actions</h2>
        <button className={`${ui.textLink}`} disabled={busy} onClick={logout}>
          Sign out
        </button>
        {(user.role === "employee" ||
          user.role === "order_staff" ||
          user.role === "admin") && (
          <p>
            <Link className={`${ui.textLink}`} to="/employee">
              Open employee dashboard
            </Link>
          </p>
        )}
        <details>
          <summary>Delete account</summary>
          <p>
            This permanently deletes your account. Store order records are
            retained.
          </p>
          <form className="flex flex-col gap-4" onSubmit={remove}>
            <label>
              Confirm current password
              <input
                name="currentPassword"
                type="password"
                required
                maxLength={128}
                autoComplete="current-password"
              />
            </label>
            <label className="flex-row! items-center [&_input]:w-auto!">
              <input type="checkbox" required />I understand this cannot be
              undone
            </label>
            <button
              className={`${ui.button} bg-[#a82216]! hover:bg-[#881a12]!`}
              disabled={busy}
            >
              Permanently delete account
            </button>
          </form>
        </details>
      </div>
    </section>
  );
}
