# 05 Bausteinsicht

## Level-1-Zerlegung

Als visuelle Ergänzung der Level-1-Sicht dient [docs/diagrams/building-blocks-level1.puml](/Users/robert/code/scm-01/docs/diagrams/building-blocks-level1.puml:1). Als C2-Containersicht dient [docs/diagrams/structurizr/c2-scm-container.dsl](/Users/robert/code/scm-01/docs/diagrams/structurizr/c2-scm-container.dsl:1).

Die C2-Sicht trennt die interne SCM-Laufzeit in `Web UI`, `Backend/API` und `Persistenz`. Der externe `LLM Provider` bleibt ausserhalb der SCM-Systemgrenze und wird nur vom Backend/API-Container über den Adapterpfad angesprochen.

| Container / Umsystem | Verantwortung | Technologie / Fundstelle |
| --- | --- | --- |
| `Web UI` | Texteingabe, Analyseansicht, Archiv, Metadaten und JSON-Export | React/Vite/Nginx, `frontend/` |
| `Backend/API` | Analyse-API, Orchestrierung, Validierung, Sprachprüfung, Persistenzzugriff | FastAPI/SQLAlchemy, `backend/app/` |
| `Persistenz` | Speicherung von Runs, Validierungsreport und Traceability-Metadaten | PostgreSQL im Compose-Betrieb |
| `LLM Provider` | Optionale externe Analyseerzeugung | OpenAI Responses API über `backend/app/llm/openai_adapter.py` |

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

Als visuelle Ergänzung der Backend-Zerlegung dient [docs/diagrams/building-blocks-level2-backend.puml](/Users/robert/code/scm-01/docs/diagrams/building-blocks-level2-backend.puml:1). Als C3-Komponentensicht des Backends dient [docs/diagrams/structurizr/c3-backend-components.dsl](/Users/robert/code/scm-01/docs/diagrams/structurizr/c3-backend-components.dsl:1).

| Komponente | Verantwortung | Fundstelle |
| --- | --- | --- |
| `API Layer` | HTTP-Endpunkte, Requestvalidierung, Fehlervertrag und `correlation_id` | `backend/app/main.py`, `backend/app/api/` |
| `Analysis Workflow` | Orchestriert Sprache, Analyseerzeugung, Validierung, Ausgabesprachprüfung und Persistenz | `backend/app/services/analysis_workflow.py` |
| `Language Detection` | Lokale Sprachdetektion für `de`, `fr`, `en` mit Confidence-Schwelle | `backend/app/language/` |
| `Validation Service` | JSON-Schema- und Pydantic-Prüfung mit strukturiertem Report | `backend/app/services/validation.py` |
| `LLM Adapter` | Stub- und OpenAI-Pfad hinter gemeinsamer Generator-Schnittstelle | `backend/app/llm/` |
| `Run Repository` | Erstellen, Laden und Listen persistierter Runs | `backend/app/repositories/` |
| `DB Model + Session` | SQLAlchemy-Modell, Engine und Session Factory | `backend/app/db/` |
| `Repair Guardrail` | Vorbereitete bounded Repair-Logik, nicht im Standardpfad aktiv | `backend/app/services/repair.py` |

- `app/api`: FastAPI-Endpunkte, API-Schemas und zentrales Fehlermapping.
- `app/services/analysis_workflow.py`: Orchestrierung von Spracherkennung, Analyseerzeugung, Validierung und Persistenz.
- `app/language`: lokale Sprachdetektion für Eingabe- und Ausgabesprache.
- `app/services/validation.py`: strukturelle Prüfung gegen JSON-Schema und Pydantic-Modelle.
- `app/llm`: Stub- und OpenAI-Adapter hinter einer gemeinsamen Generator-Schnittstelle.
- `app/repositories` und `app/db`: Persistenzzugriff, Datenmodell und Session-Verwaltung.

## Frontend-Zerlegung (aktueller Stand)

Als C3-Komponentensicht der Web UI dient [docs/diagrams/structurizr/c3-web-ui-components.dsl](/Users/robert/code/scm-01/docs/diagrams/structurizr/c3-web-ui-components.dsl:1).

| Komponente | Verantwortung | Fundstelle |
| --- | --- | --- |
| `App Shell` | Top-Level-Tabs, Run-Auswahl, Analysezustand, Fehlerzustand und Orchestrierung | `frontend/src/App.tsx` |
| `Analysis Composer` | Eingabeformular und Start einer neuen Analyse | `frontend/src/components/AnalysisComposer.tsx` |
| `Pipeline View` | Darstellung von Flow- und Review-Modus der sechs Ebenen | `frontend/src/components/PipelineView.tsx` |
| `Run History Panel` | Archiv, Metadaten, JSON-Export und bewusstes Öffnen in Analyse | `frontend/src/components/RunHistoryPanel.tsx` |
| `API Client` | HTTP-Zugriff auf Analyse-, Listen- und Detail-Endpunkte | `frontend/src/api.ts` |
| `Pipeline View Model` | Deterministische Ableitung von UI-Zuständen aus Run, Loading und Reveal Token | `frontend/src/pipeline.ts` |
| `Frontend Types` | Typen für Run, Analyse-JSON und Pipeline-Viewmodelle | `frontend/src/types.ts` |

- `App.tsx` orchestriert Texteingabe, API-Aufrufe, Run-Selektion, Workspace-Tabs (`Pipeline`/`Archiv`), Export und den globalen Fehlerzustand.
- `AnalysisComposer` kapselt die Eingabemaske für den Rohtext und den Start der Analyse.
- `usePipelineViewModel` in `frontend/src/pipeline.ts` transformiert den gewählten Run in einen deterministischen UI-Zustand mit den Modi `idle`, `submitting`, `result_received`, `revealing`, `completed` und `failed`.
- `PipelineView` rendert die zwei Frontend-Betriebsarten der Filterstrecke:
  - Flow-Modus während `submitting`/`result_received`/`revealing` mit genau einer sichtbaren aktiven Stage
  - Review-Modus nach `completed` mit allen sechs Stages, optionalen Details und hervorgehobener `Essenz`
- `RunHistoryPanel` entkoppelt die Auswahl bereits persistierter Runs von der Pipeline-Darstellung und bündelt im Archiv-Tab Run-Liste, technische Nachweise, JSON-Export und die explizite Aktion zum Öffnen eines Runs in der Analyseansicht.

Die Frontend-Logik trennt damit bewusst zwischen Datenbeschaffung (`App.tsx`), Zustandsableitung (`usePipelineViewModel`) und visueller Darstellung (`AnalysisComposer`, `PipelineView`, `RunHistoryPanel`). Die Pipeline-Stages sind zentral in `frontend/src/pipeline.ts` definiert, damit Reihenfolge, Titel und Prompt-Texte nicht über mehrere Komponenten verstreut gepflegt werden müssen. Die UI behandelt den laufenden Analysepfad bewusst anders als die spätere Run-Prüfung: während des Reveal wird nur eine Stage fokussiert dargestellt, nach Abschluss bleibt der gesamte Run als reviewbare Übersicht sichtbar.

Die Web-UI-C3-Sicht dokumentiert diese Trennung explizit: App-Orchestrierung, API Client, Pipeline-Zustandsableitung, Eingabe-Komponente und Archiv-/Export-Komponente sind eigene Verantwortungsbereiche, obwohl sie gemeinsam als eine React-SPA ausgeliefert werden.
