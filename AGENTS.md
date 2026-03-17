# AGENTS.md

## 1. Purpose

This file defines the **working agreement** for AI coding agents (Codex) and the human maintainer in this repository.
Primary goals:

* predictable, reproducible changes
* minimal scope drift
* strong contracts + tests
* docs-as-code discipline (arc42/ADR)

## 2. Solo Project Mode (important)

This is a **solo project**. Governance must remain strict enough to prevent chaos, but never block progress.

Rules:

* PRs are **recommended** for meaningful changes (visibility + history), but may be skipped for tiny doc edits.
* “Required approvals” and CODEOWNERS are **not** mandatory in GitHub settings (since solo).
* Instead, every change must pass the **Self-Review Checklist** (Section 12) and required checks (tests).

## 3. Engineering Principles

1. Correctness over speed.
2. Small, reviewable changes over large risky batches.
3. No hidden side effects outside agreed scope.
4. Contracts before implementation (schema/API).
5. Reproducibility is mandatory (commands, tests, docs).
6. Prefer simple architecture that can evolve safely (avoid premature microservices).

## 4. Repository Layout (source of truth)

Target layout (may evolve, but keep stable once created):

* `backend/` — Python/FastAPI modular monolith
* `frontend/` — React UI
* `schemas/` — JSON schemas (versioned)
* `prompts/` — prompt templates (versioned)
* `docs/` — PRD + arc42 + ADR
* `PLAN.md` — delivery roadmap
* `AGENTS.md` — this file

Bootstrap note: initially only `prd.md`, `PLAN.md`, `AGENTS.md` may exist. The first Codex task should create the target layout and move `prd.md` into `docs/prd.md`.

If the repo differs initially, converge gradually; do not churn.

## 5. Tech Baseline

* Backend: Python + FastAPI
* Persistence: SQLAlchemy 2 + Alembic + PostgreSQL
* Frontend: React + Vite + TypeScript

Package tooling:

* Python: `uv`
* Frontend: `npm`

Distribution (project requirement alignment):

* “Distributed” runtime is achieved at minimum via containerized components (UI + API + DB). Microservices are optional and must be justified.

## 6. Coding Standards (Python)

General:

* Follow **PEP 8** formatting and naming.
* Prefer **Black-compatible** formatting (even if not enabled yet).
* Use **type hints** at module boundaries (public functions, adapters, DTOs).
* Docstrings for public functions/classes; keep them short.

Lint/Format/Types (recommended, incremental):

* **Ruff** as the primary linter/formatter (PEP8, import sorting, basic complexity checks).
* **mypy** (or pyright) can be enabled once module boundaries stabilize; start with non-strict.

Naming conventions:

* modules: `snake_case.py`
* classes: `PascalCase`
* functions/vars: `snake_case`
* constants: `UPPER_SNAKE_CASE`

Imports:

* Standard library, then third-party, then local (sorted).

Error handling:

* Use a small, explicit error taxonomy (error codes) and map to API error contract.

Quality commands (repo-standard):

* `cd backend && uv run ruff check .`
* (optional later) `cd backend && uv run ruff format .`

## 7. Codex Workflow (best practice)

Every Codex task must include:

* **Context references**: PRD + PLAN + AGENTS + relevant arc42 chapter.
* **One scoped deliverable** (no multi-epics).
* **Definition of Done**: exact commands + tests.
* **Output**: list files changed + suggested commit message.

Codex must:

* propose before making large structural changes
* never silently rename/move many files
* avoid speculative feature additions
* update relevant arc42 chapters whenever architecture, runtime, deployment, interfaces, or cross-cutting concerns change

Arc42 update triggers (minimum):

* API surface (OpenAPI, endpoints, error contract)
* data model/persistence/migrations
* deployment/runtime topology (compose, env vars)
* LLM integration details (adapter, prompt versioning, reliability guardrails)
* cross-cutting concerns (logging, correlation IDs, validation/repair, security assumptions)

Arc42 language rule:

* arc42 documentation under `docs/arc42/` must be written in German.

## 8. Contracts & Versioning (critical)

### 8.1 JSON Schema (LLM output)

* Schema files live under `schemas/` (e.g. `schemas/analysis.schema.json`).
* Any schema change requires:

  * contract tests updated/added
  * PRD + arc42 update if behavior changes

### 8.2 Prompt versioning

* Prompts live in `prompts/v1/...`
* `prompt_version` is the folder name (e.g. `v1`), optionally plus git short SHA in metadata.
* Prompt changes must be committed and must update `prompt_version` only when intentionally bumping.

### 8.3 API contract

* FastAPI OpenAPI is the API contract.
* When endpoints stabilize, export/snapshot `openapi.json` (optional) and update arc42 runtime/deployment views.

