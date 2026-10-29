import { ui } from "../styles/ui";
import { useEffect, useState } from "react";
import { api } from "../store/site";
export default function Policy({ kind }: { kind: "terms" | "privacy" }) {
  const [document, setDocument] = useState<{
    content: string | null;
    publishedAt: string | null;
  } | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;
    setDocument(null);
    setError("");
    api<{ content: string | null; publishedAt: string | null }>(
      `/policies/${kind}`,
    )
      .then((value) => {
        if (!cancelled) setDocument(value);
      })
      .catch((cause) => {
        if (!cancelled)
          setError(
            cause instanceof Error ? cause.message : "Unable to load page",
          );
      });
    return () => {
      cancelled = true;
    };
  }, [kind]);
  return (
    <main className={`${ui.page} max-w-3xl`}>
      <h1>{kind === "terms" ? "Terms of Service" : "Privacy Policy"}</h1>
      {error ? (
        <p role="alert" className="text-[#a51b12]">
          {error}
        </p>
      ) : !document ? (
        <p role="status">Loading document…</p>
      ) : document.content ? (
        <>
          {document.publishedAt && (
            <p className="text-sm text-stone-600">
              Published {new Date(document.publishedAt).toLocaleDateString()}
            </p>
          )}
          <div className="whitespace-pre-wrap break-words leading-relaxed">
            {document.content}
          </div>
        </>
      ) : (
        <p>
          No {kind === "terms" ? "Terms of Service" : "Privacy Policy"} has been
          published for this fictional learning project.
        </p>
      )}
    </main>
  );
}
