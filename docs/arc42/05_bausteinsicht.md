# 05 Bausteinsicht

## Level-1-Zerlegung

- `Frontend UI` (geplant): Texteingabe, Ergebnisdarstellung, Zugriff auf Run-Historie.
- `Backend API` (initial implementiert): FastAPI-Skeleton mit `GET /health` als Bootstrap-Endpoint; weitere API-Funktionen folgen in spaeteren Meilensteinen.
- `PostgreSQL` (geplant): Speicherung von Analyse-Runs und Metadaten.
- `LLM Provider` (extern): Erzeugung von Analyseinhalten über Adapter-Integration.

## Verantwortlichkeiten (Konzept)

- UI übernimmt Präsentation und Nutzerinteraktion.
- API stellt im aktuellen M0-Stand einen minimalen Verfügbarkeits-Check bereit und wird in späteren Meilensteinen um Verträge, Orchestrierung und Fehlermapping erweitert.
- DB stellt dauerhafte, abfragbare Run-Historie sicher.
- LLM-Provider liefert generierte Analyseinhalte unter strikten Contract-Checks.
