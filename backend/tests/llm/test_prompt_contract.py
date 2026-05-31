from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
PROMPT_PATH = ROOT / "prompts" / "v2" / "analysis.md"


def test_prompt_v2_requires_richer_essenz_structure_with_existing_contract() -> None:
    prompt = PROMPT_PATH.read_text(encoding="utf-8")

    assert "`essenz`" in prompt
    assert "1 bis 3 Sätze" in prompt
    assert "2 bis 3" in prompt
    assert "essenz" in prompt.lower()


def test_prompt_v2_uses_swiss_orthography_for_german_prose() -> None:
    prompt = PROMPT_PATH.read_text(encoding="utf-8")

    forbidden_terms = [
        "fuer",
        "Gefuehle",
        "ausgedrueckt",
        "Fehlschluesse",
        "grundsaetzlich",
        "muessen",
        "gemaess",
        "Qualitaetsregeln",
        "Saetze",
        "moeglichst",
        "Woerter",
        "praezise",
        "erklaerend",
        "Erklaerung",
    ]

    assert not [term for term in forbidden_terms if term in prompt]
