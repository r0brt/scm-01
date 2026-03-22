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


def test_analyse_model_rejects_empty_punkt_item() -> None:
    payload = load_json(FIXTURES / "valid" / "analysis_minimal.json")
    payload["beobachtungen"]["punkte"] = [""]

    with pytest.raises(ValidationError):
        Analyse.model_validate(payload)
