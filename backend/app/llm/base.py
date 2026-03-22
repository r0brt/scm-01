from dataclasses import dataclass
from typing import Protocol


@dataclass(slots=True)
class AnalysisGenerationResult:
    """Normalized result returned by an analysis generator."""

    payload: dict
    model_id: str
    prompt_version: str


class AnalysisGenerator(Protocol):
    """Protocol for provider-specific analysis generators."""

    def generate_analysis(self, text: str) -> AnalysisGenerationResult: ...
