# Process Machine Frontend Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current frontend UI with a process-machine presentation that preserves backend contracts, existing product logic, and the fixed six-stage transformation model.

**Architecture:** Keep the existing frontend integration surface intact and redesign only the presentation layer around three explicit UI states: idle, processing, and completed. Reuse the current fetch and type contracts, preserve the stage derivation logic where possible, and replace the dashboard-like layout with a single-column analytical pipeline.

**Tech Stack:** React, Vite, TypeScript, CSS, Vitest, Playwright

---

## File Structure

- Modify: `frontend/src/App.tsx`
  - Keep submission, loading, error, run list refresh, and selected-run wiring.
  - Remove workspace tabs and main-view archive layout.
- Modify or replace: `frontend/src/components/AnalysisComposer.tsx`
  - Convert into the new idle-state `InputView`, or replace with a new component with the same responsibility.
- Modify or replace: `frontend/src/components/PipelineView.tsx`
  - Replace current mixed flow/review card system with lean processing/completed rendering.
- Modify or replace: `frontend/src/components/RunHistoryPanel.tsx`
  - Remove from the main flow; keep only if exposed as a secondary view or control.
- Create if needed: `frontend/src/components/Stage.tsx`
  - Shared stage renderer for processing/completed modes.
- Create if needed: `frontend/src/components/ResultView.tsx`
  - Completed-state rendering for all six stages.
- Modify: `frontend/src/pipeline.ts`
  - Preserve stage order, stage labels, reveal timing, and status derivation.
  - Only trim frontend-specific copy or behavior if needed for the three-state model.
- Modify: `frontend/src/styles.css`
  - Replace existing dark dashboard styling with light/neutral process-machine styling.
- Modify: `frontend/src/App.test.tsx`
  - Update assertions to match new state separation and reduced-density UI.
- Modify: `frontend/e2e/uj1.spec.ts`
  - Update UJ1 to validate the new main flow.

## Constraints

- Do not change `frontend/src/api.ts`.
- Do not change `frontend/src/types.ts` unless strictly required for TypeScript compatibility with unchanged backend contracts.
- Do not change backend behavior, schema, or API endpoints.
- Do not add new product features.
- Do not keep history, export actions, or dashboard widgets in the main pipeline view.

## Task 1: Simplify App-Level State Rendering

**Files:**
- Modify: `frontend/src/App.tsx`
- Test: `frontend/src/App.test.tsx`

- [ ] **Step 1: Identify the app-level UI branches that map to the three target states**

Map current frontend statuses to the target UI:

- `idle` -> idle view
- `submitting`, `result_received`, `revealing` -> processing view
- `completed` -> completed view
- `failed` -> terminal result/stop state within the same simplified shell

- [ ] **Step 2: Remove workspace tabs and split-layout rendering from `App.tsx`**

Delete or stop using:

- `workspaceTab`
- `showArchive`-driven main view switching
- `workspace-grid` review/archive split

Preserve:

- `text`
- `runs`
- `selectedRun`
- `loading`
- `error`
- `revealToken`
- submit/select/refresh handlers

- [ ] **Step 3: Render a single-column shell with conditional child views**

Use a simple structure:

```tsx
<main className="app-shell">
  <div className="app-frame">
    {isIdle ? <InputView ... /> : null}
    {isProcessing ? <PipelineView viewModel={pipelineViewModel} /> : null}
    {isCompletedLike ? <ResultView viewModel={pipelineViewModel} /> : null}
  </div>
</main>
```

- [ ] **Step 4: Keep error presentation minimal and outside the core flow**

Retain the existing request error handling, but render it as a concise banner that does not create a dashboard layout.

- [ ] **Step 5: Run app tests to catch state regressions early**

Run: `cd frontend && npm run test -- --run src/App.test.tsx`

Expected:

- tests fail because old UI assertions still expect tabs/archive/details behavior

## Task 2: Replace the Idle State with a Focused Input View

**Files:**
- Modify or replace: `frontend/src/components/AnalysisComposer.tsx`
- Modify: `frontend/src/styles.css`
- Test: `frontend/src/App.test.tsx`

- [ ] **Step 1: Reduce the idle view to one input field and one primary action**

