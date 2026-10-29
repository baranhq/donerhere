import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";

type Notice = { file: string; text: string; source?: string };
type LicenseEntry = {
  name: string;
  version?: string;
  license: string;
  description: string;
  source: string;
  scope?: string;
  notices: Notice[];
};
type Report = {
  generated: string;
  policy: string;
  issues: string[];
  packages: LicenseEntry[];
  assets: LicenseEntry[];
};

function LicenseAccordion({ entry }: { entry: LicenseEntry }) {
  const copyright = Array.from(
    new Set(
      entry.notices.flatMap((n) =>
        n.text
          .split("\n")
          .filter((line) => /copyright|©/i.test(line))
          .map((line) => line.trim())
          .filter((line) => line.length > 0),
      ),
    ),
  );
  return (
    <details className="license-item">
      <summary>
        <span>
          <strong>{entry.name}</strong>
          {entry.version && <small>v{entry.version}</small>}
        </span>
        <span className="license-badge">{entry.license}</span>
        <ChevronDown size={18} aria-hidden="true" />
      </summary>
      <div className="license-body">
        <p>{entry.description}</p>
        <a className="text-link" href={entry.source}>
          Official source
        </a>
        {entry.scope && (
          <p className="license-scope">
            Used for{" "}
            {entry.scope === "development"
              ? "development and testing"
              : "the application"}
            .
          </p>
        )}
        {copyright.length > 0 && (
          <>
            <h3>Copyright & attribution</h3>
            <div className="license-copyright">
              {copyright.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </>
        )}
        {entry.notices.map((notice, index) => (
          <section key={notice.file + index}>
            <h3>
              {entry.notices.length > 1
                ? notice.file
                : "License & required notices"}
            </h3>
            {notice.source && (
              <a className="text-link" href={notice.source}>
                Notice source
              </a>
            )}
            <pre className="license-text">{notice.text}</pre>
          </section>
        ))}
        {entry.license === "Public domain" && (
          <p>
            SQLite is dedicated to the public domain by its authors. It may be
            used for any purpose, including commercial use, without a license
            fee or attribution requirement. See its official copyright statement
            for the authors’ declaration and jurisdiction information.
          </p>
        )}
      </div>
    </details>
  );
}
export default function Licenses() {
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetch("/third-party-licenses.json", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("License report unavailable");
        return response.json();
      })
      .then(setReport)
      .catch((error) => {
        if (!controller.signal.aborted)
          setError(
            error instanceof Error ? error.message : "Unable to load notices",
          );
      });
    return () => controller.abort();
  }, []);
  return (
    <main className="page licenses-page">
      <h1>Licenses & attribution</h1>
      <p>
        Open-source software, fonts, icons, and development tools used by
        DönerHere!.
      </p>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {!report && !error && <p role="status">Loading notices…</p>}
      {report && (
        <>
          <div className="license-list">
            {[...report.assets, ...report.packages]
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((entry, index) => (
                <LicenseAccordion
                  key={entry.name + entry.version + index}
                  entry={entry}
                />
              ))}
          </div>
          {report.issues.length > 0 && (
            <section className="panel">
              <h2>License audit findings</h2>
              <ul>
                {report.issues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </main>
  );
}
