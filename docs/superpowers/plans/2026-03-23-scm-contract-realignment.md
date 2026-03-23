# SCM Contract Realignment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Realign SCM documentation, contract, backend, and frontend to the project-idea levels `symptome`, `ursachen`, `emotionen`, `narrative`, `mythen`, `essenz` without backward compatibility for old payloads.

**Architecture:** Treat this as one explicit contract reset. Update the source-of-truth docs first, then replace the JSON schema and prompt shape, then move backend producers/consumers and frontend rendering onto the same payload structure, and finally run the touched verification scope end to end.

**Tech Stack:** Markdown docs, JSON Schema, Python/FastAPI/Pydantic/pytest, React/TypeScript/Vitest, Vite

---

## File Map

- Create: `docs/scm.md`
- Modify: `docs/prd.md`
- Modify: `docs/arc42/05_bausteinsicht.md`
- Modify: `docs/arc42/06_laufzeitsicht.md`
- Modify: `docs/arc42/07_verteilungssicht.md`
- Modify: `docs/arc42/08_querschnittliche_konzepte.md`
- Modify: `docs/arc42/10_qualitaetsszenarien.md`
- Modify: `schemas/analysis.schema.json`
- Modify: `prompts/v1/analysis.md`
- Modify: `backend/app/models/analysis.py`
- Modify: `backend/app/llm/stub.py`
- Modify: `backend/tests/contracts/test_analysis_schema.py`
- Modify: `backend/tests/contracts/test_analysis_models.py`
- Modify: `backend/tests/api/test_analyses_api.py`
- Modify: `backend/tests/api/test_app_factory.py`
- Modify: `backend/tests/services/test_analysis_workflow.py`
- Modify: `backend/tests/llm/test_openai_adapter.py`
- Modify: `backend/tests/validation/test_repair_loop.py`
- Modify: `backend/tests/validation/test_validation_service.py`
- Modify: `backend/tests/fixtures/contracts/valid/analysis_minimal.json`
- Modify: `backend/tests/fixtures/contracts/valid/analysis_rich.json`
- Modify: `backend/tests/fixtures/contracts/invalid/missing_level.json`
- Modify: `backend/tests/fixtures/contracts/invalid/empty_punkte.json`
- Modify: `backend/tests/fixtures/contracts/invalid/non_string_punkt.json`
- Modify: `backend/tests/fixtures/contracts/invalid/missing_zusammenfassung.json`
- Modify: `backend/tests/fixtures/contracts/invalid/unknown_top_level_field.json`
- Modify: `frontend/src/types.ts`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/App.test.tsx`
- Modify: `frontend/e2e/uj1.spec.ts`
- Modify: `frontend/src/styles.css`

### Task 1: Source-Of-Truth Documentation Reset

**Files:**
- Create: `docs/scm.md`
- Modify: `docs/prd.md`
- Modify: `docs/arc42/05_bausteinsicht.md`
- Modify: `docs/arc42/06_laufzeitsicht.md`
- Modify: `docs/arc42/07_verteilungssicht.md`
- Modify: `docs/arc42/08_querschnittliche_konzepte.md`
- Modify: `docs/arc42/10_qualitaetsszenarien.md`

- [ ] **Step 1: Write the failing documentation consistency check mentally before editing**

Expected failures to eliminate:
- `docs/prd.md` still names `beobachtungen`, `erklaerungen`, `zuschreibungen`, `schlussfolgerungen`, `massnahmen`
- arc42 still describes the old contract and prompt/runtime assumptions
- `docs/scm.md` is missing entirely

- [ ] **Step 2: Add the project-idea source document**

Create `docs/scm.md` from the user-provided project idea, preserving these sections:

```md
# Projektidee: Social Clean-Up Machine
## Vision
## Loesungsansatz
### Analyse-Ebenen
- Symptome
- Ursachen
- Emotionen
- Narrative / Frames
- Mythen
- Essenz
```

The file must explicitly state that the six analysis levels are `symptome`, `ursachen`, `emotionen`, `narrative`, `mythen`, `essenz`.

- [ ] **Step 3: Rewrite PRD terminology to match the project idea**

Update `docs/prd.md` so all normative contract references use the new six levels. Replace old passages like:

```md
`beobachtungen`, `erklaerungen`, `emotionen`, `zuschreibungen`, `schlussfolgerungen`, `massnahmen`
```

with:

```md
`symptome`, `ursachen`, `emotionen`, `narrative`, `mythen`, `essenz`
```

Also update the problem framing so it mentions symptoms, causes, narratives, myths, and essence rather than the newer wording.

- [ ] **Step 4: Align arc42 chapters with the hard contract reset**

Update the listed arc42 chapters in German to reflect:
- `docs/scm.md` as fachliche Quelle
- six-level contract names
- prompt and schema reset
- explicit lack of backward compatibility for old payloads

- [ ] **Step 5: Self-review docs for cross-file consistency**

Run:

```bash
rg -n "beobachtungen|erklaerungen|zuschreibungen|schlussfolgerungen|massnahmen" docs
```

Expected: only historical/spec references remain, not normative product docs.

- [ ] **Step 6: Commit documentation reset**

```bash
git add docs/scm.md docs/prd.md docs/arc42/05_bausteinsicht.md docs/arc42/06_laufzeitsicht.md docs/arc42/07_verteilungssicht.md docs/arc42/08_querschnittliche_konzepte.md docs/arc42/10_qualitaetsszenarien.md
git commit -m "docs: realign scm contract source documents"
```

### Task 2: Contract Schema And Prompt Reset

**Files:**
- Modify: `schemas/analysis.schema.json`
- Modify: `prompts/v1/analysis.md`
- Modify: `backend/tests/contracts/test_analysis_schema.py`
- Modify: `backend/tests/contracts/test_analysis_models.py`
- Modify: `backend/tests/fixtures/contracts/valid/analysis_minimal.json`
- Modify: `backend/tests/fixtures/contracts/valid/analysis_rich.json`
- Modify: `backend/tests/fixtures/contracts/invalid/missing_level.json`
- Modify: `backend/tests/fixtures/contracts/invalid/empty_punkte.json`
- Modify: `backend/tests/fixtures/contracts/invalid/non_string_punkt.json`
- Modify: `backend/tests/fixtures/contracts/invalid/missing_zusammenfassung.json`
- Modify: `backend/tests/fixtures/contracts/invalid/unknown_top_level_field.json`

- [ ] **Step 1: Write the failing contract tests first**

Edit the fixtures and contract tests to expect the new payload shape:

```json
{
  "symptome": {
    "beschreibung": "Kurzbeschreibung.",
    "eintraege": [{"text": "Eintrag eins."}]
  }
}
```

Specific assertions to update:
- missing level should mention `essenz`
- empty collection path should be `["symptome", "eintraege"]`
- wrong item type path should be `["symptome", "eintraege", 0, "text"]`
- missing field should mention `beschreibung`

- [ ] **Step 2: Run contract tests to verify RED**

Run:

```bash
cd backend
UV_CACHE_DIR=../.uv-cache UV_PYTHON_INSTALL_DIR=../.uv-python uv run pytest -q tests/contracts
```

Expected: FAIL because schema/models still use old keys and old `zusammenfassung`/`punkte` fields.

- [ ] **Step 3: Implement the new schema and prompt contract**

Update `schemas/analysis.schema.json` to:
- require exactly `symptome`, `ursachen`, `emotionen`, `narrative`, `mythen`, `essenz`
- model each level as:

```json
"required": ["beschreibung", "eintraege"]
```

- define each `eintrag` as an object with required `text`
- forbid additional properties throughout

Update `prompts/v1/analysis.md` so it instructs the model to return those keys and field names exactly.

- [ ] **Step 4: Update contract model tests to the new payload**

Edit `backend/tests/contracts/test_analysis_models.py` so it validates the renamed model fields and the `beschreibung`/`eintraege[].text` structure.

- [ ] **Step 5: Run contract tests to verify GREEN**

Run:

```bash
cd backend
UV_CACHE_DIR=../.uv-cache UV_PYTHON_INSTALL_DIR=../.uv-python uv run pytest -q tests/contracts
```

Expected: PASS

- [ ] **Step 6: Commit schema and prompt reset**

```bash
git add schemas/analysis.schema.json prompts/v1/analysis.md backend/tests/contracts backend/tests/fixtures/contracts
git commit -m "feat: reset scm analysis contract"
```

### Task 3: Backend Runtime Alignment

**Files:**
- Modify: `backend/app/models/analysis.py`
- Modify: `backend/app/llm/stub.py`
- Modify: `backend/tests/api/test_analyses_api.py`
- Modify: `backend/tests/api/test_app_factory.py`
- Modify: `backend/tests/services/test_analysis_workflow.py`
- Modify: `backend/tests/llm/test_openai_adapter.py`
- Modify: `backend/tests/validation/test_repair_loop.py`
- Modify: `backend/tests/validation/test_validation_service.py`

- [ ] **Step 1: Rewrite backend tests to the new payload shape**

Change all test payload builders from:

```python
"beobachtungen": {"zusammenfassung": text, "punkte": ["A"]}
```

to:

```python
"symptome": {"beschreibung": text, "eintraege": [{"text": "A"}]}
```

Do the same for all six levels in API, workflow, LLM adapter, and validation tests.

- [ ] **Step 2: Run touched backend tests to verify RED**

Run:

```bash
cd backend
UV_CACHE_DIR=../.uv-cache UV_PYTHON_INSTALL_DIR=../.uv-python uv run pytest -q tests/api tests/services tests/llm tests/validation
```

Expected: FAIL because runtime code still emits and validates the old shape.

- [ ] **Step 3: Update backend models and stub payloads**

Modify `backend/app/models/analysis.py` to use the structured model names from the original concept:

```python
class AnalyseEintrag(BaseModel):
    text: str = Field(min_length=1)

