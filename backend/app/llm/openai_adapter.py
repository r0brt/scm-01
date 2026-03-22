import os
from pathlib import Path

from app.llm.base import AnalysisGenerationResult

ROOT = Path(__file__).resolve().parents[3]
PROMPT_PATH = ROOT / "prompts" / "v1" / "analysis.md"


class OpenAIAnalysisGenerator:
    def __init__(self, *, model_id: str = "gpt-5.4-mini", api_key_env: str = "OPENAI_API_KEY") -> None:
        self.model_id = model_id
        self.api_key_env = api_key_env

    def generate_analysis(self, text: str) -> AnalysisGenerationResult:
        api_key = os.getenv(self.api_key_env)
        if not api_key:
            raise RuntimeError(f"Missing required environment variable: {self.api_key_env}")

        prompt_template = PROMPT_PATH.read_text(encoding="utf-8")

        # Real provider wiring is intentionally deferred to a later iteration.
        # M5 introduces the adapter boundary and prompt loading without using the network in tests.
        payload = {
            "beobachtungen": {
                "zusammenfassung": f"OpenAI adapter placeholder for: {text}",
                "punkte": [prompt_template.splitlines()[0] or "Prompt loaded"],
            },
            "erklaerungen": {"zusammenfassung": "placeholder", "punkte": ["placeholder"]},
            "emotionen": {"zusammenfassung": "placeholder", "punkte": ["placeholder"]},
            "zuschreibungen": {"zusammenfassung": "placeholder", "punkte": ["placeholder"]},
            "schlussfolgerungen": {"zusammenfassung": "placeholder", "punkte": ["placeholder"]},
            "massnahmen": {"zusammenfassung": "placeholder", "punkte": ["placeholder"]},
        }

        return AnalysisGenerationResult(
            payload=payload,
            model_id=self.model_id,
            prompt_version="v1",
        )
