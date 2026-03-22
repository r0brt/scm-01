from dataclasses import dataclass
from typing import Protocol


@dataclass(slots=True)
class AnalysisGenerationResult:
    payload: dict
    model_id: str
    prompt_version: str


class AnalysisGenerator(Protocol):
    def generate_analysis(self, text: str) -> AnalysisGenerationResult: ...
