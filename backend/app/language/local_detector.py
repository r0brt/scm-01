from langdetect import DetectorFactory, LangDetectException, detect_langs

from app.language.base import LanguageDetectionResult

DetectorFactory.seed = 0

LANGUAGE_CONFIDENCE_TOO_LOW = "LANGUAGE_CONFIDENCE_TOO_LOW"
UNSUPPORTED_LANGUAGE = "UNSUPPORTED_LANGUAGE"
SUPPORTED_LANGUAGES = {"de", "fr", "en"}


class LocalLanguageDetector:
    """Detect the dominant input language locally without external network calls."""

    def detect(self, text: str) -> LanguageDetectionResult:
        """Return the dominant language and confidence for the given text."""
        try:
            candidates = detect_langs(text)
        except LangDetectException:
            return LanguageDetectionResult(
                language="unknown",
                confidence=0.0,
                error_code=LANGUAGE_CONFIDENCE_TOO_LOW,
            )

        best = candidates[0]
        language = best.lang
        confidence = float(best.prob)

        if confidence < 0.80:
            return LanguageDetectionResult(
                language=language,
                confidence=confidence,
                error_code=LANGUAGE_CONFIDENCE_TOO_LOW,
            )

        if language not in SUPPORTED_LANGUAGES:
            return LanguageDetectionResult(
                language=language,
                confidence=confidence,
                error_code=UNSUPPORTED_LANGUAGE,
            )

        return LanguageDetectionResult(language=language, confidence=confidence)
