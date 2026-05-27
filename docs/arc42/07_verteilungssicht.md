# 07 Verteilungssicht

Die initiale Deployment-Sicht bleibt bei einem containerisierten Setup aus UI, API und PostgreSQL via Docker Compose.

Als visuelle Ergänzung dieser Verteilungssicht dient [docs/diagrams/container-view.puml](/Users/robert/code/scm-01/docs/diagrams/container-view.puml:1).

Die Persistenz im Backend ist relational modelliert. Die API schreibt Analyse-Runs in eine `runs`-Tabelle; fuer den lokalen Zielbetrieb und fuer Compose wird PostgreSQL verwendet. Die lokalen Persistenztests laufen weiterhin mit SQLite, um den Entwicklungs- und Testloop ohne externe Datenbank schnell zu halten.

Die API bleibt der einzige Einstiegspunkt fuer Analysen, delegiert die eigentliche Analyseerzeugung aber an einen austauschbaren LLM-Adapter. Fuer lokale und Test-Nutzung kann ein Stub-Adapter ohne Netz aktiv bleiben; fuer reale Analysen steht eine OpenAI-basierte Implementierung zur Verfuegung.

Die fachliche Quelle fuer die erzeugten Analyse-Payloads ist `docs/scm.md`. Deshalb muessen alle Laufzeitkomponenten im Compose-Betrieb denselben Vertrag fuer `symptome`, `ursachen`, `emotionen`, `narrative`, `mythen` und `essenz` verwenden; eine Rueckwaertskompatibilitaet zu frueheren Ebenennamen ist nicht vorgesehen.

Mit M6 ist nun auch das Frontend als eigenstaendiger Baustein vorhanden. Es spricht die Backend-API direkt an, startet Analysen synchron, zeigt Runs als Pipeline an und ermoeglicht den Export des aktuell gewaehlten Runs als JSON.

Mit M8 ist der lokale Zielbetrieb ueber `docker compose` konkretisiert. Die Verteilung besteht aus drei Containern:

- `frontend`: Nginx liefert das gebaute React/Vite-Frontend aus und leitet `/api` an die API weiter
- `api`: FastAPI/Uvicorn-Anwendung; fuehrt beim Start zuerst `alembic upgrade head` aus
- `db`: PostgreSQL als relationale Persistenz fuer Analyse-Runs

Die Kommunikation bleibt bewusst einfach: Browserzugriffe gehen gegen das Frontend; interne API-Aufrufe laufen im Compose-Netz zwischen `frontend` und `api`, Datenbankzugriffe zwischen `api` und `db`.

## Datenpfad und Deployment-Narrativ

Im MVP bleibt der primaere Betriebsmodus lokal kontrolliert. Das Frontend laeuft im Browser der nutzenden Person, die API und die relationale Persistenz laufen im Compose-Setup auf derselben lokal betriebenen Umgebung. Lokal verbleiben dabei insbesondere `input_text`, `analysis_json`, `validation_report`, Sprachmetadaten sowie die Traceability-Felder des Runs in der vom Backend angebundenen Datenbank.

Eine externe Datenuebertragung ist nur fuer die eigentliche Analyseerzeugung vorgesehen und auch dort nur unter klarer Bedingung: Wenn der produktive OpenAI-Adapter aktiviert ist, sendet die API den eingegebenen Problemtext, die erkannte Sprache, die aktive Prompt-Version und das angeforderte JSON-Schema an OpenAI. Ohne diese Konfiguration bleibt der Stub- oder Testpfad aktiv; in diesem Modus verlaesst kein Analyseinhalt fuer die Generierung das lokale System.

Docker Compose bildet diese Trennung bewusst direkt ab. `frontend` exponiert die Weboberflaeche und leitet `/api` an `api` weiter. `api` kapselt Spracherkennung, Validierung, bounded Repair, Persistenz und den optionalen Provider-Aufruf. `db` speichert Runs und Metadaten relational. Die Compose-Zuordnung beschreibt damit nicht nur Container, sondern auch Verantwortlichkeiten und Datenfluesse zwischen lokaler UI, lokaler Anwendungslogik, lokaler Persistenz und optionalem externem KI-Dienst.

Als visuelle Referenz dieser Container-Zuordnung dient weiterhin [docs/diagrams/container-view.puml](/Users/robert/code/scm-01/docs/diagrams/container-view.puml:1).

Operativ bleibt der MVP bewusst begrenzt. Nicht abgedeckt sind derzeit ein produktiver Mehrinstanzbetrieb, Backup- und Restore-Prozesse, Secret-Rotation, formalisierte Loeschprozesse, mandantenfaehige Isolation, Hochverfuegbarkeit, zentrales Monitoring sowie ein vollstaendiges Incident- und Audit-Betriebsmodell. Die Verteilungssicht beschreibt damit eine nachvollziehbare lokale Zielarchitektur fuer Entwicklung und MVP-Betrieb, aber noch kein vollstaendig ausgearbeitetes Produktions-Setup.
