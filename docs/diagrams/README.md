# Diagramme

Hier werden Architektur- und Datenflussdiagramme abgelegt.

Empfohlene Formate:

- PlantUML (`.puml`) für Architektur- und Sequenzdiagramme
- Mermaid (`.mmd` oder Markdown-Codeblöcke) für leichte Diagramme

Leitlinien:

- Quelltexte der Diagramme in diesem Ordner versionieren.
- Diagramme aus arc42-Kapiteln referenzieren.
- Textbasierte Diagramme gegenüber Binärdateien bevorzugen (Diffs/Reviews).

Verfügbare Diagrammquellen:

- `docs/diagrams/system-context.puml`: Systemkontext für [docs/arc42/03_systemkontext_und_abgrenzung.md](/Users/robert/code/scm-01/docs/arc42/03_systemkontext_und_abgrenzung.md:1) mit User, Frontend, Backend, PostgreSQL und optionaler OpenAI-Anbindung.
- `docs/diagrams/uj1-sequence.puml`: UJ1-Ablauf für [docs/arc42/06_laufzeitsicht.md](/Users/robert/code/scm-01/docs/arc42/06_laufzeitsicht.md:1) mit Texteingabe, lokaler Sprachdetektion, Adapterpfad, Validierung und Persistenz.
- `docs/diagrams/container-view.puml`: Container- und Compose-Sicht für [docs/arc42/07_verteilungssicht.md](/Users/robert/code/scm-01/docs/arc42/07_verteilungssicht.md:1) mit `frontend`, `api`, `db`, Portfreigaben und externer OpenAI-Abhängigkeit.
- `docs/diagrams/db-erd.puml`: Persistenzsicht der `runs`-Tabelle als Ergänzung zu [docs/arc42/05_bausteinsicht.md](/Users/robert/code/scm-01/docs/arc42/05_bausteinsicht.md:1) und [docs/arc42/08_querschnittliche_konzepte.md](/Users/robert/code/scm-01/docs/arc42/08_querschnittliche_konzepte.md:1).
