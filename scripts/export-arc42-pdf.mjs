#!/usr/bin/env node

import { execFile as execFileCallback, spawn } from "node:child_process";
import { createRequire } from "node:module";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { promisify } from "node:util";

export const ARC42_CHAPTERS = [
  "docs/arc42/01_einfuehrung_und_ziele.md",
  "docs/arc42/02_randbedingungen.md",
  "docs/arc42/03_systemkontext_und_abgrenzung.md",
  "docs/arc42/04_loesungsstrategie.md",
  "docs/arc42/05_bausteinsicht.md",
  "docs/arc42/06_laufzeitsicht.md",
  "docs/arc42/07_verteilungssicht.md",
  "docs/arc42/08_querschnittliche_konzepte.md",
  "docs/arc42/09_architekturentscheidungen.md",
  "docs/arc42/10_qualitaetsszenarien.md",
  "docs/arc42/11_technische_risiken.md",
  "docs/arc42/12_glossar.md",
  "docs/ki-reflexion.md",
  "docs/hilfsmittelverzeichnis.md",
  "docs/selbstaendigkeitserklaerung.md",
];

const SCRIPT_PATH = fileURLToPath(import.meta.url);
const SCRIPT_DIR = path.dirname(SCRIPT_PATH);
const REPO_ROOT = path.resolve(SCRIPT_DIR, "..");
const execFile = promisify(execFileCallback);

export function getDefaultOutputPath(repoRoot = REPO_ROOT) {
  return path.join(repoRoot, "docs/arc42/dist/scm-arc42.pdf");
}

export function parseArgs(argv) {
  const parsed = {
    help: false,
    output: null,
    submissionDate: null,
    version: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
      continue;
    }

    if (arg === "--output" || arg === "-o") {
      const output = argv[index + 1];
      if (!output) {
        throw new Error("Missing value for --output.");
      }
      parsed.output = output;
      index += 1;
      continue;
    }

    if (arg === "--submission-date") {
      const submissionDate = argv[index + 1];
      if (!submissionDate) {
        throw new Error("Missing value for --submission-date.");
      }
      parsed.submissionDate = submissionDate;
      index += 1;
      continue;
    }

    if (arg === "--version") {
      const version = argv[index + 1];
      if (!version) {
        throw new Error("Missing value for --version.");
      }
      parsed.version = version;
      index += 1;
      continue;
    }

    throw new Error(`Unknown argument: ${arg}`);
  }

  return parsed;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function buildTitlePageHtml({
  documentVersion,
  gitReference,
  gitRevision,
  submissionDate,
}) {
  return `<section class="title-page" aria-label="Titelblatt">
  <div class="title-page-kicker">CAS AI-Assisted Software Engineering - FFHS</div>
  <h1>Social Cleanup Machine (SCM)</h1>
  <p class="title-page-subtitle">Software Architecture Document (SAD) auf Basis von arc42</p>

  <dl class="title-page-meta">
    <div>
      <dt>Autor</dt>
      <dd>Robert Hämmerli</dd>
    </div>
    <div>
      <dt>Dozierende</dt>
      <dd>Werner Schäfer<br>Daniel Senften</dd>
    </div>
    <div>
      <dt>Datum der Abgabe</dt>
      <dd>${escapeHtml(submissionDate)}</dd>
    </div>
    <div>
      <dt>Dokumentversion / Abgabeversion</dt>
      <dd>${escapeHtml(documentVersion)}</dd>
    </div>
    <div>
      <dt>Abgabestand</dt>
      <dd>${escapeHtml(gitReference)}</dd>
    </div>
    <div>
      <dt>Commit</dt>
      <dd>${escapeHtml(gitRevision)}</dd>
    </div>
    <div>
      <dt>GitHub-Repository</dt>
      <dd><a href="https://github.com/r0brt/scm-01">https://github.com/r0brt/scm-01</a></dd>
    </div>
  </dl>

  <p class="title-page-note">Quellcode, ADRs, Diagrammquellen, Testnachweise und ergänzende Governance-Dokumente liegen versioniert im GitHub-Repository.</p>
</section>`;
}

export function formatGitRevision({ isDirty, revision }) {
  return isDirty ? `${revision}-dirty` : revision;
}

export function buildPandocArgs({ cssPath, htmlPath, titlePagePath }) {
  return [
    ...ARC42_CHAPTERS,
    "--resource-path=docs/arc42:.",
    "--standalone",
    "--embed-resources",
    "--toc",
    "--number-sections",
    "--metadata",
    "pagetitle=SCM arc42 Architekturdokumentation",
    "--metadata",
    "toc-title=Inhaltsverzeichnis",
    "--include-before-body",
    titlePagePath,
    "--css",
    cssPath,
    "-o",
    htmlPath,
  ];
}

