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

## Frontend-Zerlegung (aktueller Stand)

- `App.tsx` orchestriert Texteingabe, API-Aufrufe, Run-Selektion, Workspace-Tabs (`Pipeline`/`Archiv`), Export und den globalen Fehlerzustand.
- `AnalysisComposer` kapselt die Eingabemaske fuer den Rohtext und den Start der Analyse.
- `usePipelineViewModel` in `frontend/src/pipeline.ts` transformiert den gewaehlten Run in einen deterministischen UI-Zustand mit den Modi `idle`, `submitting`, `result_received`, `revealing`, `completed` und `failed`.
- `PipelineView` rendert die zwei Frontend-Betriebsarten der Filterstrecke:
  - Flow-Modus waehrend `submitting`/`result_received`/`revealing` mit genau einer sichtbaren aktiven Stage
  - Review-Modus nach `completed` mit allen sechs Stages, optionalen Details und hervorgehobener `Essenz`
- `RunHistoryPanel` entkoppelt die Auswahl bereits persistierter Runs von der Pipeline-Darstellung und ist ueber den Archiv-Tab nur als sekundaere Arbeitsflaeche erreichbar.

Die Frontend-Logik trennt damit bewusst zwischen Datenbeschaffung (`App.tsx`), Zustandsableitung (`usePipelineViewModel`) und visueller Darstellung (`AnalysisComposer`, `PipelineView`, `RunHistoryPanel`). Die Pipeline-Stages sind zentral in `frontend/src/pipeline.ts` definiert, damit Reihenfolge, Titel und Prompt-Texte nicht ueber mehrere Komponenten verstreut gepflegt werden muessen. Die UI behandelt den laufenden Analysepfad bewusst anders als die spaetere Run-Pruefung: waehrend des Reveal wird nur eine Stage fokussiert dargestellt, nach Abschluss bleibt der gesamte Run als reviewbare Uebersicht sichtbar.
