# LLM Repair Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the documented LLM configuration and Repair semantics consistent with the current implementation, without changing analysis behaviour.

**Architecture:** The backend keeps the existing adapter boundary. `SCM_OPENAI_MODEL` becomes an actual runtime input for the OpenAI adapter when `SCM_ANALYSIS_PROVIDER=openai` is active. Repair remains a prepared, tested guardrail and is explicitly documented as not wired into the current standard workflow.

**Tech Stack:** Python/FastAPI, pytest, Ruff, OpenAI adapter, arc42, ADR, PRD.

---

## Scope

- Use `SCM_OPENAI_MODEL` when constructing the OpenAI analysis adapter.
- Add a failing test first for the model configuration path.
- Align PRD, ADR and arc42 wording with the current Repair implementation.
- Correct small fachliche documentation inconsistencies found in the review.

## Non-Scope

- Do not activate the Repair loop in the standard workflow.
- Do not change frontend behaviour.
- Do not change the analysis run data model.
- Do not add NFR, coverage, performance or OpenAPI evidence.
- Do not change diagrams.

## Files

- Modify: `backend/app/main.py`
- Modify: `backend/tests/api/test_app_factory.py`
- Modify: `docs/prd.md`
- Modify: `docs/adr/0001-architecture-style.md`
- Modify: `docs/adr/0002-analysis-contract-and-validation.md`
- Modify: `docs/adr/0004-llm-adapter-and-prompt-versioning.md`
- Modify: `docs/arc42/02_randbedingungen.md`
- Modify: `docs/arc42/05_bausteinsicht.md`
- Modify: `docs/arc42/06_laufzeitsicht.md`
- Modify: `docs/arc42/08_querschnittliche_konzepte.md`
- Modify: `docs/arc42/11_technische_risiken.md`

## Task 1: Use `SCM_OPENAI_MODEL` in the OpenAI adapter path

**Files:**
- Modify: `backend/tests/api/test_app_factory.py`
- Modify: `backend/app/main.py`

- [ ] **Step 1: Write the failing test**

Add this test to `backend/tests/api/test_app_factory.py` after `test_create_app_uses_openai_adapter_when_configured`:

```python
def test_create_app_passes_configured_openai_model_to_adapter(
    monkeypatch,
    tmp_path,
) -> None:
    captured: dict[str, str] = {}

    class FakeOpenAIAnalysisGenerator:
        def __init__(self, *, model_id: str = "gpt-5.2") -> None:
            captured["model_id"] = model_id

        def generate_analysis(self, text: str, *, language: str | None = None):
            return {
                "payload": {
                    "symptome": {"beschreibung": text, "eintraege": [{"text": "A"}]},
                    "ursachen": {"beschreibung": text, "eintraege": [{"text": "B"}]},
                    "emotionen": {"beschreibung": text, "eintraege": [{"text": "C"}]},
                    "narrative": {"beschreibung": text, "eintraege": [{"text": "D"}]},
                    "mythen": {"beschreibung": text, "eintraege": [{"text": "E"}]},
                    "essenz": {"beschreibung": text, "eintraege": [{"text": "F"}]},
                },
                "model_id": captured["model_id"],
                "prompt_version": "v1",
            }

    monkeypatch.setenv("SCM_ANALYSIS_PROVIDER", "openai")
    monkeypatch.setenv("SCM_OPENAI_MODEL", "gpt-test-model")
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")
    monkeypatch.setattr("app.main.OpenAIAnalysisGenerator", FakeOpenAIAnalysisGenerator)

    app = create_app(
        database_url=f"sqlite+pysqlite:///{tmp_path / 'factory-model.db'}",
        initialize_schema=True,
    )
    client = TestClient(app)

    response = client.post("/api/v1/analyses", json={"text": "Wohnungsnot"})

    assert response.status_code == 201
    assert captured["model_id"] == "gpt-test-model"
    assert response.json()["model_id"] == "gpt-test-model"
```

- [ ] **Step 2: Verify the test fails for the right reason**

Run:

```bash
cd backend && uv run pytest -q tests/api/test_app_factory.py::test_create_app_passes_configured_openai_model_to_adapter
```

