# 05 Bausteinsicht

## Level-1-Zerlegung

- `Frontend UI` (geplant): Texteingabe, Ergebnisdarstellung, Zugriff auf Run-Historie.
- `Backend API` (geplant): Orchestrierung, Validierung, Persistenz, Retrieval-Endpunkte.
- `PostgreSQL` (geplant): Speicherung von Analyse-Runs und Metadaten.
- `LLM Provider` (extern): Erzeugung von Analyseinhalten über Adapter-Integration.

## Verantwortlichkeiten (Konzept)

- UI übernimmt Präsentation und Nutzerinteraktion.
- API erzwingt Verträge, orchestriert die Pipeline und mappt Fehler.
- DB stellt dauerhafte, abfragbare Run-Historie sicher.
- LLM-Provider liefert generierte Analyseinhalte unter strikten Contract-Checks.
