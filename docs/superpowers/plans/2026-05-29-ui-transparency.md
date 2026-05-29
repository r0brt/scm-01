# UI-Transparenz Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a subtle transparency notice to the existing analysis composer that clearly communicates the AI-assisted nature, data-sensitivity warning, storage possibility, and non-truth/non-legal-review limitation without changing UI behavior.

**Architecture:** Keep the change entirely inside the existing frontend presentation layer. The implementation is limited to the composer markup, matching stylesheet additions, one focused UI test update, and a live browser check to confirm the notice fits the current layout without disturbing the established flow.

**Tech Stack:** React, TypeScript, CSS, Vitest, in-app browser

---

### Task 1: Add the transparency notice to the composer markup

**Files:**
- Modify: `frontend/src/components/AnalysisComposer.tsx`
- Test: `frontend/src/App.test.tsx`

- [ ] **Step 1: Inspect the current composer structure**

Check the existing structure before editing:

```tsx
<form className="composer-panel" onSubmit={onSubmit}>
  <h1 className="composer-label">Problem</h1>
  <textarea ... />
  <div className="composer-actions">
    <button ...>Analyse starten</button>
  </div>
</form>
```

- [ ] **Step 2: Add a compact transparency block without changing behavior**

Update `frontend/src/components/AnalysisComposer.tsx` with a small static block between the textarea and the action area, for example:

```tsx
<div className="composer-transparency" role="note" aria-label="Transparenzhinweis">
  <p>KI-gestützte Analyse</p>
  <p>Keine sensiblen oder personenbezogenen Daten eingeben</p>
  <p>Eingaben und Resultate können gespeichert werden</p>
  <p>Keine Wahrheits- oder Rechtsprüfung</p>
</div>
```

Keep the exact wording calm and compact, but cover all four agreed content points.

- [ ] **Step 3: Add a focused UI assertion**

Extend `frontend/src/App.test.tsx` so the rendered Analyse-Ansicht asserts the visible transparency content, for example:

```tsx
expect(screen.getByRole("note", { name: "Transparenzhinweis" })).toBeInTheDocument();
expect(screen.getByText("KI-gestützte Analyse")).toBeInTheDocument();
expect(screen.getByText(/keine sensiblen oder personenbezogenen daten/i)).toBeInTheDocument();
expect(screen.getByText(/eingaben und resultate können gespeichert werden/i)).toBeInTheDocument();
expect(screen.getByText(/keine wahrheits- oder rechtsprüfung/i)).toBeInTheDocument();
```

Do not add interaction assertions; this round must not change behavior.

- [ ] **Step 4: Run the focused frontend test file**

Run:

```bash
cd /Users/robert/code/scm-01/frontend
npm run test -- --run
```

Expected: pass

- [ ] **Step 5: Commit**

```bash
git add /Users/robert/code/scm-01/frontend/src/components/AnalysisComposer.tsx /Users/robert/code/scm-01/frontend/src/App.test.tsx
git commit -m "feat: add composer transparency notice"
```

### Task 2: Style the notice to fit the existing UI language

**Files:**
- Modify: `frontend/src/styles.css`
- Test: `frontend/src/App.test.tsx`

- [ ] **Step 1: Find the existing composer visual language**

Look for the current styles around:

```css
.composer-panel
.composer-label
.composer-actions
textarea
```

The new notice must feel like part of this system, not like a warning banner pasted on top.

- [ ] **Step 2: Add minimal styles for the transparency block**

Introduce a restrained style block such as:

```css
.composer-transparency {
  display: grid;
  gap: 0.35rem;
  margin-top: 0.85rem;
  padding: 0.85rem 0.95rem;
  border: 1px solid var(--line-soft);
  border-radius: 14px;
  background: var(--panel-soft);
  color: var(--ink-muted);
  font-size: 0.9rem;
  line-height: 1.35;
}

.composer-transparency p {
  margin: 0;
}
```

Use the repo’s existing CSS variables and visual vocabulary where possible instead of inventing a new warning theme.

- [ ] **Step 3: Extend the stylesheet contract test only if needed**

If the stylesheet contract test in `App.test.tsx` checks for core class names, add only the minimal new expectation:

```tsx
expect(stylesheet).toContain(".composer-transparency");
```

- [ ] **Step 4: Run frontend tests and build**

Run:

```bash
cd /Users/robert/code/scm-01/frontend
npm run test -- --run
npm run build
```

Expected:
- tests pass
- build passes

- [ ] **Step 5: Commit**

```bash
git add /Users/robert/code/scm-01/frontend/src/styles.css /Users/robert/code/scm-01/frontend/src/App.test.tsx
git commit -m "style: integrate transparency notice into composer"
```

### Task 3: Live-check the UI in the browser

**Files:**
- Modify: none required unless the live check reveals a small presentational mismatch
- Verify: `frontend/src/components/AnalysisComposer.tsx`, `frontend/src/styles.css`

- [ ] **Step 1: Start the frontend locally**

Run:

```bash
cd /Users/robert/code/scm-01/frontend
npm run dev -- --host 127.0.0.1 --port 4173
```

Expected: local dev server starts

- [ ] **Step 2: Open the app in the browser tool**

Use the in-app browser to inspect `http://127.0.0.1:4173`.

Check specifically:
- the notice is visible without dominating the panel
- the composer still reads naturally top-to-bottom
- the button and textarea remain visually primary
- the note does not look like an error banner
- the compact/mobile layout still feels plausible

- [ ] **Step 3: Adjust only if the live view shows a real presentation problem**

If needed, make a tiny CSS-only refinement. Do not change content or behavior unless the current rendering is genuinely poor.

- [ ] **Step 4: Re-run the smallest relevant checks if you edited styling**

Run again if any code changed:

```bash
cd /Users/robert/code/scm-01/frontend
npm run test -- --run
npm run build
```

- [ ] **Step 5: Commit any live-check refinement**

If a small presentation refinement was needed:

```bash
git add /Users/robert/code/scm-01/frontend/src/styles.css /Users/robert/code/scm-01/frontend/src/App.test.tsx /Users/robert/code/scm-01/frontend/src/components/AnalysisComposer.tsx
git commit -m "style: refine transparency notice presentation"
```

### Task 4: Final verification and branch summary

**Files:**
- Modify: none required unless verification reveals a mismatch

- [ ] **Step 1: Verify diff hygiene**

Run:

```bash
cd /Users/robert/code/scm-01
git diff --check
```

Expected: no output

- [ ] **Step 2: Re-run frontend checks**

Run:

```bash
cd /Users/robert/code/scm-01/frontend
npm run test -- --run
npm run build
```

Expected: both pass

- [ ] **Step 3: Summarise the branch outcome**

Capture the final result in the implementation handoff:

```md
- composer now includes a subtle transparency notice
- all four agreed content points are visible
- no UI behavior changed
- tests/build pass
- live browser check confirms the notice fits the existing visual language
```

- [ ] **Step 4: Commit any final verification-only nits if needed**

Only if a tiny final mismatch was fixed during verification:

```bash
git add /Users/robert/code/scm-01/frontend/src/components/AnalysisComposer.tsx /Users/robert/code/scm-01/frontend/src/styles.css /Users/robert/code/scm-01/frontend/src/App.test.tsx
git commit -m "test: finalize UI transparency verification"
```
