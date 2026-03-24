# Analyse/Archiv IA Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the frontend into two clear top-level tabs, a compact analysis input, and a reduced pipeline that separates active analysis from archive browsing.

**Architecture:** Keep the existing frontend API and run model unchanged while reorganizing the app around `Analyse` and `Archiv`. `Analyse` owns input and pipeline; `Archiv` owns only run selection. Use the existing pipeline view model, but simplify rendering density and visual hierarchy so each stage is scannable in under a second.

**Tech Stack:** React, Vite, TypeScript, CSS, Vitest, Playwright

---

## File Structure

- Modify: `frontend/src/App.tsx`
  - Add the top-level tab state and move archive access out of the analysis pane.
- Modify: `frontend/src/components/AnalysisComposer.tsx`
  - Reduce it to a compact secondary input block.
- Modify: `frontend/src/components/RunHistoryPanel.tsx`
  - Keep it as the archive list and ensure the empty state remains accessible.
- Modify: `frontend/src/components/PipelineView.tsx`
  - Remove explanatory framing and global status UI.
- Modify: `frontend/src/components/Stage.tsx`
  - Enforce short bullets, de-emphasis, and `Essenz` emphasis.
- Modify: `frontend/src/styles.css`
  - Rebuild the visual hierarchy around tabs, compact input, and a quieter pipeline.
- Modify: `frontend/src/App.test.tsx`
  - Replace tests that assert mixed pipeline/history behavior with tests for the new IA.
- Modify: `frontend/e2e/uj1.spec.ts`
  - Align the critical path with the new visible labels if needed.

## Constraints

- Keep API contracts and types unchanged.
- Honor the explicit user request to remove the visible JSON button from this UI refactor, even though earlier product docs mentioned it.
- Keep archive browsing out of the analysis view.
- Preserve the existing run loading and reveal logic unless a test proves it blocks the new IA.
- Keep labels exactly as requested: `Analyse`, `Archiv`, `Problem eingeben`, `Analyse starten`.

### Task 1: App shell and tab architecture

**Files:**
- Modify: `frontend/src/App.tsx`
- Test: `frontend/src/App.test.tsx`

- [ ] **Step 1: Write a failing app-shell test**

Add a test that expects:

- tab buttons `Analyse` and `Archiv`
- archive visible even with zero runs
- empty analysis state shows `Noch keine Analyse gestartet`

- [ ] **Step 2: Run the targeted test and verify failure**

Run: `cd frontend && npm run test -- --run src/App.test.tsx`
Expected: FAIL because the current UI still uses the mixed layout.

- [ ] **Step 3: Implement minimal tab state in `App.tsx`**

Add:

- active tab state
- archive-only rendering in `Archiv`
- analysis-only rendering in `Analyse`

- [ ] **Step 4: Re-run the targeted test**

Run: `cd frontend && npm run test -- --run src/App.test.tsx`
Expected: the new shell assertions pass.

### Task 2: Archive selection flow

**Files:**
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/components/RunHistoryPanel.tsx`
- Test: `frontend/src/App.test.tsx`

- [ ] **Step 1: Write a failing interaction test**

Add a test that clicks a run in `Archiv` and expects:

- detail API call
- automatic tab switch to `Analyse`
- textarea populated with the run `input_text`
- no tab switch if the detail request fails
- visible error banner if the detail request fails

- [ ] **Step 2: Run the targeted test and verify failure**

Run: `cd frontend && npm run test -- --run src/App.test.tsx`
Expected: FAIL because the current selection flow does not manage the new tab behavior.

- [ ] **Step 3: Implement minimal archive-load behavior**

Update the run selection handler so it:

- fetches the run
- sets `selectedRun`
- sets `text` from `input_text`
- switches to `Analyse`
- keeps the current tab and selection stable on request failure

- [ ] **Step 4: Re-run the targeted test**

Run: `cd frontend && npm run test -- --run src/App.test.tsx`
Expected: archive-load assertions pass.

### Task 3: Compact analysis input and empty state

**Files:**
- Modify: `frontend/src/components/AnalysisComposer.tsx`
- Modify: `frontend/src/styles.css`
- Test: `frontend/src/App.test.tsx`

- [ ] **Step 1: Write a failing presentation test**

Assert:

- heading `Problem eingeben`
- submit button `Analyse starten`
- no old labels like `Maschine einspeisen`

- [ ] **Step 2: Run the targeted test and verify failure**

Run: `cd frontend && npm run test -- --run src/App.test.tsx`
Expected: FAIL until labels and empty-state structure are updated.

- [ ] **Step 3: Implement the compact composer**

Reduce height, padding, and visual weight while preserving:

- textarea binding
- submit behavior
- loading disable state

- [ ] **Step 4: Re-run the targeted test**

Run: `cd frontend && npm run test -- --run src/App.test.tsx`
Expected: composer assertions pass.

### Task 4: Pipeline reduction and stage emphasis

**Files:**
- Modify: `frontend/src/components/PipelineView.tsx`
- Modify: `frontend/src/components/Stage.tsx`
- Modify: `frontend/src/styles.css`
- Test: `frontend/src/App.test.tsx`

- [ ] **Step 1: Write failing pipeline tests**

Cover:

- processing view shows one active emphasized stage
- inactive stages are de-emphasized
- no JSON button or global status bars
- completed view shows all six stages
- `Essenz` has the strongest visual marker
- each stage renders at most 2-3 bullet points
- assertions use stable roles, labels, classes, and `data-*` attributes instead of subjective wording

- [ ] **Step 2: Run the targeted test and verify failure**

Run: `cd frontend && npm run test -- --run src/App.test.tsx`
Expected: FAIL because the current pipeline still contains extra framing and outdated density.

- [ ] **Step 3: Implement the reduced pipeline**

Keep the existing stage order and reveal mechanics, but:

- strip explanatory paragraphs
- render only short bullets
- use clear active/inactive stage variants
- emphasize `Essenz` in terminal states

- [ ] **Step 4: Re-run the targeted test**

Run: `cd frontend && npm run test -- --run src/App.test.tsx`
Expected: pipeline assertions pass.

### Task 5: Full verification

**Files:**
- Modify as needed: `frontend/e2e/uj1.spec.ts`

- [ ] **Step 1: Run the full frontend unit suite**

Run: `cd frontend && npm run test -- --run`
Expected: PASS

- [ ] **Step 2: Run the frontend build**

Run: `cd frontend && npm run build`
Expected: PASS

- [ ] **Step 3: Run the frontend E2E path if labels changed enough to require it**

Run: `cd frontend && npm run test:e2e`
Expected: PASS, or document why not run.
