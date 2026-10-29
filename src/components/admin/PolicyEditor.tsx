import { ui } from "../../styles/ui";
import { useEffect, useState } from "react";
import { api } from "../../store/site";
type Document = {
  draft: string;
  published: string | null;
  publishedAt: string | null;
  revision: number;
};
export default function PolicyEditor() {
  const [kind, setKind] = useState("privacy");
  const [document, setDocument] = useState<Document | null>(null);
  const [text, setText] = useState("");
  const [approved, setApproved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [reload, setReload] = useState(0);
  useEffect(() => {
    let cancelled = false;
    setDocument(null);
    setError("");
    setMessage("");
    setApproved(false);
    api<Document>(`/admin/policies/${kind}`)
      .then((value) => {
        if (!cancelled) {
          setDocument(value);
          setText(value.draft);
        }
      })
      .catch((cause) => {
        if (!cancelled)
          setError(
            cause instanceof Error ? cause.message : "Could not load document",
          );
      });
    return () => {
      cancelled = true;
    };
  }, [kind, reload]);
  async function save(publish: boolean) {
    if (!document) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const value = await api<Document>(
        `/admin/policies/${kind}`,
        publish ? "POST" : "PUT",
        publish
          ? { revision: document.revision, approved }
          : { revision: document.revision, draft: text },
      );
      setDocument(value);
      setApproved(false);
      setMessage(
        publish
          ? "Document published."
          : "Draft saved. The public page has not changed.",
      );
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not save document",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="space-y-5 max-w-4xl">
      <div className="flex flex-wrap gap-4 items-end">
        <label>
          Document
          <select
            disabled={busy}
            value={kind}
            onChange={(event) => {
              if (
                text !== document?.draft &&
                !window.confirm("Discard unsaved changes?")
              )
                return;
              setKind(event.target.value);
            }}
          >
            <option value="privacy">Privacy Policy</option>
            <option value="terms">Terms of Service</option>
          </select>
        </label>
        <a
          className={`${ui.textLink}`}
          href={`/${kind}`}
          target="_blank"
          rel="noreferrer"
        >
          Open public page
        </a>
        <button
          className={`${ui.textLink}`}
          disabled={busy}
          onClick={() => {
            if (
              text === document?.draft ||
              window.confirm("Discard unsaved changes and reload?")
            )
              setReload((value) => value + 1);
          }}
        >
          Reload saved draft
        </button>
      </div>
      <p className="text-sm text-stone-600">
        Use wording reviewed for your actual activities. No legal wording is
        generated. Save a draft, review the preview, then approve publication.
      </p>
      {error && (
        <p role="alert" className="text-[#a51b12]">
          {error}
        </p>
      )}
      {message && <p role="status">{message}</p>}
      {!document && !error && <p role="status">Loading document…</p>}
      {document && (
        <>
          <p className="text-sm text-stone-600">
            {document.publishedAt
              ? `Last published: ${new Date(document.publishedAt).toLocaleString()}`
              : "Unpublished — no policy text is displayed publicly."}
          </p>
          <label>
            Draft text
            <textarea
              rows={16}
              maxLength={20000}
              disabled={busy}
              value={text}
              onChange={(event) => {
                setText(event.target.value);
                setApproved(false);
              }}
            />
          </label>
          <button
            className={`${ui.button}`}
            disabled={busy || text === document.draft}
            onClick={() => void save(false)}
          >
            Save draft
          </button>
          <details className="rounded-lg border border-stone-200 p-5">
            <summary className="cursor-pointer font-semibold">
              Preview saved draft
            </summary>
            <div className="mt-4 whitespace-pre-wrap break-words">
              {document.draft || "No saved draft yet."}
            </div>
          </details>
          <label className="flex-row! items-center [&_input]:w-auto!">
            <input
              type="checkbox"
              checked={approved}
              disabled={
                busy || !document.draft.trim() || text !== document.draft
              }
              onChange={(event) => setApproved(event.target.checked)}
            />
            I reviewed the saved text and approve publishing it.
          </label>
          <button
            className={`${ui.button} bg-[#f5e9e5]! text-[#29201c]! hover:bg-[#ead7cf]!`}
            disabled={busy || !approved || text !== document.draft}
            onClick={() => void save(true)}
          >
            {busy ? "Saving…" : "Publish approved draft"}
          </button>
        </>
      )}
    </section>
  );
}