class AnalyseEbene(BaseModel):
    beschreibung: str = Field(min_length=1)
    eintraege: list[AnalyseEintrag] = Field(min_length=1)

class Analyse(BaseModel):
    symptome: AnalyseEbene
    ursachen: AnalyseEbene
    emotionen: AnalyseEbene
    narrative: AnalyseEbene
    mythen: AnalyseEbene
    essenz: AnalyseEbene
```

Update `backend/app/llm/stub.py` to emit the same structure for all six levels.

- [ ] **Step 4: Verify backend runtime remains wired to the same persistence envelope**

Keep `AnalysisRunResponse` and persistence metadata unchanged. Only `analysis_json` shape changes. Do not add migration or alias logic.

- [ ] **Step 5: Run touched backend tests to verify GREEN**

Run:

```bash
cd backend
UV_CACHE_DIR=../.uv-cache UV_PYTHON_INSTALL_DIR=../.uv-python uv run pytest -q tests/api tests/services tests/llm tests/validation
```

Expected: PASS

- [ ] **Step 6: Run backend lint on touched files**

Run:

```bash
cd backend
UV_CACHE_DIR=../.uv-cache UV_PYTHON_INSTALL_DIR=../.uv-python uv run ruff check app/models/analysis.py app/llm/stub.py tests/api/test_analyses_api.py tests/api/test_app_factory.py tests/services/test_analysis_workflow.py tests/llm/test_openai_adapter.py tests/validation/test_repair_loop.py tests/validation/test_validation_service.py
```

Expected: PASS

- [ ] **Step 7: Commit backend runtime alignment**

```bash
git add backend/app/models/analysis.py backend/app/llm/stub.py backend/tests/api/test_analyses_api.py backend/tests/api/test_app_factory.py backend/tests/services/test_analysis_workflow.py backend/tests/llm/test_openai_adapter.py backend/tests/validation/test_repair_loop.py backend/tests/validation/test_validation_service.py
git commit -m "feat: align backend with scm contract reset"
```

### Task 4: Frontend Pipeline Alignment

**Files:**
- Modify: `frontend/src/types.ts`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/App.test.tsx`
- Modify: `frontend/e2e/uj1.spec.ts`
- Modify: `frontend/src/styles.css`