## 9. LLM/AI Reliability Guardrails

1. Provider access must be behind an adapter interface (port).
2. LLM output must follow strict JSON contract.
3. Schema validation is required before persistence.
4. Repair loop must be bounded (max 2).
5. Persist traceability fields: `prompt_version`, `model_id`, `run_status`, `validation_status`, `error_code` (if failed).
6. No silent fallback heuristics.

## 10. Testing Policy (pragmatic, non-overengineered)

Minimum pyramid:

* Unit tests for domain/application logic (mandatory)
* Integration tests for API + validation + persistence (mandatory for release)
* E2E: **at least one** critical journey test (UJ1) before final submission

Rules:

* No network calls in tests (mock LLM adapter).
* Contract tests exist as soon as schema exists.
* If a test is temporarily skipped, document: what/why/risk.

## 11. Git & Branch Strategy (solo-friendly)

* `main` is the trunk.
* Development happens on short-lived branches for non-trivial changes:

  * `feat/<slug>`, `fix/<slug>`, `docs/<slug>`, `refactor/<slug>`, `test/<slug>`

* Merge strategy:

  * squash merge recommended
  * small commits inside branch are fine

Direct pushes to `main`:

* not allowed (including docs). Always use a branch.

## 11.1 Push, PR & Change Workflow (solo, Codex-managed)

* Never work on `main`: no coding, no commits, no pushes on `main`.
* Always create/use a short-lived branch first (`feat/*`, `fix/*`, `docs/*`, `refactor/*`, `test/*`).
* Keep each branch scoped to one deliverable only (one milestone item or one clearly bounded documentation/process change).
* Push only when relevant tests/checks are green for the touched scope.
* `git` workflow is mandatory (`git switch -c ...`, `git add`, `git commit`, `git push`).
* `gh` is optional: if available, open a Draft PR for meaningful changes; otherwise open the GitHub compare URL manually and create the PR in the web UI.
* Meaningful or behavior-changing changes should go through a PR.
* Small, non-semantic documentation edits may be merged locally without a PR if the Self-Review Checklist is completed and the merge into `main` is fast-forward only.
* PR size guideline: target <= 200 changed LOC; hard cap <= 400 LOC, except mechanical-only changes (e.g., renames/format-only).

For every change, use the following workflow:

1. Sync `main` first:
   * `git switch main`
   * `git pull --ff-only`

2. Create a short-lived branch from `main`:
   * `docs/<slug>` for documentation/process changes
   * `feat/<slug>` for new functionality
   * `fix/<slug>` for bug fixes
   * `refactor/<slug>` for internal restructuring
   * `test/<slug>` for test-only changes

3. Implement only the scoped change for that branch.

4. Before committing, verify consistency with the repository source-of-truth documents:
   * `AGENTS.md` for workflow/governance
   * `PLAN.md` for milestone alignment
   * `docs/prd.md` for product intent
   * relevant `docs/arc42/` chapters if architecture, API, persistence, deployment, or cross-cutting concerns changed

5. Run the smallest relevant checks for the touched scope:
   * docs-only changes: self-review and consistency check
   * backend changes: relevant lint/tests
   * frontend changes: relevant build/tests
   * schema/contract changes: contract tests are mandatory

6. Commit with a precise message describing the change intent.

7. Integrate the branch:
   * meaningful or behavior-changing changes should go through a PR
   * tiny, non-semantic documentation changes may be merged locally without a PR
   * local merges into `main` without a PR must use fast-forward only:
     * `git switch main`
     * `git merge --ff-only <branch>`

8. After merge, push `main` and delete merged branches when no longer needed.

Rules:
* No direct edits on `main`.
* No merge to `main` without completing the Self-Review Checklist.
* Do not mix unrelated changes in one branch.
* Treat changes to `AGENTS.md`, `PLAN.md`, and `docs/prd.md` as high-impact documentation changes, not as casual doc edits.

## 12. Self-Review Checklist (mandatory for every change)

Before merge:

1. Scope is minimal and matches PLAN/PRD.
2. Tests run and pass (`uv run pytest`, plus frontend tests if touched).
3. Contracts validated (schema tests) if touched.
4. Docs updated if triggered (PRD/PLAN/arc42/ADR).
5. No secrets added; config via env vars / `.env.example`.
6. Any residual risk or TODO is documented (issue or PLAN note).

## 13. Definition of Done (DoD)

A change is done only if:

* implementation works
* tests pass
* docs are consistent
* commands to reproduce are written down (README or PR description)

## 14. Explicit Non-Goals

* No unrequested feature expansion.
* No premature microservices split.
* No “big refactor while adding features”.
* No flaky tests to “look good”.
