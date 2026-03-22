# M1 Analysis Contract Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first SCM analysis contract with a strict JSON Schema, matching Pydantic models, contract tests, and fixture data for the six documented analysis levels.

**Architecture:** The contract is split into three aligned artifacts: `schemas/analysis.schema.json` as the source-of-truth JSON contract, focused Pydantic models in the backend, and contract tests that validate both schema behavior and model behavior using shared valid/invalid JSON examples. Documentation is updated minimally so the six level names become explicit and reviewable outside the code.

**Tech Stack:** Python 3.13, Pydantic, pytest, jsonschema, uv

---

## File Map

- Create: `schemas/analysis.schema.json`
- Create: `backend/app/models/__init__.py`
- Create: `backend/app/models/analysis.py`
- Create: `backend/tests/contracts/test_analysis_schema.py`
- Create: `backend/tests/contracts/test_analysis_models.py`
- Create: `backend/tests/fixtures/contracts/valid/analysis_minimal.json`
- Create: `backend/tests/fixtures/contracts/valid/analysis_rich.json`
- Create: `backend/tests/fixtures/contracts/invalid/missing_level.json`
- Create: `backend/tests/fixtures/contracts/invalid/unknown_top_level_field.json`
- Create: `backend/tests/fixtures/contracts/invalid/empty_punkte.json`
- Create: `backend/tests/fixtures/contracts/invalid/non_string_punkt.json`
- Create: `backend/tests/fixtures/contracts/invalid/missing_zusammenfassung.json`
- Create: `backend/tests/fixtures/inputs/001.txt`
- Create: `backend/tests/fixtures/inputs/002.txt`
- Create: `backend/tests/fixtures/inputs/003.txt`
- Create: `backend/tests/fixtures/inputs/004.txt`
- Create: `backend/tests/fixtures/inputs/005.txt`
- Create: `backend/tests/fixtures/inputs/006.txt`
- Create: `backend/tests/fixtures/inputs/007.txt`
- Create: `backend/tests/fixtures/inputs/008.txt`
- Create: `backend/tests/fixtures/inputs/009.txt`
- Create: `backend/tests/fixtures/inputs/010.txt`
- Create: `backend/tests/fixtures/inputs/011.txt`
- Create: `backend/tests/fixtures/inputs/012.txt`
- Create: `backend/tests/fixtures/inputs/013.txt`
- Create: `backend/tests/fixtures/inputs/014.txt`
- Create: `backend/tests/fixtures/inputs/015.txt`
- Create: `backend/tests/fixtures/inputs/016.txt`
- Create: `backend/tests/fixtures/inputs/017.txt`
- Create: `backend/tests/fixtures/inputs/018.txt`
- Create: `backend/tests/fixtures/inputs/019.txt`
- Create: `backend/tests/fixtures/inputs/020.txt`
- Modify: `backend/pyproject.toml`
- Modify: `docs/prd.md`
- Modify: `docs/arc42/08_querschnittliche_konzepte.md`

### Task 1: Add the first failing contract test

**Files:**
- Create: `backend/tests/contracts/test_analysis_schema.py`
- Future implementation target: `schemas/analysis.schema.json`
- Future fixture targets:
  - `backend/tests/fixtures/contracts/valid/analysis_minimal.json`
  - `backend/tests/fixtures/contracts/invalid/missing_level.json`

- [ ] **Step 1: Write the failing schema contract test**

Use this content:

```python
import json
from pathlib import Path

from jsonschema import Draft202012Validator


ROOT = Path(__file__).resolve().parents[3]
SCHEMA_PATH = ROOT / "schemas" / "analysis.schema.json"
FIXTURES = ROOT / "backend" / "tests" / "fixtures" / "contracts"


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def test_analysis_schema_accepts_minimal_valid_payload() -> None:
    schema = load_json(SCHEMA_PATH)
    payload = load_json(FIXTURES / "valid" / "analysis_minimal.json")

    validator = Draft202012Validator(schema)

    assert list(validator.iter_errors(payload)) == []


def test_analysis_schema_rejects_payload_with_missing_level() -> None:
    schema = load_json(SCHEMA_PATH)
    payload = load_json(FIXTURES / "invalid" / "missing_level.json")

    validator = Draft202012Validator(schema)

    errors = list(validator.iter_errors(payload))

    assert errors
```

