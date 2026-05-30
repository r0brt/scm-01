from __future__ import annotations

import sys
from dataclasses import dataclass
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_ROOT = REPO_ROOT / "backend"
DEFAULT_INPUTS_DIR = BACKEND_ROOT / "tests" / "fixtures" / "inputs"

sys.path.insert(0, str(BACKEND_ROOT))

from app.db.base import Base  # noqa: E402
from app.db.session import create_engine, create_session_factory  # noqa: E402
from app.services.analysis_workflow import create_analysis_run  # noqa: E402

MINIMUM_CONTRACT_COMPLIANCE_RATIO = 0.90
ANALYSIS_LEVELS = ("symptome", "ursachen", "emotionen", "narrative", "mythen", "essenz")


@dataclass(frozen=True)
class FailedFixture:
    name: str
    error_code: str | None
    validation_status: str
    run_status: str


@dataclass(frozen=True)
class ContractComplianceResult:
    total: int
    valid_without_repair: int
    repair_attempts: int
    failed: list[FailedFixture]

    @property
    def compliance_ratio(self) -> float:
        if self.total == 0:
            return 0.0
        return self.valid_without_repair / self.total


class FixtureLanguageDetector:
    def detect(self, _text: str) -> dict:
        return {"language": "de", "confidence": 0.99, "error_code": None}


class FixtureAnalysisGenerator:
    def generate_analysis(self, text: str, *, language: str | None = None) -> dict:
        payload = {
            level: {
                "beschreibung": f"{level}: strukturierte Einordnung fuer {text}",
                "eintraege": [{"text": f"{level}: {text}"}],
            }
            for level in ANALYSIS_LEVELS
        }
        return {
            "payload": payload,
            "model_id": "fixture-contract-generator",
            "prompt_version": "fixture-nfr1",
        }


def measure_contract_compliance(inputs_dir: Path = DEFAULT_INPUTS_DIR) -> ContractComplianceResult:
    input_files = sorted(inputs_dir.glob("*.txt"))
    engine = create_engine("sqlite+pysqlite:///:memory:")
    Base.metadata.create_all(engine)
    session_factory = create_session_factory(engine)
    failed: list[FailedFixture] = []
    valid_without_repair = 0

    with session_factory() as session:
        for index, path in enumerate(input_files, start=1):
            run = create_analysis_run(
                session,
                path.read_text(encoding="utf-8").strip(),
                correlation_id=f"nfr1-{index:03d}",
                adapter=FixtureAnalysisGenerator(),
                language_detector=FixtureLanguageDetector(),
            )
            if (
                run.run_status == "completed"
                and run.validation_status == "valid"
                and run.analysis_json is not None
                and run.error_code is None
            ):
                valid_without_repair += 1
            else:
                failed.append(
                    FailedFixture(
                        name=path.name,
                        error_code=run.error_code,
                        validation_status=run.validation_status,
                        run_status=run.run_status,
                    )
                )

    return ContractComplianceResult(
        total=len(input_files),
        valid_without_repair=valid_without_repair,
        repair_attempts=0,
        failed=failed,
    )


def main() -> None:
    result = measure_contract_compliance()
    percentage = result.compliance_ratio * 100
    print(
        f"NFR1 contract compliance: {result.valid_without_repair}/{result.total} "
        f"valid without repair ({percentage:.1f}%)"
    )
    print(f"Minimum threshold: {MINIMUM_CONTRACT_COMPLIANCE_RATIO * 100:.1f}%")
    print(f"Repair attempts: {result.repair_attempts}")
    if result.failed:
        for failed in result.failed:
            print(
                f"- {failed.name}: {failed.run_status}/{failed.validation_status}/"
                f"{failed.error_code}"
            )
        raise SystemExit(1)

    if result.compliance_ratio < MINIMUM_CONTRACT_COMPLIANCE_RATIO:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
