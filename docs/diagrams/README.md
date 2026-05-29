# Diagramme

Hier werden Architektur- und Datenflussdiagramme abgelegt.

Empfohlene Formate:

- Structurizr DSL (`.dsl`) für C1-/C2-/C3-Strukturdiagramme
- PlantUML (`.puml`) für Architektur- und Sequenzdiagramme
- Mermaid (`.mmd` oder Markdown-Codeblöcke) für leichte Diagramme

Leitlinien:

- Quelltexte der Diagramme in diesem Ordner versionieren.
- Diagramme aus arc42-Kapiteln referenzieren.
- Textbasierte Diagramme gegenüber Binärdateien bevorzugen (Diffs/Reviews).

Verfügbare Diagrammquellen:

- `docs/diagrams/structurizr/c1-system-context.dsl`: C1-Systemkontext mit SCM-Systemgrenze, User und optionalem externem LLM Provider.
- `docs/diagrams/structurizr/c2-scm-container.dsl`: C2-Containersicht mit Web UI, Backend/API, Persistenz und optionalem externem LLM Provider.
- `docs/diagrams/structurizr/c3-backend-components.dsl`: C3-Komponentensicht des Backends mit API Layer, Workflow, Sprachdetektion, Validierung, LLM Adapter, Repository, DB-Zugriff und vorbereiteter Repair-Guardrail.
- `docs/diagrams/structurizr/c3-web-ui-components.dsl`: C3-Komponentensicht der Web UI mit App Shell, Composer, Pipeline View, Archiv, API Client, Pipeline View Model und Frontend-Typen.
- `docs/diagrams/system-context.puml`: Systemkontext für [docs/arc42/03_systemkontext_und_abgrenzung.md](/Users/robert/code/scm-01/docs/arc42/03_systemkontext_und_abgrenzung.md:1) mit `SCM` als Blackbox sowie den relevanten Umsystemen und Akteuren.
- `docs/diagrams/uj1-sequence.puml`: UJ1-Ablauf für [docs/arc42/06_laufzeitsicht.md](/Users/robert/code/scm-01/docs/arc42/06_laufzeitsicht.md:1) mit Texteingabe, lokaler Sprachdetektion, Adapterpfad, Validierung und Persistenz.
- `docs/diagrams/container-view.puml`: Container- und Compose-Sicht für [docs/arc42/07_verteilungssicht.md](/Users/robert/code/scm-01/docs/arc42/07_verteilungssicht.md:1) mit `frontend`, `api`, `db`, Portfreigaben und externer OpenAI-Abhängigkeit.
- `docs/diagrams/building-blocks-level1.puml`: Level-1-Bausteinsicht für [docs/arc42/05_bausteinsicht.md](/Users/robert/code/scm-01/docs/arc42/05_bausteinsicht.md:1) mit Frontend UI, Backend API, lokaler Persistenz und optionalem externem Provider.
- `docs/diagrams/building-blocks-level2-backend.puml`: Level-2-Bausteinsicht für [docs/arc42/05_bausteinsicht.md](/Users/robert/code/scm-01/docs/arc42/05_bausteinsicht.md:1) mit der aktuellen Backend-Zerlegung in API, Workflow, Sprachdetektion, Validierung, LLM-Adapter, Repository und DB-Zugriff.
- `docs/diagrams/db-erd.puml`: Persistenzsicht der `runs`-Tabelle als Ergänzung zu [docs/arc42/05_bausteinsicht.md](/Users/robert/code/scm-01/docs/arc42/05_bausteinsicht.md:1) und [docs/arc42/08_querschnittliche_konzepte.md](/Users/robert/code/scm-01/docs/arc42/08_querschnittliche_konzepte.md:1).
