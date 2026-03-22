from typing import Annotated

from pydantic import BaseModel, ConfigDict, Field


class AnalyseEbene(BaseModel):
    model_config = ConfigDict(extra="forbid")

    zusammenfassung: str = Field(min_length=1)
    punkte: list[Annotated[str, Field(min_length=1)]] = Field(min_length=1)


class Analyse(BaseModel):
    model_config = ConfigDict(extra="forbid")

    beobachtungen: AnalyseEbene
    erklaerungen: AnalyseEbene
    emotionen: AnalyseEbene
    zuschreibungen: AnalyseEbene
    schlussfolgerungen: AnalyseEbene
    massnahmen: AnalyseEbene