- [ ] **Step 2: Add the minimal JSON fixtures referenced by the test**

Create `backend/tests/fixtures/contracts/valid/analysis_minimal.json` with this content:

```json
{
  "beobachtungen": {
    "zusammenfassung": "Kurzbeschreibung der Beobachtungen.",
    "punkte": ["Beobachtung eins."]
  },
  "erklaerungen": {
    "zusammenfassung": "Kurzbeschreibung der Erklaerungen.",
    "punkte": ["Erklaerung eins."]
  },
  "emotionen": {
    "zusammenfassung": "Kurzbeschreibung der Emotionen.",
    "punkte": ["Emotion eins."]
  },
  "zuschreibungen": {
    "zusammenfassung": "Kurzbeschreibung der Zuschreibungen.",
    "punkte": ["Zuschreibung eins."]
  },
  "schlussfolgerungen": {
    "zusammenfassung": "Kurzbeschreibung der Schlussfolgerungen.",
    "punkte": ["Schlussfolgerung eins."]
  },
  "massnahmen": {
    "zusammenfassung": "Kurzbeschreibung der Massnahmen.",
    "punkte": ["Massnahme eins."]
  }
}
```

Create `backend/tests/fixtures/contracts/invalid/missing_level.json` with the same shape but omit the `massnahmen` object.

- [ ] **Step 3: Run the test to verify it fails for the right reason**

Run:

```bash
cd backend && uv run pytest -q tests/contracts/test_analysis_schema.py
```

Expected:

- command fails
- failure is caused by missing `schemas/analysis.schema.json` or missing dependency/config, not by a typo in the test

### Task 2: Add schema tooling and implement the JSON Schema

**Files:**
- Modify: `backend/pyproject.toml`
- Create: `schemas/analysis.schema.json`
- Existing test: `backend/tests/contracts/test_analysis_schema.py`

- [ ] **Step 1: Add the schema validation dependency**

Add this dev dependency to `backend/pyproject.toml`:

```toml
"jsonschema>=4.23,<5",
```

Keep the existing formatting and dependency-group structure intact.

- [ ] **Step 2: Create the schema file**

Use this content:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://scm.local/schemas/analysis.schema.json",
  "title": "SCM Analysis",
  "type": "object",
  "additionalProperties": false,
  "required": [
    "beobachtungen",
    "erklaerungen",
    "emotionen",
    "zuschreibungen",
    "schlussfolgerungen",
    "massnahmen"
  ],
  "properties": {
    "beobachtungen": { "$ref": "#/$defs/ebene" },
    "erklaerungen": { "$ref": "#/$defs/ebene" },
    "emotionen": { "$ref": "#/$defs/ebene" },
    "zuschreibungen": { "$ref": "#/$defs/ebene" },
    "schlussfolgerungen": { "$ref": "#/$defs/ebene" },
    "massnahmen": { "$ref": "#/$defs/ebene" }
  },
  "$defs": {
    "ebene": {
      "type": "object",
      "additionalProperties": false,
      "required": ["zusammenfassung", "punkte"],
      "properties": {
        "zusammenfassung": {
          "type": "string",
          "minLength": 1
        },
        "punkte": {
          "type": "array",
          "minItems": 1,
          "items": {
            "type": "string",
            "minLength": 1
          }
        }
      }
    }
  }
}
```

- [ ] **Step 3: Run the focused schema tests**

Run:

```bash
cd backend && uv run pytest -q tests/contracts/test_analysis_schema.py
```

Expected:

- both tests pass

### Task 3: Expand contract coverage with valid and invalid schema examples

**Files:**
- Modify: `backend/tests/contracts/test_analysis_schema.py`
- Create:
  - `backend/tests/fixtures/contracts/valid/analysis_rich.json`
  - `backend/tests/fixtures/contracts/invalid/unknown_top_level_field.json`
  - `backend/tests/fixtures/contracts/invalid/empty_punkte.json`
  - `backend/tests/fixtures/contracts/invalid/non_string_punkt.json`
  - `backend/tests/fixtures/contracts/invalid/missing_zusammenfassung.json`

- [ ] **Step 1: Extend the schema test file**

Add these tests to `backend/tests/contracts/test_analysis_schema.py`:

```python
def test_analysis_schema_accepts_richer_valid_payload() -> None:
    schema = load_json(SCHEMA_PATH)
    payload = load_json(FIXTURES / "valid" / "analysis_rich.json")

    validator = Draft202012Validator(schema)

    assert list(validator.iter_errors(payload)) == []


