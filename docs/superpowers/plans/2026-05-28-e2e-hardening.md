# E2E Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing Playwright UJ1 journey test less fragile by moving it onto dedicated E2E ports, wiring the local dev proxy to those ports, and updating the documentation to match the real workflow.

**Architecture:** Keep the current test shape: Playwright starts a local backend and frontend dev server, and the journey test still mocks the API response. The hardening is limited to configuration and documentation, so the product path stays unchanged while the local test path becomes more explicit and less conflict-prone.

**Tech Stack:** Playwright, Vite, FastAPI/Uvicorn, npm, uv, Markdown docs

---

### Task 1: Introduce dedicated E2E port configuration

**Files:**
- Modify: `frontend/playwright.config.ts`
- Modify: `frontend/vite.config.ts`
- Test: `frontend/e2e/uj1.spec.ts`

- [ ] **Step 1: Inspect the current dev and E2E port wiring**

Check these files before editing:

```ts
// frontend/playwright.config.ts
baseURL: "http://127.0.0.1:4174"
// backend server starts on --port 8000
```

```ts
// frontend/vite.config.ts
server: {
  proxy: {
    "/api": "http://127.0.0.1:8000",
  },
}
```

- [ ] **Step 2: Write the failing expectation down in the config diff**

Target shape for the configuration:

```ts
const e2eFrontendPort = Number(process.env.SCM_E2E_FRONTEND_PORT ?? "14173");
const e2eBackendPort = Number(process.env.SCM_E2E_BACKEND_PORT ?? "18000");
```

```ts
use: {
  baseURL: `http://127.0.0.1:${e2eFrontendPort}`,
}
```

The goal is that Playwright and the frontend proxy both derive from the same dedicated E2E port values instead of assuming `4173` or `8000`.

- [ ] **Step 3: Implement minimal Playwright port centralisation**

Update `frontend/playwright.config.ts` along these lines:

```ts
import { defineConfig } from "@playwright/test";

const e2eFrontendPort = Number(process.env.SCM_E2E_FRONTEND_PORT ?? "14173");
const e2eBackendPort = Number(process.env.SCM_E2E_BACKEND_PORT ?? "18000");

export default defineConfig({
  testDir: "./e2e",
  use: {
    baseURL: `http://127.0.0.1:${e2eFrontendPort}`,
    headless: true,
  },
  webServer: [
    {
      command:
        `SCM_INITIALIZE_SCHEMA=1 SCM_DATABASE_URL=sqlite+pysqlite:///./e2e.db UV_CACHE_DIR=.uv-cache UV_PYTHON_INSTALL_DIR=.uv-python uv run uvicorn app.main:app --host 127.0.0.1 --port ${e2eBackendPort}`,
      cwd: "../backend",
      url: `http://127.0.0.1:${e2eBackendPort}/health`,
      reuseExistingServer: false,
    },
    {
      command: `SCM_API_BASE_URL=http://127.0.0.1:${e2eBackendPort} npm run dev -- --host 127.0.0.1 --port ${e2eFrontendPort}`,
      cwd: ".",
      url: `http://127.0.0.1:${e2eFrontendPort}`,
      reuseExistingServer: false,
    },
  ],
});
```

- [ ] **Step 4: Make the Vite dev proxy configurable**

Update `frontend/vite.config.ts` so the dev proxy reads from an environment variable while preserving the normal local default:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const apiBaseUrl = process.env.SCM_API_BASE_URL ?? "http://127.0.0.1:8000";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": apiBaseUrl,
    },
  },
  test: {
    environment: "jsdom",
    exclude: ["e2e/**"],
  },
});
```

- [ ] **Step 5: Run the journey test path**

Run:

```bash
cd /Users/robert/code/scm-01/frontend
npm run test:e2e
```

Expected:
- if Playwright browsers are installed, the test should start against the new dedicated ports
- if browsers are still missing, the failure should happen after the server startup phase, not because the setup still depends on `4173` or `8000`

- [ ] **Step 6: Commit**

