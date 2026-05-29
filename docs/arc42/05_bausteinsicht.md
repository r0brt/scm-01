# 05 Bausteinsicht

## Level-1-Zerlegung

Als visuelle Ergänzung der Level-1-Sicht dient [docs/diagrams/building-blocks-level1.puml](/Users/robert/code/scm-01/docs/diagrams/building-blocks-level1.puml:1).

- `Frontend UI` (implementiert in M6): Texteingabe, Pipeline-Darstellung, Run-Historie und JSON-Export.
- `Backend API` (implementiert bis M5): FastAPI-API für Analyse, Run-Liste, Detail und Rerun; Analyseerzeugung über Adapter-Schnittstelle.
- `Lokale Persistenz` (Compose-Zielbetrieb: PostgreSQL, ausserhalb davon optional SQLite): Speicherung von Analyse-Runs und Metadaten.
- `LLM Provider` (extern): Erzeugung von Analyseinhalten über Adapter-Integration.

## Verantwortlichkeiten (Konzept)

- UI übernimmt Präsentation und Nutzerinteraktion.
- API stellt Verträge, Orchestrierung, Fehlermapping und Persistenzzugriff bereit.
- Persistenz stellt dauerhafte, abfragbare Run-Historie sicher.
- LLM-Provider liefert generierte Analyseinhalte unter strikten Contract-Checks.

Der zentrale Analysevertrag folgt der fachlichen Quelle in `docs/scm.md`. Neue Analyse-Runs müssen deshalb die sechs Ebenen `symptome`, `ursachen`, `emotionen`, `narrative`, `mythen` und `essenz` liefern. Alte Payload-Formate werden von den Bausteinen nicht rückwärtskompatibel unterstützt.

## Backend-Zerlegung (Level 2)

Als visuelle Ergänzung der Backend-Zerlegung dient [docs/diagrams/building-blocks-level2-backend.puml](/Users/robert/code/scm-01/docs/diagrams/building-blocks-level2-backend.puml:1).

- `app/api`: FastAPI-Endpunkte, API-Schemas und zentrales Fehlermapping.
- `app/services/analysis_workflow.py`: Orchestrierung von Spracherkennung, Analyseerzeugung, Validierung und Persistenz.
- `app/language`: lokale Sprachdetektion für Eingabe- und Ausgabesprache.
- `app/services/validation.py`: strukturelle Prüfung gegen JSON-Schema und Pydantic-Modelle.
- `app/llm`: Stub- und OpenAI-Adapter hinter einer gemeinsamen Generator-Schnittstelle.
- `app/repositories` und `app/db`: Persistenzzugriff, Datenmodell und Session-Verwaltung.

## Frontend-Zerlegung (aktueller Stand)

- `App.tsx` orchestriert Texteingabe, API-Aufrufe, Run-Selektion, Workspace-Tabs (`Pipeline`/`Archiv`), Export und den globalen Fehlerzustand.
- `AnalysisComposer` kapselt die Eingabemaske für den Rohtext und den Start der Analyse.
- `usePipelineViewModel` in `frontend/src/pipeline.ts` transformiert den gewaehlten Run in einen deterministischen UI-Zustand mit den Modi `idle`, `submitting`, `result_received`, `revealing`, `completed` und `failed`.
- `PipelineView` rendert die zwei Frontend-Betriebsarten der Filterstrecke:
  - Flow-Modus während `submitting`/`result_received`/`revealing` mit genau einer sichtbaren aktiven Stage
  - Review-Modus nach `completed` mit allen sechs Stages, optionalen Details und hervorgehobener `Essenz`
- `RunHistoryPanel` entkoppelt die Auswahl bereits persistierter Runs von der Pipeline-Darstellung und buendelt im Archiv-Tab Run-Liste, technische Nachweise, JSON-Export und die explizite Aktion zum Oeffnen eines Runs in der Analyseansicht.

Die Frontend-Logik trennt damit bewusst zwischen Datenbeschaffung (`App.tsx`), Zustandsableitung (`usePipelineViewModel`) und visueller Darstellung (`AnalysisComposer`, `PipelineView`, `RunHistoryPanel`). Die Pipeline-Stages sind zentral in `frontend/src/pipeline.ts` definiert, damit Reihenfolge, Titel und Prompt-Texte nicht über mehrere Komponenten verstreut gepflegt werden müssen. Die UI behandelt den laufenden Analysepfad bewusst anders als die spätere Run-Prüfung: während des Reveal wird nur eine Stage fokussiert dargestellt, nach Abschluss bleibt der gesamte Run als reviewbare Übersicht sichtbar.