Expected result: the test fails because `captured["model_id"]` is still `gpt-5.2`, proving the configured environment value is currently ignored.

- [ ] **Step 3: Implement the minimal code change**

Change `_build_analysis_adapter` in `backend/app/main.py` so that the OpenAI adapter receives the configured model:

```python
    if provider == "openai":
        model_id = os.getenv("SCM_OPENAI_MODEL", "gpt-5.2").strip() or "gpt-5.2"
        return OpenAIAnalysisGenerator(model_id=model_id)
```

- [ ] **Step 4: Verify the targeted test passes**

Run:

```bash
cd backend && uv run pytest -q tests/api/test_app_factory.py::test_create_app_passes_configured_openai_model_to_adapter
```

Expected result: the test passes and the response contains `model_id == "gpt-test-model"`.

- [ ] **Step 5: Verify related backend tests**

Run:

```bash
cd backend && uv run pytest -q tests/api/test_app_factory.py tests/llm/test_openai_adapter.py
```

Expected result: all selected tests pass.

## Task 2: Align Repair semantics in PRD and ADRs

**Files:**
- Modify: `docs/prd.md`
- Modify: `docs/adr/0001-architecture-style.md`
- Modify: `docs/adr/0002-analysis-contract-and-validation.md`
- Modify: `docs/adr/0004-llm-adapter-and-prompt-versioning.md`

- [ ] **Step 1: Clarify PRD Repair scope**

In `docs/prd.md`, keep the existing requirement intent but state the current MVP implementation precisely:

- `UC3` should distinguish validation from prepared Repair.
- `FR4` should say that bounded Repair exists as a prepared guardrail, but the active standard path persists invalid payloads as failed runs.
- `NFR2` should not imply that Repair is currently called on every schema error.
- Risk `R1` should keep strict schema and bounded Repair as mitigation, but without claiming silent automatic repair in the active path.

Use concise German prose with Swiss orthography and no new architecture decision.

- [ ] **Step 2: Update ADR 0002**

In `docs/adr/0002-analysis-contract-and-validation.md`, keep the decision but clarify:

- JSON Schema and Pydantic validation are active.
- The bounded Repair function exists and is tested.
- The standard workflow currently fails explicitly on invalid payloads instead of invoking Repair automatically.

- [ ] **Step 3: Update ADR 0004**

In `docs/adr/0004-llm-adapter-and-prompt-versioning.md`, remove stale wording that a real provider adapter must still be operationalized. Replace it with wording that the OpenAI adapter exists, while tests can still inject Stub/Fake adapters and avoid network calls.

- [ ] **Step 4: Remove remaining milestone wording from ADR 0001**

In `docs/adr/0001-architecture-style.md`, replace remaining milestone wording with phase- or delivery-oriented wording.

- [ ] **Step 5: Self-review the Repair wording**

Search the touched files:

```bash
rg -n "Repair|repair|max\\. 2|Retries|Standardpfad|standard" docs/prd.md docs/adr/0002-analysis-contract-and-validation.md docs/adr/0004-llm-adapter-and-prompt-versioning.md
```

Expected result: no touched sentence claims that Repair is active in the current standard workflow.

## Task 3: Align arc42 fachliche details

**Files:**
- Modify: `docs/arc42/02_randbedingungen.md`
- Modify: `docs/arc42/05_bausteinsicht.md`
- Modify: `docs/arc42/06_laufzeitsicht.md`
- Modify: `docs/arc42/08_querschnittliche_konzepte.md`
- Modify: `docs/arc42/11_technische_risiken.md`

- [ ] **Step 1: Correct UI tab naming**

In `docs/arc42/05_bausteinsicht.md`, change the `App.tsx` description from `Workspace-Tabs (Pipeline/Archiv)` to the current UI naming `Analyse/Archiv`.

- [ ] **Step 2: Weaken the language guarantee wording**

In `docs/arc42/06_laufzeitsicht.md`, replace the phrase that the adapter "erzwingt" the output language. State instead that the adapter requests the detected language through prompt and schema-bound output, while the backend verifies output language after structural validation.

- [ ] **Step 3: Remove stale milestone wording**

In `docs/arc42/08_querschnittliche_konzepte.md`, replace the sentence about later validation and Repair milestones with wording that matches the current architecture:

