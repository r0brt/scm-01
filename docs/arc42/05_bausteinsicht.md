# 05 Bausteinsicht

## Level-1-Zerlegung

- `Frontend UI` (implementiert in M6): Texteingabe, Pipeline-Darstellung, Run-Historie und JSON-Export.
- `Backend API` (implementiert bis M5): FastAPI-API fuer Analyse, Run-Liste, Detail und Rerun; Analyseerzeugung ueber Adapter-Schnittstelle.
- `PostgreSQL` (Zielsystem): Speicherung von Analyse-Runs und Metadaten.
- `LLM Provider` (extern): Erzeugung von Analyseinhalten über Adapter-Integration.

## Verantwortlichkeiten (Konzept)

- UI übernimmt Präsentation und Nutzerinteraktion.
- API stellt Verträge, Orchestrierung, Fehlermapping und Persistenzzugriff bereit.
- DB stellt dauerhafte, abfragbare Run-Historie sicher.
- LLM-Provider liefert generierte Analyseinhalte unter strikten Contract-Checks.

Der zentrale Analysevertrag folgt der fachlichen Quelle in `docs/scm.md`. Neue Analyse-Runs muessen deshalb die sechs Ebenen `symptome`, `ursachen`, `emotionen`, `narrative`, `mythen` und `essenz` liefern. Alte Payload-Formate werden von den Bausteinen nicht rueckwaertskompatibel unterstuetzt.
