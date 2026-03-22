from app.language.local_detector import (
    LANGUAGE_CONFIDENCE_TOO_LOW,
    SUPPORTED_LANGUAGES,
    LocalLanguageDetector,
)


def test_local_language_detector_detects_german_text() -> None:
    detector = LocalLanguageDetector()

    result = detector.detect("Die Wohnungsnot in der Stadt belastet viele Familien.")

    assert result.language == "de"
    assert result.confidence >= 0.80


def test_local_language_detector_detects_french_text() -> None:
    detector = LocalLanguageDetector()

    result = detector.detect("La crise du logement dans la ville touche beaucoup de familles.")

    assert result.language == "fr"
    assert result.confidence >= 0.80


def test_local_language_detector_detects_english_text() -> None:
    detector = LocalLanguageDetector()

    result = detector.detect("The housing crisis in the city affects many families.")

    assert result.language == "en"
    assert result.confidence >= 0.80


def test_supported_languages_are_limited_to_de_fr_en() -> None:
    assert SUPPORTED_LANGUAGES == {"de", "fr", "en"}


def test_local_language_detector_marks_ambiguous_input_as_low_confidence() -> None:
    detector = LocalLanguageDetector()

    result = detector.detect("bonjour hello hallo")

    assert result.error_code == LANGUAGE_CONFIDENCE_TOO_LOW
    assert result.confidence < 0.80