function printHelp() {
  console.log(`Usage: node scripts/export-arc42-pdf.mjs [--output <path>] [--submission-date <date>] [--version <version>]

Exports docs/arc42/*.md plus docs/ki-reflexion.md, docs/hilfsmittelverzeichnis.md and docs/selbstaendigkeitserklaerung.md to an A4 PDF via Pandoc HTML and Playwright/Chromium.

Default output:
  docs/arc42/dist/scm-arc42.pdf

Title page metadata:
  --submission-date <date>  Override the generated submission/export date.
  --version <version>       Override the git-derived document version.

Requirements:
  - pandoc available on PATH
  - frontend dependencies installed (cd frontend && npm install)
  - Playwright Chromium installed if missing (cd frontend && npx playwright install chromium)
`);
}

function resolveOutputPath(output, repoRoot = REPO_ROOT) {
  if (!output) {
    return getDefaultOutputPath(repoRoot);
  }

  return path.isAbsolute(output) ? output : path.resolve(repoRoot, output);
}

async function getGitOutput(args, repoRoot, fallback) {
  try {
    const { stdout } = await execFile("git", args, { cwd: repoRoot });
    return stdout.trim() || fallback;
  } catch {
    return fallback;
  }
}

async function resolveTitlePageMetadata({ repoRoot, submissionDate, version }) {
  const revision = await getGitOutput(["rev-parse", "--short=12", "HEAD"], repoRoot, "unknown");
  const exactTag = await getGitOutput(["describe", "--tags", "--exact-match"], repoRoot, "");
  const worktreeStatus = await getGitOutput(["status", "--porcelain"], repoRoot, "");
  const gitRevision = formatGitRevision({
    isDirty: worktreeStatus.length > 0,
    revision,
  });
  const gitReference = exactTag ? `Git Tag ${exactTag}` : `Commit ${gitRevision}`;
  const documentVersion =
    version ??
    (await getGitOutput(
      ["describe", "--tags", "--always", "--dirty"],
      repoRoot,
      gitRevision,
    ));

  return {
    documentVersion,
    gitReference,
    gitRevision,
    submissionDate: submissionDate ?? new Date().toISOString().slice(0, 10),
  };
}

function runCommand(command, args, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      ...options,
    });

    child.on("error", (error) => {
      if (error.code === "ENOENT") {
        reject(new Error(`Command not found: ${command}. Install it and try again.`));
        return;
      }
      reject(error);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
        return;
      }

      reject(new Error(`${command} exited with code ${code}.`));
    });
  });
}

function loadPlaywright(repoRoot = REPO_ROOT) {
  const require = createRequire(import.meta.url);

  try {
    const playwrightPath = require.resolve("playwright", {
      paths: [path.join(repoRoot, "frontend")],
    });
    return require(playwrightPath);
  } catch (error) {
    throw new Error(
      "Playwright not found. Run `cd frontend && npm install`, then try again.",
      { cause: error },
    );
  }
}

async function renderPdfWithBrowser({ htmlPath, outputPath, repoRoot }) {
  const { chromium } = loadPlaywright(repoRoot);
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
    await page.emulateMedia({ media: "print" });
    await page.pdf({
      path: outputPath,
      printBackground: true,
      preferCSSPageSize: true,
    });
  } finally {
    await browser.close();
  }
}

async function exportArc42Pdf({
  outputPath,
  repoRoot = REPO_ROOT,
  submissionDate = null,
  version = null,
}) {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "scm-arc42-export-"));
  const htmlPath = path.join(tempDir, "scm-arc42.html");
  const titlePagePath = path.join(tempDir, "title-page.html");
  const cssPath = path.join(repoRoot, "docs/arc42/print.css");

  try {
    await mkdir(path.dirname(outputPath), { recursive: true });
    const titlePageMetadata = await resolveTitlePageMetadata({
      repoRoot,
      submissionDate,
      version,
    });
    await writeFile(titlePagePath, buildTitlePageHtml(titlePageMetadata), "utf8");
    await runCommand("pandoc", buildPandocArgs({ cssPath, htmlPath, titlePagePath }), {
      cwd: repoRoot,
    });
    await renderPdfWithBrowser({ htmlPath, outputPath, repoRoot });
  } finally {
    await rm(tempDir, { force: true, recursive: true });
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help) {
    printHelp();
    return;
  }

  const outputPath = resolveOutputPath(args.output);
  await exportArc42Pdf({
    outputPath,
    submissionDate: args.submissionDate,
    version: args.version,
  });
  console.log(`arc42 PDF exported: ${outputPath}`);
}

if (SCRIPT_PATH === path.resolve(process.argv[1] ?? "")) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
