# NFR Acceptance Evidence Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bring the test report and acceptance checklist to the current `main` state and make the NFR evidence status explicit without overstating unmeasured qualities.

**Architecture:** This is a docs-only evidence update. The implementation, runtime topology and UI behaviour remain unchanged. The documentation separates verified checks from known gaps for NFR1, NFR3 and NFR5.

**Tech Stack:** Markdown docs, pytest, Ruff, Vitest, Vite, GitHub Actions.

---

## Scope

- Update `docs/test-report.md` to the current `main` baseline after PR #47.
- Update `docs/acceptance-checklist.md` with current CI and NFR evidence status.
- Add or refine arc42 quality-scenario wording only if needed to avoid overclaiming measured NFRs.
- Run and document only checks that are actually executed in this PR.

## Non-Scope

- Do not add new performance tooling.
- Do not add coverage tooling or change dependency locks.
- Do not implement an NFR1 aggregation script.
- Do not change runtime, API, UI, LLM or Repair behaviour.
- Do not alter diagrams.

## Files

- Modify: `docs/test-report.md`
- Modify: `docs/acceptance-checklist.md`
- Possibly modify: `docs/arc42/10_qualitaetsszenarien.md`

## Task 1: Collect current evidence

**Files:**
- Read: `docs/test-report.md`
- Read: `docs/acceptance-checklist.md`
- Read: `docs/prd.md`
- Read: `.github/workflows/ci.yml`

- [ ] **Step 1: Identify current baseline**

Run:

```bash
git rev-parse --short HEAD
gh run list --repo r0brt/scm-01 --branch main --limit 5
```

Expected result: current baseline is the latest merged `main` commit and the latest successful CI run is visible.

- [ ] **Step 2: Verify backend locally**

Run:

```bash
cd backend && UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 ruff check .
cd backend && UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 pytest -q
```

Expected result: Ruff passes and backend tests pass.

- [ ] **Step 3: Verify frontend locally**

Run:

```bash
cd frontend && npm run test -- --run
cd frontend && npm run build
```

Expected result: Vitest and production build pass.

- [ ] **Step 4: Inspect NFR evidence availability**

Confirm from the repository:

- NFR1 has fixture coverage and contract tests, but no automated aggregate run over real LLM outputs.
- NFR3 has no performance benchmark or p95 measurement.
- NFR5 has no coverage dependency or configured coverage command.

## Task 2: Update evidence documentation

**Files:**
- Modify: `docs/test-report.md`
- Modify: `docs/acceptance-checklist.md`
- Possibly modify: `docs/arc42/10_qualitaetsszenarien.md`

- [ ] **Step 1: Update `docs/test-report.md`**

Document the current baseline commit, latest CI run, actual local command results and a dedicated NFR evidence section. State clearly:

- NFR1 is structurally supported by schema/validation tests and 20 input fixtures, but the PRD metric `>=90%` over generated analyses is not yet measured.
- NFR3 `p95 < 5s` is not yet measured by an automated benchmark.
- NFR5 E2E is covered by one UJ1 path, but the `80%` backend coverage target is not measured because coverage tooling is not configured.

- [ ] **Step 2: Update `docs/acceptance-checklist.md`**

Refresh the current successful commands and CI reference. Add a compact NFR evidence block that distinguishes verified items from unmeasured targets.

- [ ] **Step 3: Update arc42 quality scenarios if needed**

If chapter 10 implies stronger measurement than the repository actually provides, adjust wording to separate functional/contract tests from unmeasured quantitative NFRs.

## Task 3: Verification and review

**Files:**
- Review: `docs/test-report.md`
- Review: `docs/acceptance-checklist.md`
- Review: `docs/arc42/10_qualitaetsszenarien.md` if touched

- [ ] **Step 1: Run documentation consistency searches**

Run:

```bash
rg -n "33aa027|26683234622|c0842aa|NFR1|NFR3|NFR5|Coverage|p95|90%" docs/test-report.md docs/acceptance-checklist.md docs/arc42/10_qualitaetsszenarien.md
```

Expected result: old baseline references are gone, and NFR limitations are explicit.

- [ ] **Step 2: Check worktree status**

Run:

```bash
git status --short
```

Expected result: only planned documentation files are changed.

## Task 4: Commit and PR preparation

- [ ] **Step 1: Review diff**

Run:

```bash
git diff -- docs/test-report.md docs/acceptance-checklist.md docs/arc42/10_qualitaetsszenarien.md docs/superpowers/plans/2026-05-30-nfr-acceptance-evidence.md
```

Expected result: docs-only NFR/evidence update, no implementation changes.

- [ ] **Step 2: Commit**

Run:

```bash
git add docs/test-report.md docs/acceptance-checklist.md docs/arc42/10_qualitaetsszenarien.md docs/superpowers/plans/2026-05-30-nfr-acceptance-evidence.md
git commit -m "docs: clarify nfr acceptance evidence"
```

- [ ] **Step 3: Push and open draft PR**

Run:

```bash
git push -u origin docs/nfr-acceptance-evidence
```

Open a draft PR with:

- Title: `Clarify NFR and acceptance evidence`
- Summary: `Refreshes current verification evidence and separates verified MVP checks from unmeasured NFR targets.`
- Verification: include the exact commands from Task 1 and Task 3.

## Self-Review

- Spec coverage: The plan covers current-main evidence, NFR1/NFR3/NFR5 transparency and acceptance-checklist consistency.
- Placeholder scan: The plan contains no placeholders or invented measurements.
- Scope control: No code, runtime, UI or architecture behaviour changes are planned.