```bash
git add /Users/robert/code/scm-01/frontend/playwright.config.ts /Users/robert/code/scm-01/frontend/vite.config.ts
git commit -m "test: isolate Playwright onto dedicated E2E ports"
```

### Task 2: Update developer-facing E2E documentation

**Files:**
- Modify: `README.md`
- Modify: `docs/test-report.md`
- Modify: `docs/acceptance-checklist.md`

- [ ] **Step 1: Document the new local E2E workflow in the README**

Add or update the E2E section so it explicitly states:

```md
For the local Playwright journey test:

- install browsers once with `npx playwright install`
- the test starts dedicated local dev servers
- default E2E ports are separate from the normal dev/Compose ports
- ports can be overridden with `SCM_E2E_FRONTEND_PORT` and `SCM_E2E_BACKEND_PORT`
```

- [ ] **Step 2: Tighten the test report language**

Adjust `docs/test-report.md` so the E2E section reflects the hardened setup, for example:

```md
- the Playwright setup now uses dedicated E2E ports instead of the standard local dev/Compose ports
- port conflicts with `4173` and `8000` are therefore less likely, but custom local conflicts remain possible
```

If the rerun still fails for missing browsers, keep that limitation explicit.

- [ ] **Step 3: Align the acceptance checklist**

Refine the relevant bullet(s) in `docs/acceptance-checklist.md` to match the hardened setup language:

```md
- [ ] `cd frontend && npm run test:e2e`
  Der Testpfad nutzt dedizierte lokale E2E-Ports und benoetigt lokal installierte Playwright-Browser.
```

Do not overclaim a full green run unless it was actually observed in this branch.

- [ ] **Step 4: Review docs for consistency**

Run:

```bash
cd /Users/robert/code/scm-01
rg -n "4173|8000|Playwright|test:e2e|SCM_E2E_FRONTEND_PORT|SCM_E2E_BACKEND_PORT" README.md docs frontend/playwright.config.ts frontend/vite.config.ts
```

Expected:
- the old hard-coded E2E assumptions are gone or clearly limited to non-E2E contexts
- the new variable names appear consistently where needed

- [ ] **Step 5: Commit**

```bash
git add /Users/robert/code/scm-01/README.md /Users/robert/code/scm-01/docs/test-report.md /Users/robert/code/scm-01/docs/acceptance-checklist.md
git commit -m "docs: document dedicated E2E workflow"
```

### Task 3: Final verification and branch summary

**Files:**
- Modify: none required unless verification reveals a mismatch
- Verify: `frontend/playwright.config.ts`, `frontend/vite.config.ts`, `README.md`, `docs/test-report.md`, `docs/acceptance-checklist.md`

- [ ] **Step 1: Verify diff hygiene**

Run:

```bash
cd /Users/robert/code/scm-01
git diff --check
```

Expected: no output

- [ ] **Step 2: Re-run the smallest relevant checks**

Run:

```bash
cd /Users/robert/code/scm-01/frontend
npm run test -- --run
npm run build
```

Expected:
- Vitest passes
- Vite build passes

- [ ] **Step 3: Re-run Playwright once more**

Run:

```bash
cd /Users/robert/code/scm-01/frontend
npm run test:e2e
```

Expected:
- best case: the journey test passes on the dedicated E2E ports
- acceptable fallback: the run reaches the Playwright browser requirement cleanly and the limitation remains accurately documented

- [ ] **Step 4: Summarise the branch outcome**

Capture the final state in the implementation handoff:

```md
- dedicated E2E ports introduced
- frontend dev proxy is configurable for E2E
- docs updated to match the real local workflow
- note whether Playwright passed or remained blocked by missing browser binaries
```

- [ ] **Step 5: Commit any verification-only doc nits if needed**

If verification changes the wording in `docs/test-report.md` or `docs/acceptance-checklist.md`, commit them explicitly:

```bash
git add /Users/robert/code/scm-01/docs/test-report.md /Users/robert/code/scm-01/docs/acceptance-checklist.md
git commit -m "docs: refresh E2E verification notes"
```
