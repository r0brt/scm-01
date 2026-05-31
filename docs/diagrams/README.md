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

Verfügbare Diagrammquellen:

- `docs/diagrams/structurizr/c1-system-context.dsl`: C1-Systemkontext mit SCM-Systemgrenze, User und optionalem externem LLM Provider.
- `docs/diagrams/structurizr/c2-scm-container.dsl`: C2-Containersicht mit Web UI, Backend/API, Persistenz und optionalem externem LLM Provider.
- `docs/diagrams/structurizr/c3-backend-components.dsl`: C3-Komponentensicht des Backends mit API Layer, Workflow, Sprachdetektion, Validierung, LLM Adapter, Repository, DB-Zugriff und vorbereiteter Repair-Guardrail.
- `docs/diagrams/structurizr/c3-web-ui-components.dsl`: C3-Komponentensicht der Web UI mit App Shell, Composer, Pipeline View, Archiv, API Client, Pipeline View Model und Frontend-Typen.
- `docs/diagrams/uj1-sequence.puml`: UJ1-Ablauf für [docs/arc42/06_laufzeitsicht.md](../arc42/06_laufzeitsicht.md) mit Texteingabe, `correlation_id`, lokaler Sprachdetektion, Adapterpfad, technischem Providerfehlerpfad, Validierung, Ausgabesprachprüfung sowie `failed`-/`completed`-Persistenz.
- `docs/diagrams/db-erd.puml`: Persistenzsicht der `runs`-Tabelle inklusive `correlation_id` als Ergänzung zu [docs/arc42/05_bausteinsicht.md](../arc42/05_bausteinsicht.md) und [docs/arc42/08_querschnittliche_konzepte.md](../arc42/08_querschnittliche_konzepte.md).

Gerenderte SVGs:

- `docs/diagrams/rendered/c1-system-context.svg`
- `docs/diagrams/rendered/c2-scm-container.svg`
- `docs/diagrams/rendered/c3-backend-components.svg`
- `docs/diagrams/rendered/c3-web-ui-components.svg`
- `docs/diagrams/rendered/uj1-sequence.svg`
- `docs/diagrams/rendered/db-erd.svg`
