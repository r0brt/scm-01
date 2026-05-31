import assert from "node:assert/strict";
import test from "node:test";

import {
  ARC42_CHAPTERS,
  buildTitlePageHtml,
  buildPandocArgs,
  formatGitRevision,
  getDefaultOutputPath,
  parseArgs,
} from "./export-arc42-pdf.mjs";

test("defines the arc42 chapters in document order", () => {
  assert.equal(ARC42_CHAPTERS.length, 12);
  assert.equal(ARC42_CHAPTERS[0], "docs/arc42/01_einfuehrung_und_ziele.md");
  assert.equal(ARC42_CHAPTERS.at(-1), "docs/arc42/12_glossar.md");
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
    gitRevision: "abc1234",
    submissionDate: "2026-06-30",
  });

  assert.match(html, /Social Cleanup Machine/);
  assert.match(html, /arc42 Architekturdokumentation/);
  assert.match(html, /Robert Hämmerli/);
  assert.match(html, /2026-06-30/);
  assert.match(html, /v1\.0\.0/);
  assert.match(html, /abc1234/);
  assert.match(html, /https:\/\/github\.com\/r0brt\/scm-01/);
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
