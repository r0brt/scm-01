# Basic Quality Gate CI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a stable GitHub Actions basic quality gate for backend lint/tests and frontend tests/build without adding E2E or provider-dependent checks.

**Architecture:** A single workflow file under `.github/workflows/ci.yml` defines two parallel jobs: `backend` and `frontend`. The jobs mirror the repository's documented local quality commands and stay independent from Docker, Playwright browsers, and external AI providers.

**Tech Stack:** GitHub Actions, Python 3.13, `uv`, Ruff, pytest, Node.js, npm, Vitest, Vite

---

### Task 1: Add the GitHub Actions workflow

**Files:**
- Create: `.github/workflows/ci.yml`

- [x] **Step 1: Create workflow directory and file**

Create `.github/workflows/ci.yml` with this content:

```yaml
name: CI

on:
  pull_request:
  push:
    branches:
      - main

jobs:
  backend:
    name: Backend
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend
    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: "3.13"

      - name: Install uv
        uses: astral-sh/setup-uv@v5

      - name: Run Ruff
        run: uv run --python 3.13 ruff check .

      - name: Run pytest
        run: uv run --python 3.13 pytest -q

  frontend:
    name: Frontend
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - name: Check out repository
        uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: npm
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test -- --run

      - name: Build
        run: npm run build
```

- [x] **Step 2: Review workflow scope**

Check that the workflow does not include:

- Playwright install
- `npm run test:e2e`
- Docker Compose
- OpenAI/API secrets
- deployment steps

Expected: Workflow remains a CI-light quality gate only.

### Task 2: Document the CI quality gate

**Files:**
- Modify: `README.md`
- Modify: `docs/test-report.md`

- [x] **Step 1: Add README note**

Add a short section near the existing verification commands:

```markdown
## GitHub Actions CI

Pull Requests und Pushes auf `main` werden durch einen Basic Quality Gate geprüft:

- Backend: `ruff check` und `pytest`
- Frontend: Vitest-Run und Produktions-Build

E2E mit Playwright bleibt vorerst ein lokaler Nachweis und ist in `docs/test-report.md` dokumentiert.
```

- [x] **Step 2: Add test report note**

Add a short note to `docs/test-report.md`:

```markdown
## Automatisierter Quality Gate

GitHub Actions führt für Pull Requests und Pushes auf `main` einen Basic Quality Gate aus. Dieser umfasst Backend-Linting, Backend-Tests, Frontend-Unit-/UI-Tests und Frontend-Build. Playwright-E2E bleibt bewusst ausserhalb dieses ersten CI-Ausbaus.
```

### Task 3: Run local verification

**Files:**
- Inspect: command output only

- [x] **Step 1: Run backend lint**

Run:

```bash
cd /Users/robert/code/scm-01/backend
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 ruff check .
```

Expected: `All checks passed!`

- [x] **Step 2: Run backend tests**

Run:

```bash
cd /Users/robert/code/scm-01/backend
UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run --python 3.13 pytest -q
```

Expected: all tests pass.

- [x] **Step 3: Run frontend dependency install check**

Run:

```bash
cd /Users/robert/code/scm-01/frontend
npm ci
```

Expected: install completes successfully.

- [x] **Step 4: Run frontend tests**

Run:

```bash
cd /Users/robert/code/scm-01/frontend
npm run test -- --run
```

Expected: all tests pass.

- [x] **Step 5: Run frontend build**

Run:

```bash
cd /Users/robert/code/scm-01/frontend
npm run build
```

Expected: build completes successfully.

- [x] **Step 6: Check diff hygiene**

Run:

```bash
cd /Users/robert/code/scm-01
git diff --check
git status --short
```

Expected: no whitespace errors; only intended files changed.

### Task 4: Commit, push, PR, and confirm GitHub checks

**Files:**
- Inspect: GitHub PR checks

- [ ] **Step 1: Commit**

Run:

```bash
cd /Users/robert/code/scm-01
git add .github/workflows/ci.yml README.md docs/test-report.md docs/superpowers/specs/2026-05-30-basic-quality-gate-design.md docs/superpowers/plans/2026-05-30-basic-quality-gate.md
git commit -m "ci: add basic quality gate"
```

- [ ] **Step 2: Push branch**

Run:

```bash
git push -u origin test/basic-quality-gate
```

- [ ] **Step 3: Open PR**

Open a PR against `main` with title:

```text
Add basic quality gate CI
```

PR body should include:

- Backend: Ruff + pytest
- Frontend: Vitest + build
- E2E intentionally out of scope
- local verification commands and results

- [ ] **Step 4: Confirm GitHub checks appear**

Run:

```bash
gh pr checks <PR_NUMBER> --repo r0brt/scm-01
```

Expected: Backend and Frontend checks are reported. If any check fails, inspect logs and fix in a follow-up commit before merge.