def test_analysis_schema_rejects_unknown_top_level_field() -> None:
    schema = load_json(SCHEMA_PATH)
    payload = load_json(FIXTURES / "invalid" / "unknown_top_level_field.json")

    validator = Draft202012Validator(schema)

    assert list(validator.iter_errors(payload))


def test_analysis_schema_rejects_empty_punkte() -> None:
    schema = load_json(SCHEMA_PATH)
    payload = load_json(FIXTURES / "invalid" / "empty_punkte.json")

    validator = Draft202012Validator(schema)

    assert list(validator.iter_errors(payload))


def test_analysis_schema_rejects_non_string_punkt() -> None:
    schema = load_json(SCHEMA_PATH)
    payload = load_json(FIXTURES / "invalid" / "non_string_punkt.json")

    validator = Draft202012Validator(schema)

    assert list(validator.iter_errors(payload))


def test_analysis_schema_rejects_missing_zusammenfassung() -> None:
    schema = load_json(SCHEMA_PATH)
    payload = load_json(FIXTURES / "invalid" / "missing_zusammenfassung.json")

    validator = Draft202012Validator(schema)

    assert list(validator.iter_errors(payload))
```

- [ ] **Step 2: Add the fixture files**

Create `analysis_rich.json` as a valid payload with the same six top-level fields but at least two strings in each `punkte` array.

Create the invalid files by starting from the minimal valid payload and changing only one aspect per file:

- `unknown_top_level_field.json`: add `"akteure": { ... }`
- `empty_punkte.json`: set one level’s `punkte` to `[]`
- `non_string_punkt.json`: replace one item in `punkte` with `123`
- `missing_zusammenfassung.json`: remove the `zusammenfassung` field from one level

- [ ] **Step 3: Run the full schema contract test file**

Run:

```bash
cd backend && uv run pytest -q tests/contracts/test_analysis_schema.py
```

Expected:

- all schema contract tests pass

### Task 4: Add Pydantic models and model tests

**Files:**
- Create: `backend/app/models/__init__.py`
- Create: `backend/app/models/analysis.py`
- Create: `backend/tests/contracts/test_analysis_models.py`

- [ ] **Step 1: Write the failing model tests**

Use this content for `backend/tests/contracts/test_analysis_models.py`:

```python
import json
from pathlib import Path

import pytest
from pydantic import ValidationError

from app.models.analysis import Analyse


ROOT = Path(__file__).resolve().parents[3]
FIXTURES = ROOT / "backend" / "tests" / "fixtures" / "contracts"


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def test_analyse_model_accepts_valid_payload() -> None:
    payload = load_json(FIXTURES / "valid" / "analysis_minimal.json")

    analyse = Analyse.model_validate(payload)

    assert analyse.massnahmen.punkte == ["Massnahme eins."]


def test_analyse_model_rejects_invalid_payload() -> None:
    payload = load_json(FIXTURES / "invalid" / "empty_punkte.json")

    with pytest.raises(ValidationError):
        Analyse.model_validate(payload)
```

- [ ] **Step 2: Run the model tests to verify they fail**

Run:

```bash
cd backend && uv run pytest -q tests/contracts/test_analysis_models.py
```

Expected:

- command fails
- failure is due to missing `app.models.analysis`, not test typos

- [ ] **Step 3: Implement the models**

Create `backend/app/models/__init__.py` with:

```python
from app.models.analysis import Analyse, AnalyseEbene

__all__ = ["Analyse", "AnalyseEbene"]
```

Create `backend/app/models/analysis.py` with:

```python
from pydantic import BaseModel, ConfigDict, Field


class AnalyseEbene(BaseModel):
    model_config = ConfigDict(extra="forbid")

    zusammenfassung: str = Field(min_length=1)
    punkte: list[str] = Field(min_length=1)


