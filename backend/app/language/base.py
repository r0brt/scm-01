from dataclasses import dataclass
from typing import Protocol


@dataclass(slots=True)
class LanguageDetectionResult:
    """Detected dominant language together with confidence and failure information."""

    language: str
    confidence: float
    error_code: str | None = None


class LanguageDetector(Protocol):
    """Protocol for language detection implementations."""

    def detect(self, text: str) -> LanguageDetectionResult: ...
