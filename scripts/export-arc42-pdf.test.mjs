import assert from "node:assert/strict";
import test from "node:test";

import {
  ARC42_CHAPTERS,
  buildTitlePageHtml,
  buildPandocArgs,
  formatLinkRevision,
  formatGitRevision,
  getDefaultOutputPath,
  parseArgs,
  rewriteRepoLinksToGitHub,
} from "./export-arc42-pdf.mjs";

test("defines the arc42 chapters in document order", () => {
  assert.equal(ARC42_CHAPTERS.length, 15);
  assert.equal(ARC42_CHAPTERS[0], "docs/arc42/01_einfuehrung_und_ziele.md");
  assert.equal(ARC42_CHAPTERS.at(-4), "docs/arc42/12_glossar.md");
  assert.equal(ARC42_CHAPTERS.at(-3), "docs/ki-reflexion.md");
  assert.equal(ARC42_CHAPTERS.at(-2), "docs/hilfsmittelverzeichnis.md");
  assert.equal(ARC42_CHAPTERS.at(-1), "docs/selbstaendigkeitserklaerung.md");
});

test("uses the repository arc42 dist folder as default output", () => {
  assert.equal(getDefaultOutputPath("/repo"), "/repo/docs/arc42/dist/scm-arc42.pdf");
});

test("parses an explicit output path", () => {
  assert.deepEqual(parseArgs(["--output", "/tmp/arc42.pdf"]), {
    help: false,
    output: "/tmp/arc42.pdf",
    submissionDate: null,
    version: null,
  });
});

test("parses title page metadata options", () => {
  assert.deepEqual(
    parseArgs([
      "--submission-date",
      "2026-06-30",
      "--version",
      "v1.0.0",
    ]),
    {
      help: false,
      output: null,
      submissionDate: "2026-06-30",
      version: "v1.0.0",
    },
  );
});

test("builds a title page with submission and git metadata", () => {
  const html = buildTitlePageHtml({
    documentVersion: "v1.0.0",
    gitReference: "Git Tag v1.0.0",
    gitRevision: "abc1234",
    submissionDate: "2026-06-30",
  });

  assert.match(html, /Social Cleanup Machine/);
  assert.match(html, /Software Architecture Document \(SAD\) auf Basis von arc42/);
  assert.match(html, /CAS AI-Assisted Software Engineering - FFHS/);
  assert.match(html, /Robert Hämmerli/);
  assert.match(html, /Dozierende/);
  assert.match(html, /Werner Schäfer/);
  assert.match(html, /Daniel Senften/);
  assert.match(html, /2026-06-30/);
  assert.match(html, /v1\.0\.0/);
  assert.match(html, /Abgabestand/);
  assert.match(html, /Git Tag v1\.0\.0/);
  assert.match(html, /Commit/);
  assert.match(html, /abc1234/);
  assert.match(html, /https:\/\/github\.com\/r0brt\/scm-01/);
});

test("omits duplicate commit row when the submission state is already a commit", () => {
  const html = buildTitlePageHtml({
    documentVersion: "v1.0.0",
    gitReference: "Commit abc1234",
    gitRevision: "abc1234",
    submissionDate: "2026-07-03",
  });

  assert.equal((html.match(/<dt>Commit<\/dt>/g) ?? []).length, 0);
  assert.match(html, /<dt>Abgabestand<\/dt>\s*<dd>Commit abc1234<\/dd>/);
});

test("rewrites repository-relative PDF links to commit-specific GitHub links", () => {
  const html = [
    '<a href="../diagrams/db-erd.puml">ERD</a>',
    '<a href="../adr/">ADRs</a>',
    '<a href="https://github.com/r0brt/scm-01/blob/main/docs/adr/0001-architecture-style.md">ADR</a>',
    '<a href="#toc">TOC</a>',
    '<a href="https://example.com">External</a>',
    '<img src="../diagrams/rendered/db-erd.svg">',
  ].join("");

  assert.equal(
    rewriteRepoLinksToGitHub({
      gitRevision: "abc1234",
      html,
      repoRoot: "/repo",
    }),
    [
      '<a href="https://github.com/r0brt/scm-01/blob/abc1234/docs/diagrams/db-erd.puml">ERD</a>',
      '<a href="https://github.com/r0brt/scm-01/tree/abc1234/docs/adr">ADRs</a>',
      '<a href="https://github.com/r0brt/scm-01/blob/abc1234/docs/adr/0001-architecture-style.md">ADR</a>',
      '<a href="#toc">TOC</a>',
      '<a href="https://example.com">External</a>',
      '<img src="../diagrams/rendered/db-erd.svg">',
    ].join(""),
  );
});

test("uses an exact git tag for repository links when available", () => {
  assert.equal(
    formatLinkRevision({ exactTag: "v1.0.0", revision: "abc1234" }),
    "v1.0.0",
  );
  assert.equal(
    formatLinkRevision({ exactTag: "", revision: "abc1234" }),
    "abc1234",
  );
  assert.equal(
    rewriteRepoLinksToGitHub({
      gitRevision: "v1.0.0",
      html: '<a href="../diagrams/db-erd.puml">ERD</a>',
      repoRoot: "/repo",
    }),
    '<a href="https://github.com/r0brt/scm-01/blob/v1.0.0/docs/diagrams/db-erd.puml">ERD</a>',
  );
});

test("marks the title page git revision as dirty when the worktree is not clean", () => {
  assert.equal(
    formatGitRevision({ isDirty: true, revision: "abc1234" }),
    "abc1234-dirty",
  );
  assert.equal(
    formatGitRevision({ isDirty: false, revision: "abc1234" }),
    "abc1234",
  );
});

test("builds pandoc arguments with embedded resources, title page and arc42 resource path", () => {
  const args = buildPandocArgs({
    cssPath: "/repo/docs/arc42/print.css",
    htmlPath: "/tmp/scm-arc42.html",
    titlePagePath: "/tmp/title-page.html",
  });

  assert.equal(args[0], "docs/arc42/01_einfuehrung_und_ziele.md");
  assert.ok(args.includes("--embed-resources"));
  assert.ok(args.includes("--toc"));
  assert.ok(args.includes("--number-sections"));
  assert.ok(args.includes("--resource-path=docs/arc42:."));
  assert.ok(args.includes("--include-before-body"));
  assert.ok(args.includes("/tmp/title-page.html"));
  assert.ok(args.includes("--css"));
  assert.ok(args.includes("/repo/docs/arc42/print.css"));
  assert.deepEqual(args.slice(-2), ["-o", "/tmp/scm-arc42.html"]);
});
