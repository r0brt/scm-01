import tomllib
from pathlib import Path

PYPROJECT = Path(__file__).resolve().parents[2] / "pyproject.toml"
EXPECTED_SOURCES = [
    "app/language",
    "app/llm",
    "app/models",
    "app/repositories",
    "app/services",
]


def test_nfr5_coverage_scope_matches_prd_domain_application_layer() -> None:
    config = tomllib.loads(PYPROJECT.read_text(encoding="utf-8"))
    coverage_config = config["tool"]["coverage"]

    assert coverage_config["run"]["source"] == EXPECTED_SOURCES
    assert coverage_config["report"]["fail_under"] == 80
    assert coverage_config["report"]["show_missing"] is True
