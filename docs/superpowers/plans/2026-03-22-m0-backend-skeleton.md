# M0 Backend Skeleton Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first SCM backend skeleton as a reproducible `uv`-managed FastAPI project with a minimal `/health` endpoint, one API test, initial `ruff` linting, and documented run/test commands.

**Architecture:** The backend starts as a deliberately small FastAPI package under `backend/app/`, with one bootstrap endpoint and one API test using `TestClient`. Tooling is pinned in `pyproject.toml` so `uv` can run tests and linting reproducibly without introducing any persistence, schema, or LLM concerns yet.

**Tech Stack:** Python 3.13, FastAPI, Uvicorn, pytest, Ruff, uv

---

## File Map

- Create: `backend/pyproject.toml`
- Create: `backend/app/__init__.py`
- Create: `backend/app/main.py`
- Create: `backend/tests/test_health.py`
- Modify: `README.md`

### Task 1: Create the failing health endpoint test

**Files:**
- Create: `backend/tests/test_health.py`
- Future implementation target: `backend/app/main.py`

- [ ] **Step 1: Write the failing test**

```python
from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_health_returns_ok_status() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}
```

- [ ] **Step 2: Run the test to verify it fails for the right reason**

Run:

```bash
cd backend && uv run pytest -q tests/test_health.py
```

Expected:

- command fails
- failure is due to missing project/app files or missing module import, not a typo in the test

### Task 2: Create minimal backend project metadata

**Files:**
- Create: `backend/pyproject.toml`
- Create: `backend/app/__init__.py`

- [ ] **Step 1: Add the minimal `pyproject.toml`**

Use this content:

```toml
[project]
name = "scm-backend"
version = "0.1.0"
description = "Backend skeleton for Social Cleanup Machine"
readme = "../README.md"
requires-python = ">=3.13,<3.14"
dependencies = [
  "fastapi>=0.115,<0.116",
  "uvicorn>=0.34,<0.35",
]

[dependency-groups]
dev = [
  "httpx>=0.28,<0.29",
  "pytest>=8.3,<9",
  "ruff>=0.11,<0.12",
]

[tool.pytest.ini_options]
pythonpath = ["."]
testpaths = ["tests"]

[tool.ruff]
line-length = 100
target-version = "py313"

[tool.ruff.lint]
select = ["E", "F", "I"]
```

- [ ] **Step 2: Add the package marker**

Create an empty file:

```python
# backend/app/__init__.py
```

- [ ] **Step 3: Re-run the single test**

Run:

```bash
cd backend && uv run pytest -q tests/test_health.py
```

Expected:

- command still fails
- failure now points at missing `app.main` or missing `app` object

### Task 3: Implement the minimal FastAPI app

**Files:**
- Create: `backend/app/main.py`
- Existing test: `backend/tests/test_health.py`

- [ ] **Step 1: Write the minimal implementation**

Use this content:

```python
from fastapi import FastAPI


app = FastAPI()


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
```

- [ ] **Step 2: Run the focused test to verify it passes**

Run:

```bash
cd backend && uv run pytest -q tests/test_health.py
```

Expected:

- `1 passed`

### Task 4: Add lint verification

**Files:**
- Verify: `backend/pyproject.toml`
- Verify: `backend/app/main.py`
- Verify: `backend/tests/test_health.py`

- [ ] **Step 1: Run Ruff**

Run:

```bash
cd backend && uv run ruff check .
```

Expected:

- `All checks passed!`

- [ ] **Step 2: If Ruff reports import sorting or style issues, make the minimal fix and rerun**

Run again:

```bash
cd backend && uv run ruff check .
```

Expected:

- `All checks passed!`

### Task 5: Document backend bootstrap commands

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add a minimal backend section to `README.md`**

Document these commands:

```bash
cd backend
uv run uvicorn app.main:app --reload
uv run pytest -q
uv run ruff check .
```

Also note that the backend targets Python 3.13 as defined by the repository baseline.

- [ ] **Step 2: Verify the README content matches the actual project files**

Check:

- commands reference existing files
- no DB, frontend, or Docker commands are introduced in this scope

### Task 6: Run final verification for M0 backend skeleton

**Files:**
- Verify: `backend/pyproject.toml`
- Verify: `backend/app/main.py`
- Verify: `backend/tests/test_health.py`
- Verify: `README.md`

- [ ] **Step 1: Run the backend test suite**

Run:

```bash
cd backend && uv run pytest -q
```

Expected:

- `1 passed`

- [ ] **Step 2: Run Ruff for the whole backend tree**

Run:

```bash
cd backend && uv run ruff check .
```

Expected:

- `All checks passed!`

- [ ] **Step 3: Record the changed files before commit**

Run:

```bash
git status --short
```

Expected changed files:

- `backend/pyproject.toml`
- `backend/app/__init__.py`
- `backend/app/main.py`
- `backend/tests/test_health.py`
- `README.md`

- [ ] **Step 4: Commit**

```bash
git add backend/pyproject.toml backend/app/__init__.py backend/app/main.py backend/tests/test_health.py README.md
git commit -m "feat: add backend skeleton health endpoint"
```