- [ ] **Step 1: Write frontend tests for the new level names and shape**

Update `frontend/src/App.test.tsx` and `frontend/e2e/uj1.spec.ts` to expect:
- stage titles `Symptome`, `Ursachen`, `Emotionen`, `Narrative`, `Mythen`, `Essenz`
- level objects with `beschreibung` and `eintraege[].text`

Example fixture shape:

```ts
symptome: { beschreibung: "A", eintraege: [{ text: "A1" }] }
```

- [ ] **Step 2: Run frontend tests to verify RED**

Run:

```bash
cd frontend
npm run test -- --run
```

Expected: FAIL because types and rendering still read `zusammenfassung` and `punkte`.

- [ ] **Step 3: Update frontend types and pipeline metadata**

In `frontend/src/types.ts`, change the analysis types to:

```ts
export type AnalysisEntry = { text: string };
export type AnalysisLevel = { beschreibung: string; eintraege: AnalysisEntry[] };
```

and rename the top-level keys to the new six levels.

In `frontend/src/App.tsx`, replace the pipeline labels and descriptions with texts aligned to the project idea. Render the first three `eintraege` texts and the `beschreibung` field.

- [ ] **Step 4: Adjust any level-specific styles if class names are key-based**

If `frontend/src/styles.css` uses old key-derived class names such as:

