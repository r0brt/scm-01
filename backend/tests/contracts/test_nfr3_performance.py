from pathlib import Path

from scripts.measure_nfr3_performance import (
    NFR3_MAX_INPUT_CHARS,
    NFR3_MAX_P95_SECONDS,
    measure_nfr3_performance,
)

ROOT = Path(__file__).resolve().parents[3]
INPUTS_DIR = ROOT / "backend" / "tests" / "fixtures" / "inputs"


def test_nfr3_fixture_inputs_stay_within_prd_limit() -> None:
    result = measure_nfr3_performance(INPUTS_DIR)

    assert result.total == 21
    assert result.max_input_chars == NFR3_MAX_INPUT_CHARS
    assert result.oversized_inputs == []


def test_nfr3_api_response_p95_meets_prd_threshold_without_cold_start() -> None:
    result = measure_nfr3_performance(INPUTS_DIR)

    assert result.total == 21
    assert result.successful == result.total
    assert result.failed == []
    assert result.p95_seconds < NFR3_MAX_P95_SECONDS
