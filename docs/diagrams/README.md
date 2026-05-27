# Diagramme

Hier werden Architektur- und Datenflussdiagramme abgelegt.

Empfohlene Formate:

- PlantUML (`.puml`) für Architektur- und Sequenzdiagramme
- Mermaid (`.mmd` oder Markdown-Codeblöcke) für leichte Diagramme

Leitlinien:

- Quelltexte der Diagramme in diesem Ordner versionieren.
- Diagramme aus arc42-Kapiteln referenzieren.
- Textbasierte Diagramme gegenüber Binärdateien bevorzugen (Diffs/Reviews).

Verfuegbare Diagrammquellen:

- `docs/diagrams/system-context.puml`: Systemkontext fuer arc42 Kapitel 03 mit User, Frontend, Backend, PostgreSQL und optionaler OpenAI-Anbindung.
- `docs/diagrams/uj1-sequence.puml`: UJ1-Ablauf fuer arc42 Kapitel 06 mit Texteingabe, lokaler Sprachdetektion, Adapterpfad, Validierung und Persistenz.
- `docs/diagrams/container-view.puml`: Container- und Compose-Sicht fuer arc42 Kapitel 07 mit `frontend`, `api`, `db`, Portfreigaben und externer OpenAI-Abhaengigkeit.
- `docs/diagrams/db-erd.puml`: Persistenzsicht der `runs`-Tabelle als Ergaenzung zu arc42 Kapitel 05 und 08.