- Structural checks are active.
- Deeper semantic checks are intentionally limited.
- Repair is prepared but not part of the current standard path.

- [ ] **Step 4: Confirm configuration wording**

In `docs/arc42/08_querschnittliche_konzepte.md`, keep `SCM_OPENAI_MODEL` as a relevant environment variable because Task 1 makes it effective.

- [ ] **Step 5: Clean remaining consistency wording**

In `docs/arc42/02_randbedingungen.md`, replace milestone wording with change-oriented wording. In `docs/arc42/11_technische_risiken.md`, make clear that validation is active and Repair is prepared.

- [ ] **Step 6: Self-review arc42 consistency**

Run:

```bash
rg -n "Pipeline/Archiv|erzwingt|Meilenstein|Milestone|SCM_OPENAI_MODEL|Repair" docs/arc42
```

Expected result: remaining matches are intentional and consistent with the implemented standard path.

## Task 4: Verification and self-review

**Files:**
- Review: `AGENTS.md`
- Review: `PLAN.md`
- Review: `docs/prd.md`
- Review: `docs/arc42/`
- Review: touched backend files

- [ ] **Step 1: Run targeted backend verification**

Run:

```bash
cd backend && uv run pytest -q tests/api/test_app_factory.py tests/llm/test_openai_adapter.py
```

Expected result: all selected tests pass.

- [ ] **Step 2: Run backend lint**

Run:

```bash
cd backend && uv run ruff check .
```

Expected result: Ruff reports no findings.

- [ ] **Step 3: Run documentation consistency searches**

Run:

```bash
rg -n "Pipeline/Archiv|erzwingt|Meilenstein|Milestone|SCM_OPENAI_MODEL|Repair" docs/prd.md docs/adr docs/arc42
```

Expected result: no outdated claim remains that conflicts with the code path.

- [ ] **Step 4: Check worktree status**

Run:

```bash
git status --short
```

Expected result: only the planned files are modified.

## Task 5: Commit and PR preparation

**Files:**
- Stage: all modified files from this plan

- [ ] **Step 1: Review diff**

Run:

```bash
git diff -- backend/app/main.py backend/tests/api/test_app_factory.py docs/prd.md docs/adr/0001-architecture-style.md docs/adr/0002-analysis-contract-and-validation.md docs/adr/0004-llm-adapter-and-prompt-versioning.md docs/arc42/02_randbedingungen.md docs/arc42/05_bausteinsicht.md docs/arc42/06_laufzeitsicht.md docs/arc42/08_querschnittliche_konzepte.md docs/arc42/11_technische_risiken.md
```

Expected result: the diff only contains the scoped configuration fix and documentation consistency edits.

- [ ] **Step 2: Commit**

Run:

```bash
git add backend/app/main.py backend/tests/api/test_app_factory.py docs/prd.md docs/adr/0001-architecture-style.md docs/adr/0002-analysis-contract-and-validation.md docs/adr/0004-llm-adapter-and-prompt-versioning.md docs/arc42/02_randbedingungen.md docs/arc42/05_bausteinsicht.md docs/arc42/06_laufzeitsicht.md docs/arc42/08_querschnittliche_konzepte.md docs/arc42/11_technische_risiken.md docs/superpowers/plans/2026-05-30-llm-repair-consistency.md
git commit -m "docs: align llm repair consistency"
```

- [ ] **Step 3: Push and open draft PR**

Run:

```bash
git push -u origin docs/llm-repair-consistency
```

Open a draft PR with:

- Title: `Align LLM configuration and repair documentation`
- Summary: `Uses SCM_OPENAI_MODEL in the OpenAI adapter path and aligns PRD, ADR and arc42 wording with the current non-active Repair standard path.`
- Verification: include the exact commands from Task 4.

## Self-Review

- Spec coverage: The plan covers the P0 configuration finding, the P0 Repair consistency finding, the stale ADR finding and the small arc42 wording findings.
- Placeholder scan: The plan contains no `TBD`, open implementation placeholders or unspecified test steps.
- Type consistency: The proposed test uses the existing `create_app` pattern, `TestClient` and the existing fake adapter return shape accepted by `_normalize_generation_result`.
