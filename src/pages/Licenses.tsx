import { ui } from "../styles/ui";
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
    <details className="min-w-0 overflow-hidden rounded-[10px] border border-[#ebdcd3] bg-[#fffaf7] [&_summary]:flex [&_summary]:cursor-pointer [&_summary]:list-none [&_summary]:items-center [&_summary]:gap-3.5 [&_summary]:px-5 [&_summary]:py-[17px] [&_summary::-webkit-details-marker]:hidden [&_summary>span:first-child]:min-w-0 [&_summary>span:first-child]:flex-1 [&_summary>span:first-child]:wrap-anywhere [&_summary_strong]:text-[.95rem] [&_summary_small]:mt-[3px] [&_summary_small]:block [&_summary_small]:text-[#826e60] [&_summary>svg]:shrink-0 [&_summary>svg]:transition-transform [&[open]_summary>svg]:rotate-180 [&_summary:hover]:bg-[#fff0e6] [&_summary:hover]:text-[#823b17] [&[open]_summary]:bg-[#fff0e6] max-[600px]:[&_summary]:gap-2 max-[600px]:[&_summary]:px-3 max-[600px]:[&_summary]:py-3.5 max-[600px]:[&_summary_strong]:text-[.85rem]">
      <summary>
        <span>
          <strong>{entry.name}</strong>
          {entry.version && <small>v{entry.version}</small>}
        </span>
        <span className="max-w-[40%] rounded-[5px] bg-[#f5e7de] px-[9px] py-1 text-center text-xs text-[#77513a] wrap-anywhere">
          {entry.license}
        </span>
        <ChevronDown size={18} aria-hidden="true" />
      </summary>
      <div className="min-w-0 border-t border-[#ebdcd3] px-5 pt-4 pb-[22px] [&_h3]:mt-[18px] max-[600px]:px-3 max-[600px]:py-3.5">
        <p>{entry.description}</p>
        <a className={`${ui.textLink}`} href={entry.source}>
          Official source
        </a>
        {entry.scope && (
          <p className="text-[.85rem] text-[#826e60]">
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
            <div className="max-h-[180px] overflow-auto text-[.8rem] text-[#73665c]">
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
              <a className={`${ui.textLink}`} href={notice.source}>
                Notice source
              </a>
            )}
            <pre className="mt-2.5 max-h-[400px] overflow-auto rounded-lg border border-[#eee1d8] bg-white p-[15px] text-[.8rem] whitespace-pre-wrap wrap-anywhere">
              {notice.text}
            </pre>
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
    <main className={`${ui.page} max-w-[1000px]!`}>
      <h1>Licenses & attribution</h1>
      <p>
        Open-source software, fonts, icons, and development tools used by
        DönerHere!.
      </p>
      {error && (
        <p className="text-[#a51b12]" role="alert">
          {error}
        </p>
      )}
      {!report && !error && <p role="status">Loading notices…</p>}
      {report && (
        <>
          <div className="mt-3.5 mb-8 grid gap-2.5">
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
            <section className={`${ui.panel}`}>
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