class Analyse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    beobachtungen: AnalyseEbene
    erklaerungen: AnalyseEbene
    emotionen: AnalyseEbene
    zuschreibungen: AnalyseEbene
    schlussfolgerungen: AnalyseEbene
    massnahmen: AnalyseEbene
```

- [ ] **Step 4: Run the model tests again**

Run:

```bash
cd backend && uv run pytest -q tests/contracts/test_analysis_models.py
```

Expected:

- both model tests pass

### Task 5: Add the 20 input text fixtures

**Files:**
- Create: `backend/tests/fixtures/inputs/001.txt` through `backend/tests/fixtures/inputs/020.txt`

- [ ] **Step 1: Add 20 plain-text input fixtures**

Create twenty short to medium problem texts. Keep them simple but varied:

- German, French, and English examples
- different lengths
- some mixed-language examples
- no need for labels or metadata inside the files

Each file should contain one raw text input only.

- [ ] **Step 2: Add a fixture count test to the schema test file**

Append this test to `backend/tests/contracts/test_analysis_schema.py`:

```python
def test_input_fixture_set_contains_at_least_twenty_texts() -> None:
    inputs_dir = ROOT / "backend" / "tests" / "fixtures" / "inputs"

    text_files = sorted(inputs_dir.glob("*.txt"))

    assert len(text_files) >= 20
```

- [ ] **Step 3: Run the schema contract test file again**

Run:

```bash
cd backend && uv run pytest -q tests/contracts/test_analysis_schema.py
```

Expected:

- all tests pass

### Task 6: Make the six level names explicit in project docs

**Files:**
- Modify: `docs/prd.md`
- Modify: `docs/arc42/08_querschnittliche_konzepte.md`

- [ ] **Step 1: Add the explicit six names to the PRD**

Update the PRD where the six levels are discussed so that the contract names are no longer implicit. Add the explicit list:

- `beobachtungen`
- `erklaerungen`
- `emotionen`
- `zuschreibungen`
- `schlussfolgerungen`
- `massnahmen`

Keep the wording concise and consistent with the existing German documentation tone.

- [ ] **Step 2: Add the contract note to arc42**

Replace the placeholder in `docs/arc42/08_querschnittliche_konzepte.md` with a short section that states:

- analysis output follows a strict JSON contract
- the six level names are fixed as above
- additional fields are not allowed
- deeper semantic checks come later with validation/repair milestones

- [ ] **Step 3: Review the docs for consistency**

Check:

- names match the schema exactly
- documentation stays in German under `docs/arc42/`
- no premature M2/M3 details are introduced

### Task 7: Run final M1 verification and commit the feature work

**Files:**
- Verify:
  - `schemas/analysis.schema.json`
  - `backend/app/models/analysis.py`
  - `backend/tests/contracts/test_analysis_schema.py`
  - `backend/tests/contracts/test_analysis_models.py`
  - `backend/tests/fixtures/contracts/...`
  - `backend/tests/fixtures/inputs/...`
  - `docs/prd.md`
  - `docs/arc42/08_querschnittliche_konzepte.md`

- [ ] **Step 1: Run the contract test suite**

Run:

```bash
cd backend && uv run pytest -q tests/contracts
```

Expected:

- all contract tests pass

- [ ] **Step 2: Run Ruff for the backend tree**

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

Expected changes include:

- `schemas/analysis.schema.json`
- `backend/app/models/__init__.py`
- `backend/app/models/analysis.py`
- `backend/tests/contracts/test_analysis_schema.py`
- `backend/tests/contracts/test_analysis_models.py`
- `backend/tests/fixtures/contracts/...`
- `backend/tests/fixtures/inputs/...`
- `backend/pyproject.toml`
- `docs/prd.md`
- `docs/arc42/08_querschnittliche_konzepte.md`

- [ ] **Step 4: Commit**

```bash
git add schemas/analysis.schema.json backend/app/models/__init__.py backend/app/models/analysis.py backend/tests/contracts/test_analysis_schema.py backend/tests/contracts/test_analysis_models.py backend/tests/fixtures/contracts backend/tests/fixtures/inputs backend/pyproject.toml docs/prd.md docs/arc42/08_querschnittliche_konzepte.md
git commit -m "feat: add analysis contract schema and tests"
```