```css
.level-card-beobachtungen::before
```

rename them to the new key names so the visual styling still applies.

- [ ] **Step 5: Run frontend tests and build to verify GREEN**

Run:

```bash
cd frontend
npm run test -- --run
npm run build
```

Expected: PASS

- [ ] **Step 6: Commit frontend alignment**

```bash
git add frontend/src/types.ts frontend/src/App.tsx frontend/src/App.test.tsx frontend/e2e/uj1.spec.ts frontend/src/styles.css
git commit -m "feat: align frontend with scm contract reset"
```

### Task 5: Final Consistency Verification

**Files:**
- Modify: any touched files from previous tasks only if verification exposes inconsistencies

- [ ] **Step 1: Search for stale normative references**

Run:

```bash
rg -n "beobachtungen|erklaerungen|zuschreibungen|schlussfolgerungen|massnahmen|zusammenfassung|punkte" docs backend frontend prompts schemas
```

Expected: only historical/spec-plan references remain, not active runtime or product files.

- [ ] **Step 2: Run backend verification suite**

Run:

```bash
cd backend
UV_CACHE_DIR=../.uv-cache UV_PYTHON_INSTALL_DIR=../.uv-python uv run pytest -q tests/contracts tests/api tests/services tests/llm tests/validation
```

Expected: PASS

- [ ] **Step 3: Run frontend verification suite**

Run:

```bash
cd frontend
npm run test -- --run
npm run build
```

Expected: PASS

- [ ] **Step 4: Run compose lifecycle only if touched docs/config justify it**

If prompt/runtime docs or visible product behavior changed enough to warrant end-to-end smoke verification, run:

```bash
docker compose up --build -d
docker compose ps
docker compose down
```

Expected: services start and stop cleanly.

- [ ] **Step 5: Commit any final cleanup**

```bash
git add docs backend frontend prompts schemas
git commit -m "chore: finalize scm contract realignment"
```

- [ ] **Step 6: Prepare branch summary**

Summarize:
- files changed
- hard incompatibility decision
- commands run
- residual risk: old persisted runs are not supported
