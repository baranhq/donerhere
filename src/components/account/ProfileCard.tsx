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
      form.reset();
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
    <section className="panel">
      <p role="alert" className="error">
        {error}
      </p>
      <p role="status">{message}</p>
      <form className="stack" onSubmit={save}>
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
        <label>
          Current password
          <input
            name="currentPassword"
            type="password"
            required
            maxLength={128}
            autoComplete="current-password"
          />
        </label>
        <label>
          New password (optional)
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
        <button className="button" disabled={busy}>
          {busy ? "Saving…" : "Save changes"}
        </button>
      </form>
      <button className="text-link" disabled={busy} onClick={logout}>
        Sign out
      </button>
      {(user.role === "employee" || user.role === "admin") && (
        <p>
          <Link className="text-link" to="/employee">
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
        <form className="stack" onSubmit={remove}>
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
          <label className="check">
            <input type="checkbox" required />I understand this cannot be undone
          </label>
          <button className="button danger" disabled={busy}>
            Permanently delete account
          </button>
        </form>
      </details>
    </section>
  );
}
