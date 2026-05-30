from pathlib import Path

from scripts.measure_contract_compliance import (
    MINIMUM_CONTRACT_COMPLIANCE_RATIO,
    measure_contract_compliance,
)

ROOT = Path(__file__).resolve().parents[3]
INPUTS_DIR = ROOT / "backend" / "tests" / "fixtures" / "inputs"


def test_nfr1_fixture_set_contains_exactly_twenty_inputs() -> None:
    result = measure_contract_compliance(INPUTS_DIR)

    assert result.total == 20


def test_nfr1_contract_compliance_meets_prd_threshold_without_repair() -> None:
    result = measure_contract_compliance(INPUTS_DIR)

    assert result.valid_without_repair == 20
    assert result.compliance_ratio == 1.0
    assert result.compliance_ratio >= MINIMUM_CONTRACT_COMPLIANCE_RATIO
    assert result.repair_attempts == 0
    assert result.failed == []
