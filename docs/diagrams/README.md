# Diagramme

Hier werden Architektur- und Datenflussdiagramme abgelegt.

Empfohlene Formate:

- Structurizr DSL (`.dsl`) für C1-/C2-/C3-Strukturdiagramme
- PlantUML (`.puml`) für Sequenzdiagramme und ERD
- SVG (`rendered/*.svg`) als eingebettete Ausgabe für arc42
- Mermaid (`.mmd` oder Markdown-Codeblöcke) für leichte Diagramme

Leitlinien:

- Quelltexte der Diagramme in diesem Ordner versionieren.
- Gerenderte SVGs aus arc42-Kapiteln einbetten und die jeweilige Quelle daneben verlinken.
- Textbasierte Diagramme gegenüber Binärdateien bevorzugen (Diffs/Reviews).
- Strukturdiagramme werden als C4-kompatible Structurizr-Quellen gepflegt; veraltete parallele PlantUML-Strukturdiagramme werden vermieden.
- Beim Rendern exportierter C4PlantUML-Dateien muss der Repo-Root als PlantUML-Include-Pfad verfügbar sein, damit die Boundary-Styles unter `docs/diagrams/plantuml/` gefunden werden.

Verfügbare Diagrammquellen:

- `docs/diagrams/structurizr/c1-system-context.dsl`: C1-Systemkontext mit SCM-Systemgrenze, User und optionalem externem LLM Provider.
- `docs/diagrams/structurizr/c2-scm-container.dsl`: C2-Containersicht mit Web UI, Backend/API, Persistenz und optionalem externem LLM Provider.
- `docs/diagrams/structurizr/c3-backend-components.dsl`: C3-Komponentensicht des Backends mit API Layer, Workflow, Sprachdetektion, Validierung, LLM Adapter, Repository, DB-Zugriff und vorbereitetem, inaktivem Repair-Guardrail.
- `docs/diagrams/structurizr/c3-web-ui-components.dsl`: C3-Komponentensicht der Web UI mit App Shell / Workspace, Analysis Flow View, Archive / Export View, API Client, Pipeline State / View Model und Shared Types / Contract Mapping.
- `docs/diagrams/plantuml/c4-boundary-style.puml`: C4PlantUML-Hilfsdatei für besser unterscheidbare System- und Containergrenzen in C3-Sichten.
- `docs/diagrams/deployment-compose.puml`: Deployment-Sicht für [docs/arc42/07_verteilungssicht.md](../arc42/07_verteilungssicht.md) mit Browser, lokaler Docker-Compose-Umgebung, `frontend`-, `api`- und `db`-Container, PostgreSQL-Volume sowie optionalem externem LLM Provider.
- `docs/diagrams/uj1-happy-path.puml`: UJ1-Happy-Path für [docs/arc42/06_laufzeitsicht.md](../arc42/06_laufzeitsicht.md) mit erfolgreicher Analyse, Validierung, Ausgabesprachprüfung und `completed`-Persistenz.
- `docs/diagrams/uj1-error-paths.puml`: UJ1-Fehlerpfade für [docs/arc42/06_laufzeitsicht.md](../arc42/06_laufzeitsicht.md) mit Sprach-, Validierungs- und Ausgabesprachfehlern als persistierte `failed` Runs sowie technischem Providerfehler ohne persistierten Analyse-Run.
- `docs/diagrams/db-erd.puml`: Persistenzsicht der `runs`-Tabelle inklusive `correlation_id` als Ergänzung zu [docs/arc42/05_bausteinsicht.md](../arc42/05_bausteinsicht.md) und [docs/arc42/08_querschnittliche_konzepte.md](../arc42/08_querschnittliche_konzepte.md).

Gerenderte SVGs:

- `docs/diagrams/rendered/c1-system-context.svg`
- `docs/diagrams/rendered/c2-scm-container.svg`
- `docs/diagrams/rendered/c3-backend-components.svg`
- `docs/diagrams/rendered/c3-web-ui-components.svg`
- `docs/diagrams/rendered/deployment-compose.svg`
- `docs/diagrams/rendered/uj1-happy-path.svg`
- `docs/diagrams/rendered/uj1-error-paths.svg`
- `docs/diagrams/rendered/db-erd.svg`
