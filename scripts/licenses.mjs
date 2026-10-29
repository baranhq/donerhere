import { readFileSync, readdirSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const supplemental = JSON.parse(
  readFileSync("docs/licenses/manifest.json", "utf8"),
);
const lock = JSON.parse(readFileSync("package-lock.json", "utf8"));
const approved = new Set([
  "MIT",
  "ISC",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "Apache-2.0",
  "MPL-2.0",
  "Python-2.0",
  "BlueOak-1.0.0",
  "0BSD",
  "(MIT OR CC0-1.0)",
]);
const issues = [];
const entries = [];
for (const [path, info] of Object.entries(lock.packages)) {
  if (!path) continue;
  const installed = existsSync(join(path, "package.json"));
  const name = path.split("node_modules/").at(-1);
  if (!installed) {
    if (!info.optional) issues.push(`${name}: package not installed`);
    continue;
  }
  const pkg = JSON.parse(readFileSync(join(path, "package.json"), "utf8"));
  const files = readdirSync(path).filter((n) =>
    /^(licen[cs]e|copying|notice|copyright)(\.|-|$)/i.test(n),
  );
  const notices = [];
  for (const file of files) {
    try {
      notices.push({ file, text: readFileSync(join(path, file), "utf8") });
    } catch {
      /* Some packages use directories named LICENSE. */
    }
  }
  const license = typeof pkg.license === "string" ? pkg.license : info.license;
  if (!approved.has(license) && !["OFL-1.1", "CC-BY-4.0"].includes(license))
    issues.push(`${name}@${pkg.version}: review license ${license}`);
  if (!notices.length) {
    const upstream = supplemental.find(
      (n) => n.name === name && n.version === pkg.version,
    );
    if (upstream)
      notices.push({
        file: upstream.file,
        source: upstream.source,
        text: readFileSync(join("docs/licenses", upstream.file), "utf8"),
      });
  }
  if (!notices.length) {
    const readme = readdirSync(path).find((n) => /^readme(\.|$)/i.test(n));
    if (readme) {
      const content = readFileSync(join(path, readme), "utf8");
      const match = content.match(
        /(?:^|\n)#{1,3} (?:License|Copyright)[^\n]*\n([\s\S]*)/i,
      );
      if (match) notices.push({ file: readme, text: match[0] });
    }
    if (!notices.length)
      issues.push(
        `${name}@${pkg.version}: no distributed license text; metadata says ${license}`,
      );
  }
  let source =
    typeof pkg.repository === "string" ? pkg.repository : pkg.repository?.url;
  if (source?.startsWith("git+")) source = source.slice(4);
  if (source?.startsWith("git://"))
    source = source.replace("git://", "https://");
  if (source?.startsWith("git@github.com:"))
    source = source.replace("git@github.com:", "https://github.com/");
  if (source && !source.includes("://"))
    source = "https://github.com/" + source;
  source =
    source?.replace(/\.git$/, "") || `https://www.npmjs.com/package/${name}`;
  entries.push({
    name,
    version: pkg.version,
    description: pkg.description || "Third-party software dependency.",
    license,
    source,
    path,
    scope: info.dev ? "development" : "application",
    notices,
  });
}
const assets = [
  {
    name: "Inter variable font",
    license: "SIL OFL-1.1",
    description:
      "Variable typeface used throughout the website, distributed by Fontsource.",
    source: "https://github.com/rsms/inter",
    notices: [
      {
        file: "LICENSE",
        text: readFileSync(
          "node_modules/@fontsource-variable/inter/LICENSE",
          "utf8",
        ),
      },
    ],
  },
  {
    name: "shadcn/ui component source and styles (4.23.0)",
    license: "MIT",
    description:
      "Local UI components and styles in @/components/ui and @/styles; the unused shadcn CLI is not required at runtime.",
    source: "https://github.com/shadcn-ui/ui",
    notices: [
      {
        file: "LICENSE.md",
        text: readFileSync("docs/licenses/shadcn-MIT.txt", "utf8"),
      },
    ],
  },
  {
    name: "SQLite",
    license: "Public domain",
    description:
      "Database engine bundled with Node.js. Its public-domain status is explicitly accepted by the project owner.",
    source: "https://sqlite.org/copyright.html",
    notices: [],
  },
  {
    name: "Node.js",
    license: "MIT and bundled third-party notices",
    description:
      "JavaScript runtime with built-in HTTP, crypto, test, and SQLite modules. Not included in the website client bundle.",
    source: "https://github.com/nodejs/node",
    notices: [
      {
        file: "LICENSE",
        text: readFileSync("docs/licenses/node-LICENSE.txt", "utf8"),
      },
    ],
  },
  {
    name: "Gitleaks",
    license: "MIT",
    description:
      "Development-only secret scanner. Not installed as an application dependency or included in the website bundle.",
    source: "https://github.com/gitleaks/gitleaks",
    notices: [
      {
        file: "LICENSE",
        text: readFileSync("docs/licenses/gitleaks-MIT.txt", "utf8"),
      },
    ],
  },
  {
    name: "Git",
    license: "GPL-2.0",
    description:
      "Version-control development tool. Not included in the website distribution.",
    source: "https://git-scm.com",
    notices: [
      {
        file: "COPYING",
        text: readFileSync("docs/licenses/git-COPYING.txt", "utf8"),
      },
    ],
  },
];
const report = {
  generated: new Date().toISOString(),
  policy:
    "OSI-approved software licenses; OFL-1.1 fonts and CC-BY-4.0 data expressly allowed by owner. Audits cover installed lockfile packages, package notices, and preserved upstream notices. Optional platform packages not installed are not bundled by this build.",
  packages: entries.sort((a, b) => a.name.localeCompare(b.name)),
  assets,
  issues,
};
writeFileSync(
  "public/third-party-licenses.json",
  JSON.stringify(report, null, 2) + "\n",
);
writeFileSync(
  "docs/license-audit.md",
  `# Dependency license audit\n\nGenerated: ${report.generated}\n\n${report.policy}\n\n${entries.length} installed package entries reviewed. Full notices, versions, source links, and copyright statements: public/third-party-licenses.json and /licenses. These permissive software licenses allow commercial use subject to preserving their notices; MPL-2.0 requires its covered-file source availability when distributed; Apache-2.0 requires preserving license and applicable NOTICE texts. OFL font redistribution retains its license and reserved-name rules; CC-BY data retains attribution. \n\n## Unresolved\n\n${issues.map((i) => "- " + i).join("\n") || "No unapproved software licenses detected."}\n\n## Reproduce\n\nRun npm ci, then npm run licenses after every dependency change. Review the report and preserve public/third-party-licenses.json with distributed builds.\n`,
);
console.log(
  `${entries.length} packages; ${issues.length} notice/license issues`,
);
for (const issue of issues) console.log(issue);
