from pydantic import BaseModel, ConfigDict, Field


class AnalyseEintrag(BaseModel):
    """Single textual item inside one analysis level."""

    model_config = ConfigDict(extra="forbid")

    text: str = Field(min_length=1)


class AnalyseEbene(BaseModel):
    """Single analysis level with description and structured entries."""

    model_config = ConfigDict(extra="forbid")

    beschreibung: str = Field(min_length=1)
    eintraege: list[AnalyseEintrag] = Field(min_length=1)


class Analyse(BaseModel):
    """Full six-level analysis payload."""

    model_config = ConfigDict(extra="forbid")

    symptome: AnalyseEbene
    ursachen: AnalyseEbene
    emotionen: AnalyseEbene
    narrative: AnalyseEbene
    mythen: AnalyseEbene
    essenz: AnalyseEbene
