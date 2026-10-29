import { useEffect, useState } from "react";
import { api } from "../../store/site";
import { ui } from "../../styles/ui";
type Message = {
  id: number;
  kind: string;
  name: string;
  email: string;
  message: string;
  rating: number | null;
  created: string;
};
export default function Inbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [revision, setRevision] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    api<Message[]>("/admin/messages")
      .then((value) => {
        if (!cancelled) setMessages(value);
      })
      .catch((cause) => {
        if (!cancelled)
          setError(
            cause instanceof Error ? cause.message : "Could not load messages",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [revision]);
  const filtered = messages.filter(
    (message) =>
      (filter === "all" || message.kind === filter) &&
      `${message.name} ${message.email} ${message.message}`
        .toLowerCase()
        .includes(search.toLowerCase().trim()),
  );
  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-end gap-4">
        <label>
          Show
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          >
            <option value="all">All submissions</option>
            <option value="contact">Contact Us</option>
            <option value="feedback">Feedback</option>
          </select>
        </label>
        <label className="flex-1">
          Search messages
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Name, email or message"
          />
        </label>
        <button
          className={`${ui.button} bg-[#f5e9e5]! text-stone-800!`}
          disabled={loading}
          onClick={() => setRevision((value) => value + 1)}
        >
          Refresh
        </button>
      </div>
      {error && (
        <p role="alert" className="text-red-800">
          {error}
        </p>
      )}
      {loading ? (
        <p role="status">Loading submissions…</p>
      ) : filtered.length ? (
        filtered.map((message) => (
          <article
            key={message.id}
            className="rounded-xl border border-stone-200 bg-white p-5"
          >
            <header className="mb-4 flex flex-wrap justify-between gap-3">
              <div>
                <h2 className="mb-1! text-lg!">
                  {message.kind === "contact" ? "Contact Us" : "Feedback"} #
                  {message.id}
                </h2>
                <span className="text-sm text-stone-500">
                  {message.name || "Anonymous"}
                  {message.email && ` · ${message.email}`}
                </span>
              </div>
              <time
                dateTime={message.created}
                className="text-sm text-stone-500"
              >
                {new Date(message.created).toLocaleString()}
              </time>
            </header>
            {message.rating !== null && (
              <p className="font-semibold">Rating: {message.rating}/5</p>
            )}
            <p className="whitespace-pre-wrap wrap-anywhere">
              {message.message}
            </p>
          </article>
        ))
      ) : (
        <p className="p-6 text-center text-stone-500">
          No submissions match your filters.
        </p>
      )}
    </section>
  );
}
