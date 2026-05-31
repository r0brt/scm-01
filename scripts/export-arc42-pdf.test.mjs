import assert from "node:assert/strict";
import test from "node:test";

import {
  ARC42_CHAPTERS,
  buildPandocArgs,
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
  });
});

test("builds pandoc arguments with embedded resources and arc42 resource path", () => {
  const args = buildPandocArgs({
    cssPath: "/repo/docs/arc42/print.css",
    htmlPath: "/tmp/scm-arc42.html",
    repoRoot: "/repo",
  });

  assert.equal(args[0], "docs/arc42/01_einfuehrung_und_ziele.md");
  assert.ok(args.includes("--embed-resources"));
  assert.ok(args.includes("--toc"));
  assert.ok(args.includes("--number-sections"));
  assert.ok(args.includes("--resource-path=docs/arc42:."));
  assert.ok(args.includes("--css"));
  assert.ok(args.includes("/repo/docs/arc42/print.css"));
  assert.deepEqual(args.slice(-2), ["-o", "/tmp/scm-arc42.html"]);
});
