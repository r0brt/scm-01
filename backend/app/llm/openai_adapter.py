import json
import os
from pathlib import Path

from app.llm.base import AnalysisGenerationResult

try:
    from openai import OpenAI
except ImportError:  # pragma: no cover - exercised through runtime guard
    OpenAI = None

ROOT = Path(__file__).resolve().parents[3]
PROMPT_PATH = ROOT / "prompts" / "v2" / "analysis.md"
SCHEMA_PATH = ROOT / "schemas" / "analysis.schema.json"

LANGUAGE_NAMES = {
    "de": "German",
    "fr": "French",
    "en": "English",
}


class OpenAIAnalysisGenerator:
    """Generate SCM analyses via the OpenAI Responses API."""

    def __init__(
        self,
        client=None,
        *,
        model_id: str = "gpt-5.2",
        api_key_env: str = "OPENAI_API_KEY",
    ) -> None:
        """Initialize the adapter with the configured model and API key env var."""
        self.model_id = model_id
        self.api_key_env = api_key_env
        self.client = client

    def generate_analysis(
        self, text: str, *, language: str | None = None
    ) -> AnalysisGenerationResult:
        """Call OpenAI with the versioned prompt and strict JSON schema output."""
        api_key = os.getenv(self.api_key_env)
        if not api_key:
            raise RuntimeError(f"Missing required environment variable: {self.api_key_env}")

        if self.client is None:
            if OpenAI is None:
                raise RuntimeError("The `openai` package is required for the OpenAI adapter.")
            self.client = OpenAI(api_key=api_key)

        prompt_template = PROMPT_PATH.read_text(encoding="utf-8")
        schema = json.loads(SCHEMA_PATH.read_text(encoding="utf-8"))
        language_key = language or "de"
        language_name = LANGUAGE_NAMES.get(language_key, language_key)
        prompt_input = (
            f"Detected input language: {language_key}\n"
            f"All beschreibung and text fields must be written in {language_name}.\n"
            "Do not mix languages in the output.\n\n"
            f"Problem text:\n{text}"
        )
        response = self.client.responses.create(
            model=self.model_id,
            instructions=prompt_template,
            input=prompt_input,
            text={
                "format": {
                    "type": "json_schema",
                    "name": "scm_analysis",
                    "schema": schema,
                    "strict": True,
                }
            },
        )
        payload = json.loads(response.output_text)

        return AnalysisGenerationResult(
            payload=payload,
            model_id=self.model_id,
            prompt_version="v2",
        )
