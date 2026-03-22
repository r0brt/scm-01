from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field


class AnalyseEbene(BaseModel):
    """Single analysis level with summary and supporting points."""

    model_config = ConfigDict(extra="forbid")

    zusammenfassung: str = Field(min_length=1)
    punkte: list[Annotated[str, Field(min_length=1)]] = Field(min_length=1)


class Analyse(BaseModel):
    """Full six-level analysis payload."""

    model_config = ConfigDict(extra="forbid")

    beobachtungen: AnalyseEbene
    erklaerungen: AnalyseEbene
    emotionen: AnalyseEbene
    zuschreibungen: AnalyseEbene
    schlussfolgerungen: AnalyseEbene
    massnahmen: AnalyseEbene
