# Verteilungssicht

Die Verteilungssicht beschreibt den lokalen Docker-Compose-Zielbetrieb. Sie fokussiert auf die Frage, wo die Laufzeitbausteine ausgeführt werden, wie sie miteinander kommunizieren und an welcher Stelle Daten die lokale Umgebung verlassen können.

![Deployment View Docker Compose](../diagrams/rendered/deployment-compose.svg)

Die Deployment-Sicht in [docs/diagrams/deployment-compose.puml](../diagrams/deployment-compose.puml) zeigt den lokalen Docker-Compose-Zielbetrieb mit Browser, `frontend`-, `api`- und `db`-Container, persistentem PostgreSQL-Volume sowie optionalem externem LLM Provider. Das gerenderte SVG liegt in [docs/diagrams/rendered/deployment-compose.svg](../diagrams/rendered/deployment-compose.svg).

Die React-SPA läuft im Browser der nutzenden Person; ausgeliefert wird sie im Compose-Betrieb durch den `frontend`-Container mit Nginx. Dieser Container veröffentlicht die Weboberfläche auf Host-Port `4173` und leitet API-Aufrufe unter `/api/` intern an `http://api:8000` weiter.

Der `api`-Container führt die FastAPI-Anwendung aus und lauscht im Container auf Port `8000`. Docker Compose veröffentlicht denselben Port zusätzlich auf dem Host, damit Health-Checks und lokale Entwicklung direkt gegen die API möglich bleiben. Für den regulären Browserpfad läuft die Kommunikation jedoch über den Nginx-Reverse-Proxy im `frontend`-Container.

Der `db`-Container stellt PostgreSQL auf Container-Port `5432` bereit. Auch dieser Port ist im Compose-Setup auf dem Host veröffentlicht, damit lokale Datenbankzugriffe und Nachweise möglich sind. Die API verwendet im Standard-Compose-Betrieb die interne Service-Adresse `db:5432` und schreibt Runs in das persistente `postgres_data`-Volume.

Die API bleibt der einzige Einstiegspunkt für Analysen und kapselt Sprachprüfung, Validierung, Persistenz und optionale Analyseerzeugung. Der fachlich-technische Analysevertrag wird in Kapitel 8 beschrieben; in der Verteilungssicht ist vor allem relevant, dass derselbe Vertrag im Compose-Betrieb von API, Persistenz und Web UI gemeinsam verwendet wird.

Der lokale Zielbetrieb besteht damit aus drei Containern:

- `frontend`: Nginx liefert das gebaute React/Vite-Frontend aus und leitet `/api` an die API weiter
- `api`: FastAPI/Uvicorn-Anwendung; führt beim Start zuerst `alembic upgrade head` aus
- `db`: PostgreSQL als relationale Persistenz für Analyse-Runs

Die Kommunikation bleibt bewusst einfach. Browserzugriffe gehen gegen den veröffentlichten Frontend-Port `4173`. Interne API-Aufrufe laufen im Compose-Netz zwischen `frontend` und `api` über `api:8000`; Datenbankzugriffe laufen zwischen `api` und `db` über `db:5432`. Die zusätzlich veröffentlichten Host-Ports `8000` und `5432` dienen lokaler Entwicklung, Prüfung und Nachweisführung, nicht einer produktionsreifen Exposition.

## Datenpfad und Deployment-Narrativ

Im MVP bleibt der primäre Betriebsmodus lokal kontrolliert. Die React-SPA läuft im Browser, während API und relationale Persistenz im Compose-Setup auf derselben lokal betriebenen Umgebung ausgeführt werden. Lokal verbleiben dabei insbesondere `input_text`, `analysis_json`, `validation_report`, Sprachmetadaten sowie die Traceability-Felder des Runs in der vom Backend angebundenen Datenbank.

Eine externe Datenübertragung ist nur für die eigentliche Analyseerzeugung vorgesehen und auch dort nur unter klarer Bedingung: Wenn der produktive OpenAI-Adapter aktiviert ist, sendet die API den eingegebenen Problemtext, die erkannte Sprache, den Inhalt des aktiven Prompts und das angeforderte JSON-Schema an OpenAI. Ohne diese Konfiguration bleibt der Stub- oder Testpfad aktiv; in diesem Modus verlässt kein Analyseinhalt für die Generierung das lokale System.

Docker Compose bildet diese Trennung bewusst direkt ab. `frontend` exponiert die Weboberfläche und leitet `/api` an `api` weiter. `api` kapselt Spracherkennung, strukturelle Validierung, Persistenz und den optionalen Provider-Aufruf. Ein begrenzter Repair-Mechanismus ist im Repository vorbereitet, gehört aber im aktuellen Laufzeitpfad noch nicht zum aktiv verdrahteten Standardablauf. `db` speichert Runs und Metadaten relational. Die Compose-Zuordnung beschreibt damit nicht nur Container, sondern auch Verantwortlichkeiten und Datenflüsse zwischen lokaler UI, lokaler Anwendungslogik, lokaler Persistenz und optionalem externem KI-Dienst.

Operativ bleibt der MVP bewusst begrenzt. Nicht abgedeckt sind derzeit ein produktiver Mehrinstanzbetrieb, Backup- und Restore-Prozesse, Secret-Rotation, formalisierte Löschprozesse, mandantenfähige Isolation, Hochverfügbarkeit, zentrales Monitoring sowie ein vollständiges Incident- und Audit-Betriebsmodell. Die Verteilungssicht beschreibt damit eine nachvollziehbare lokale Zielarchitektur für Entwicklung und MVP-Betrieb, aber noch kein vollständig ausgearbeitetes Produktions-Setup.
