from __future__ import annotations

import math
import sys
import tempfile
import time
from dataclasses import dataclass
from pathlib import Path

from fastapi.testclient import TestClient

REPO_ROOT = Path(__file__).resolve().parents[2]
BACKEND_ROOT = REPO_ROOT / "backend"
DEFAULT_INPUTS_DIR = BACKEND_ROOT / "tests" / "fixtures" / "inputs"

sys.path.insert(0, str(BACKEND_ROOT))

from app.main import create_app  # noqa: E402

NFR3_MAX_P95_SECONDS = 5.0
NFR3_MAX_INPUT_CHARS = 1000
ANALYSIS_LEVELS = ("symptome", "ursachen", "emotionen", "narrative", "mythen", "essenz")
BOUNDARY_INPUT_NAME = "generated-1000-char-boundary"


@dataclass(frozen=True)
class InputCase:
    name: str
    text: str


@dataclass(frozen=True)
class MeasuredRequest:
    name: str
    input_chars: int
    status_code: int
    elapsed_seconds: float
    run_status: str | None
    validation_status: str | None
    error_code: str | None

    @property
    def successful(self) -> bool:
        return (
            self.status_code == 201
            and self.run_status == "completed"
            and self.validation_status == "valid"
            and self.error_code is None
        )


@dataclass(frozen=True)
class PerformanceResult:
    measurements: list[MeasuredRequest]
    oversized_inputs: list[str]

    @property
    def total(self) -> int:
        return len(self.measurements)

    @property
    def successful(self) -> int:
        return sum(1 for measurement in self.measurements if measurement.successful)

    @property
    def failed(self) -> list[MeasuredRequest]:
        return [measurement for measurement in self.measurements if not measurement.successful]

    @property
    def max_input_chars(self) -> int:
        if not self.measurements:
            return 0
        return max(measurement.input_chars for measurement in self.measurements)

    @property
    def slowest_seconds(self) -> float:
        if not self.measurements:
            return 0.0
        return max(measurement.elapsed_seconds for measurement in self.measurements)

    @property
    def p95_seconds(self) -> float:
        if not self.measurements:
            return 0.0
        sorted_durations = sorted(
            measurement.elapsed_seconds for measurement in self.measurements
        )
        index = math.ceil(0.95 * len(sorted_durations)) - 1
        return sorted_durations[index]


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
            "model_id": "fixture-performance-generator",
            "prompt_version": "fixture-nfr3",
        }


def _build_boundary_text() -> str:
    sentence = (
        "Städtische Versorgung, Vertrauen, Konflikte und Erwartungen werden "
        "strukturiert analysiert. "
    )
    repetitions = math.ceil(NFR3_MAX_INPUT_CHARS / len(sentence))
    return (sentence * repetitions)[:NFR3_MAX_INPUT_CHARS]


def _load_input_cases(inputs_dir: Path) -> list[InputCase]:
    fixture_cases = [
        InputCase(path.name, path.read_text(encoding="utf-8").strip())
        for path in sorted(inputs_dir.glob("*.txt"))
    ]
    return [
        *fixture_cases,
        InputCase(BOUNDARY_INPUT_NAME, _build_boundary_text()),
    ]


def measure_nfr3_performance(inputs_dir: Path = DEFAULT_INPUTS_DIR) -> PerformanceResult:
    input_cases = _load_input_cases(inputs_dir)
    measurements: list[MeasuredRequest] = []
    oversized_inputs = [
        input_case.name
        for input_case in input_cases
        if len(input_case.text) > NFR3_MAX_INPUT_CHARS
    ]

    with tempfile.TemporaryDirectory() as temporary_directory:
        database_url = f"sqlite+pysqlite:///{Path(temporary_directory) / 'nfr3.db'}"
        app = create_app(
            database_url=database_url,
            initialize_schema=True,
            analysis_adapter=FixtureAnalysisGenerator(),
            language_detector=FixtureLanguageDetector(),
        )

        with TestClient(app) as client:
            if input_cases:
                client.post("/api/v1/analyses", json={"text": input_cases[0].text})

            for input_case in input_cases:
                start = time.perf_counter()
                response = client.post("/api/v1/analyses", json={"text": input_case.text})
                elapsed_seconds = time.perf_counter() - start
                payload = response.json()

                measurements.append(
                    MeasuredRequest(
                        name=input_case.name,
                        input_chars=len(input_case.text),
                        status_code=response.status_code,
                        elapsed_seconds=elapsed_seconds,
                        run_status=payload.get("run_status"),
                        validation_status=payload.get("validation_status"),
                        error_code=payload.get("error_code"),
                    )
                )

    return PerformanceResult(measurements=measurements, oversized_inputs=oversized_inputs)


def main() -> None:
    result = measure_nfr3_performance()
    print(f"NFR3 performance: {result.successful}/{result.total} successful API analyses")
    print(f"Input length limit: <= {NFR3_MAX_INPUT_CHARS} chars")
    print(f"Max input length: {result.max_input_chars} chars")
    print(f"p95 response time: {result.p95_seconds:.3f}s")
    print(f"Slowest response time: {result.slowest_seconds:.3f}s")
    print(f"Maximum threshold: {NFR3_MAX_P95_SECONDS:.3f}s")

    if result.oversized_inputs:
        print(f"Oversized inputs: {', '.join(result.oversized_inputs)}")
        raise SystemExit(1)

    if result.failed:
        for failed in result.failed:
            print(
                f"- {failed.name}: status={failed.status_code}, "
                f"run={failed.run_status}, validation={failed.validation_status}, "
                f"error={failed.error_code}"
            )
        raise SystemExit(1)

    if result.p95_seconds >= NFR3_MAX_P95_SECONDS:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
