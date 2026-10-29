import { ui } from "../../styles/ui";
import { useState } from "react";
import type { FormEvent } from "react";
import { api, useSite } from "../../store/site";
import type { User } from "../../store/site";

export default function AuthForm({
  onSuccess,
  onModeChange,
}: {
  onSuccess?: () => void;
  onModeChange?: (register: boolean) => void;
}) {
  const { setUser } = useSite();
  const [register, setRegister] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    if (register && data.password !== data.repeatPassword) {
      setError("Passwords do not match");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const result = await api<{ user: User }>(
        register ? "/register" : "/login",
        "POST",
        data,
      );
      setUser(result.user);
      onSuccess?.();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to sign in");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <form
        className="flex flex-col gap-4"
        onSubmit={submit}
        key={String(register)}
      >
        {register && (
          <label>
            Name
            <input name="name" required maxLength={100} autoComplete="name" />
          </label>
        )}
        <label>
          Email
          <input
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            required
            minLength={register ? 12 : 1}
            maxLength={128}
            autoComplete={register ? "new-password" : "current-password"}
          />
        </label>
        {register && (
          <label>
            Repeat password
            <input
              name="repeatPassword"
              type="password"
              required
              minLength={12}
              maxLength={128}
              autoComplete="new-password"
            />
          </label>
        )}
        {error && (
          <p role="alert" className="text-[#a51b12]">
            {error}
          </p>
        )}
        <button className={`${ui.button}`} disabled={busy}>
          {busy ? "Please wait…" : register ? "Create account" : "Sign in"}
        </button>
      </form>
      <button
        className={`${ui.textLink}`}
        disabled={busy}
        onClick={() => {
          setRegister(!register);
          setError("");
          onModeChange?.(!register);
        }}
      >
        {register
          ? "Already registered? Sign in"
          : "New here? Create an account"}
      </button>
    </>
  );
}