Render only:

- a label or heading for the machine input
- one textarea
- one submit button

Do not render:

- archive tabs
- helper paragraphs
- extra panels
- decorative labels that compete with the input

- [ ] **Step 2: Preserve current form behavior**

Keep:

- `text`
- `onTextChange`
- `onSubmit`
- disabled submit when loading or input is empty after trim

- [ ] **Step 3: Update test coverage for the idle state**

Add or revise assertions so tests verify:

- the textarea is visible
- only one primary action is present
- pipeline result content is not visible before submission

- [ ] **Step 4: Run the targeted tests**

Run: `cd frontend && npm run test -- --run src/App.test.tsx`

Expected:

- idle-state assertions pass
- remaining tests still fail until processing/completed UI is updated

## Task 3: Rebuild the Processing View Around One Active Stage

**Files:**
- Modify or replace: `frontend/src/components/PipelineView.tsx`
- Create if needed: `frontend/src/components/Stage.tsx`
- Modify: `frontend/src/styles.css`
- Test: `frontend/src/App.test.tsx`

- [ ] **Step 1: Remove the current review/expand/detail behavior from the processing path**

Delete or stop using:

- expanded stage state
- stage toggles
- details buttons
- compact/review card branching tied to the old layout

- [ ] **Step 2: Render all six stages as a vertical process track**

Each stage should appear in order, but only one stage should be visually active.

Rules:

- previous stages reduced
- future stages muted
- active stage clearly emphasized

- [ ] **Step 3: Enforce the processing density rules**

For the active stage, render only:

- title
- max one short line
- max one to two bullet points

For inactive stages, render only minimal structural presence needed to understand progress.

- [ ] **Step 4: Preserve reveal behavior from `pipeline.ts`**

Do not replace the timing model. The UI should consume the existing active/completed statuses and render them differently.

- [ ] **Step 5: Keep scroll assistance only if still useful**

If active-stage scroll remains necessary, keep the smallest implementation needed. If the new single-column layout makes it unnecessary, remove it.

- [ ] **Step 6: Update processing-state tests**

Assert:

- processing view shows one active stage
- non-active stages are present but visually reduced through class/state rendering
- old archive controls and detail toggles are absent

- [ ] **Step 7: Run targeted tests**

Run: `cd frontend && npm run test -- --run src/App.test.tsx`

Expected:

- processing-state tests pass
- completed-state expectations may still fail

## Task 4: Build the Completed View as a Compact Full Pipeline

**Files:**
- Modify or replace: `frontend/src/components/PipelineView.tsx`
- Create if needed: `frontend/src/components/ResultView.tsx`
- Reuse or create: `frontend/src/components/Stage.tsx`
- Modify: `frontend/src/styles.css`
- Test: `frontend/src/App.test.tsx`

- [ ] **Step 1: Render all six stages together in one compact vertical structure**

Do not use:

- accordion behavior
- two-column dashboard grids
- cards used as isolated dashboard tiles

- [ ] **Step 2: Enforce completed-state density rules**

Each stage renders:

- title
- max one summary
- max two to three bullets

Use deterministic truncation via `slice` for entries and a compact summary display for `beschreibung`.

- [ ] **Step 3: Make `Essence` visually distinct but still part of the same flow**

Use:

- stronger border/accent
- subtle warm highlight
- terminal placement emphasis

Do not turn it into a decorative hero section or separate page block.

- [ ] **Step 4: Handle failed runs without creating a fourth layout family**

If `viewModel.status === "failed"`, render:

- a concise stop-state message
- fixed stage order still visible
- no fake completed content

- [ ] **Step 5: Update completed-state tests**

Assert:

- all six stages are visible together
- no “Details anzeigen” / “Details ausblenden” controls exist
- `Essenz` remains visible and emphasized in structure

- [ ] **Step 6: Run targeted tests**

Run: `cd frontend && npm run test -- --run src/App.test.tsx`

Expected:

- component tests pass for idle, processing, completed, and failed states

## Task 5: Demote or Isolate History Outside the Main Flow

**Files:**
- Modify: `frontend/src/App.tsx`
- Modify or replace: `frontend/src/components/RunHistoryPanel.tsx`
- Modify: `frontend/src/styles.css`
- Test: `frontend/src/App.test.tsx`

