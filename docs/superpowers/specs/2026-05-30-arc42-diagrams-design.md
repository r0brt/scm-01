# Arc42 Diagramme und Datenmodell Design

## Ziel

Dieser PR baut die Arc42-Dokumentation gezielt zu einer konsistenteren Architektur-Dokumentation aus, ohne Anwendungslogik zu verändern. Der Fokus liegt auf aktuellen, nachvollziehbaren Architekturdiagrammen, einem korrigierten Datenmodell-Nachweis und aktualisierten Test- und CI-Nachweisen auf dem aktuellen `main`.

## Scope

Enthalten sind drei eng begrenzte Deliverables:

- ERD und Datenmodelltext werden an den aktuellen Code-Stand angepasst, insbesondere an `correlation_id` in API, ORM-Modell und Alembic-Migration.
- Arc42 erhält neu erarbeitete Diagrammquellen für C1, C2, C3 Backend, C3 Web UI, Sequenzdiagramm und ERD.
- Testreport und Abnahmecheckliste werden auf Commit `9cfa2b9` und CI-Run `26666182368` aktualisiert.

Nicht enthalten sind:

- keine Änderungen an Backend-, Frontend- oder Testcode
- keine Änderung am Analyse-UI-Verhalten
- keine Reflexion
- keine neue fachliche Funktion
- keine rechtliche Vollständigkeitsbehauptung zu Datenschutz oder EU AI Act

## Diagrammstrategie

Die C4-nahen Strukturdiagramme werden als Structurizr DSL abgelegt, weil C1/C2/C3 dort präzise modelliert und konsistent benannt werden können:

- C1 System Context: `User`, `SCM`, externer `LLM Provider`
- C2 SCM Container: `Web UI`, `Backend/API`, `Persistenz`, externer `LLM Provider`
- C3 Backend Components: API Layer, Analysis Workflow, Language Detection, Validation, LLM Adapter, Run Repository, DB Model/Session
- C3 Web UI Components: App Shell, Analysis Composer, Pipeline View, Run History Panel, API Client, Pipeline View Model

Sequenzdiagramm und ERD bleiben in PlantUML, weil das Repository diese Form bereits nutzt und beide Diagrammtypen dort kompakt und reviewbar bleiben:

- Sequenzdiagramm: UJ1 Analyse inklusive Sprachprüfung, Adapterpfad, Validierung, Ausgabesprachprüfung und Persistenz
- ERD: Tabelle `runs` inklusive `correlation_id`

## Arc42-Einbindung

Die bestehenden Arc42-Kapitel bleiben erhalten, werden aber an den relevanten Stellen stärker erklärt:

- Kapitel 03 referenziert und erläutert C1.
- Kapitel 05 referenziert und erläutert C2 sowie C3 Backend und C3 Web UI.
- Kapitel 06 referenziert und erläutert das Sequenzdiagramm.
- Kapitel 07 referenziert und erläutert die Container-/Deployment-Sicht.
- Kapitel 08 referenziert und erläutert das ERD und gleicht Datenmodellfelder mit Code, API und Migration ab.
- Kapitel 09 wird nur angepasst, wenn die Diagramm-/Datenmodellpflege eine vorhandene ADR-Aussage präzisieren muss.

## Datenmodellabgleich

Die Dokumentation muss konsistent mit folgenden Implementierungsstellen sein:

- `backend/app/db/models.py`: `RunRecord.correlation_id`
- `backend/alembic/versions/20260529_01_add_correlation_id_to_runs.py`: Migration und Legacy-Backfill
- `backend/app/api/schemas.py`: `AnalysisRunResponse.correlation_id`
- `docs/diagrams/db-erd.puml`: ERD-Feldliste
- `docs/arc42/08_querschnittliche_konzepte.md`: Persistenz- und Traceability-Beschreibung

## Qualitäts- und Dokumentationsfokus

Der Ausbau soll architektonisch sichtbar machen:

- Systemgrenze und externe KI-Abhängigkeit
- verteilte Laufzeit über Web UI, API und Persistenz
- interne Backend-Verantwortlichkeiten
- interne Web-UI-Verantwortlichkeiten
- KI-spezifische Guardrails: Prompting, JSON-Contract, Validierung, Output-Language-Check, Repair-Grenze
- Nachvollziehbarkeit über `correlation_id`, `prompt_version`, `model_id`, Status- und Fehlerfelder
- Test- und Compose-Nachweise auf aktuellem `main`

## Verifikation

Da der PR dokumentationsorientiert ist, erfolgt die Verifikation über:

- `git diff --check`
- Abgleich der Diagrammquellen gegen Code-Fundstellen
- Link- und Pfadprüfung der referenzierten Diagrammdateien
- Sichtprüfung, dass keine Backend-/Frontend-Codeänderungen enthalten sind

## Risiken und Abgrenzungen

Die Diagramme werden als versionierte Quellen geliefert. Ein gerenderter PDF-/Bildexport ist nicht Teil dieses PRs, kann aber später für die finale Abgabe auf Basis derselben Quellen erstellt werden. Die Dokumentation beschreibt den MVP-Stand ehrlich; sie soll Architektur- und Governance-Entscheidungen nachvollziehbar machen, aber keine produktionsreife Betriebs- oder Compliance-Dokumentation vortäuschen.
