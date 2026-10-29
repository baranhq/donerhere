import SuccessHeader from "./SuccessHeader";
import { useState } from "react";
import type { FormEvent } from "react";
import { Link } from "react-router";
import { api } from "../store/site";
import { ui } from "../styles/ui";
export default function MessageForm({
  kind,
}: {
  kind: "contact" | "feedback";
}) {
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setBusy(true);
    setError("");
    try {
      await api("/messages", "POST", {
        ...data,
        kind,
        ...(kind === "feedback" ? { rating: Number(data.rating) } : {}),
      });
      setSent(true);
      form.reset();
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not send message",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className={`${ui.page} max-w-[700px]!`}>
      {!sent && (
        <header className="text-center">
          <h1>
            {sent
              ? kind === "contact"
                ? "Message received"
                : "Feedback received"
              : kind === "contact"
                ? "Contact us"
                : "How was your experience?"}
          </h1>
          <p className="text-stone-600">
            {sent
              ? "Your submission was sent successfully."
              : kind === "contact"
                ? "Send a question to the store team."
                : "Tell the store team what went well and what could be better."}
          </p>
          <p className="text-sm text-stone-500">
            This is a fictional learning project. Use example details and avoid
            sensitive information.
          </p>
        </header>
      )}
      {sent ? (
        <>
          <SuccessHeader
            centered
            title={
              kind === "contact"
                ? "Message sent successfully"
                : "Feedback sent successfully"
            }
            description={
              kind === "contact"
                ? "Thank you. The store team can now read your message."
                : "Thank you for sharing your experience with the store team."
            }
          />
          <section className={`${ui.panel} text-center`} role="status">
            <button className={ui.button} onClick={() => setSent(false)}>
              {kind === "contact"
                ? "Send another message"
                : "Send more feedback"}
            </button>
            <Link className={`${ui.textLink} ml-4`} to="/menu">
              Back to menu
            </Link>
          </section>
        </>
      ) : (
        <form className={`${ui.panel} flex flex-col gap-5`} onSubmit={submit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              Name {kind === "feedback" && "(optional)"}
              <input
                name="name"
                required={kind === "contact"}
                maxLength={100}
                autoComplete="name"
              />
            </label>
            <label>
              Email {kind === "feedback" && "(optional)"}
              <input
                name="email"
                type="email"
                required={kind === "contact"}
                maxLength={254}
                autoComplete="email"
              />
            </label>
          </div>
          {kind === "feedback" && (
            <fieldset>
              <legend className="mb-2 font-semibold">Your rating</legend>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <label
                    className="flex-row! items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2"
                    key={value}
                  >
                    <input
                      className="w-auto!"
                      type="radio"
                      name="rating"
                      value={value}
                      required
                    />
                    {value}
                    <span className="sr-only">out of 5</span>
                  </label>
                ))}
              </div>
              <p className="text-sm text-stone-500">1 = Poor · 5 = Excellent</p>
            </fieldset>
          )}
          <label>
            {kind === "contact" ? "Your message" : "Your feedback"}
            <textarea
              name="message"
              required
              minLength={5}
              maxLength={3000}
              rows={5}
            />
          </label>
          <div hidden aria-hidden="true">
            <input name="website" tabIndex={-1} autoComplete="off" />
          </div>
          <p className="text-sm text-stone-600">
            The store team can read this submission.{" "}
            <Link className="underline" to="/privacy">
              Privacy Policy
            </Link>
          </p>
          {error && (
            <p role="alert" className="text-red-800">
              {error}
            </p>
          )}
          <button className={`${ui.button} self-start`} disabled={busy}>
            {busy
              ? "Sending…"
              : kind === "contact"
                ? "Send message"
                : "Send feedback"}
          </button>
        </form>
      )}
    </main>
  );
}