- [ ] **Step 1: Remove history from the default main pipeline view**

The main screen must not show:

- archive tabs
- side panels
- run list competing with the current analysis flow

- [ ] **Step 2: Preserve run access in the smallest acceptable secondary pattern**

If retaining history is necessary, expose it through one secondary trigger or secondary section outside the main flow, without changing the three-state content model.

- [ ] **Step 3: Keep selection logic intact**

Do not break:

- `refreshRuns`
- `handleSelectRun`
- rendering of a selected past run

- [ ] **Step 4: Update tests that currently depend on the archive tab**

Replace tab-click behavior with assertions against the new history access pattern, or remove those assertions if history is intentionally outside current test scope.

- [ ] **Step 5: Run targeted tests**

Run: `cd frontend && npm run test -- --run src/App.test.tsx`

Expected:

- no assertions depend on the old archive tab or split workspace layout

## Task 6: Rewrite the Visual System in CSS

**Files:**
- Modify: `frontend/src/styles.css`

- [ ] **Step 1: Replace the current dark dashboard theme with a neutral/light analytical theme**

Define CSS variables for:

- background
- text
- muted text
- line color
- processing accent
- completed accent
- essence highlight
- error color

- [ ] **Step 2: Set layout constraints for the new shell**

Implement:

- max width `960px`
- centered content
- single dominant vertical flow
- minimal persistent chrome

- [ ] **Step 3: Style the process-machine track**

Add:

- subtle vertical pipeline line
- active stage highlight
- reduced completed state
- muted future state

- [ ] **Step 4: Add minimal motion only where it supports state change**

Allowed:

- subtle fade/slide transitions
- light active-stage emphasis

Avoid:

- decorative movement
- pulsing chrome unrelated to process state

- [ ] **Step 5: Ensure mobile behavior keeps the single-column model**

At smaller widths:

- maintain the vertical pipeline
- avoid multi-column fallbacks
- preserve readable spacing

## Task 7: Update Automated Verification for the New UI

**Files:**
- Modify: `frontend/src/App.test.tsx`
- Modify: `frontend/e2e/uj1.spec.ts`

- [ ] **Step 1: Rewrite unit/integration-style UI tests to match the new state model**

Cover:

- idle: focused input-only view
- processing: one active stage
- completed: all six stages visible
- failed: clear stop state without dashboard artifacts

- [ ] **Step 2: Update the E2E journey**

UJ1 should assert:

- user can submit text
- processing state appears
- completed pipeline becomes visible
- the main flow does not expose archive/dashboard clutter

- [ ] **Step 3: Run frontend tests**

Run: `cd frontend && npm run test -- --run`

Expected:

- PASS

- [ ] **Step 4: Run frontend build**

Run: `cd frontend && npm run build`

Expected:

- PASS

## Task 8: Produce Final Verification Evidence

**Files:**
- No required file changes unless screenshots or notes are stored intentionally

- [ ] **Step 1: Start the frontend in a runnable state for manual capture**

Run: `cd frontend && npm run dev -- --host 127.0.0.1 --port 4173`

Expected:

- local frontend available for visual verification

- [ ] **Step 2: Capture screenshots for the three required states**

Capture:

- Idle
- Processing
- Completed

- [ ] **Step 3: Record exact commands run**

Minimum:

- `cd frontend && npm run test -- --run`
- `cd frontend && npm run build`
- dev/start command used for screenshots

## Non-Goals

- No backend contract changes
- No schema changes
- No data model changes
- No new user features
- No chat-like interaction model
- No settings/auth/notification system
- No third-party UI kit integration
- No unrelated frontend refactor outside the redesign path

## Risks and Notes

- `failed` is outside the requested three-state UX framing but already exists in product behavior; keep it minimal and structurally consistent.
- The existing PRD includes history and JSON export scope, but the redesign request explicitly removes those from the main flow. Keep any retained access secondary.
- The current tests are strongly coupled to the old UI; most frontend verification effort will be in test replacement rather than business logic changes.
- Long backend-provided summaries may need truncation in the completed view to stay within the density rules without changing backend output.
