# Architekturentscheidungen

Architekturentscheidungen werden als ADRs in [`docs/adr/`](../adr/) dokumentiert. Dieses Kapitel fasst die wichtigsten Entscheidungen so zusammen, dass das PDF eigenständig verständlich bleibt. Die ausführlichen Begründungen, Alternativen und Konsequenzen bleiben in den jeweiligen ADR-Dateien die Quelle für Details.

| ADR | Entscheidung | Wichtigste Alternative | Hauptgrund | Konsequenz | Verweis |
| --- | --- | --- | --- | --- | --- |
| ADR-0001 | Modularer Monolith mit klaren internen Modulgrenzen. | Microservices von Beginn an. | Geringere Betriebs- und Integrationskomplexität bei gleichzeitig evolvierbarer Struktur. | Service-Skalierung wird vertagt; Modulgrenzen müssen bewusst gepflegt werden. | [docs/adr/0001-architecture-style.md](../adr/0001-architecture-style.md) |
| ADR-0002 | Strikter Analysevertrag mit JSON Schema, Pydantic-Validierung und expliziten Fehlerläufen. | Nur prompt-basierte oder nur Pydantic-basierte Ausgabeprüfung. | Formatdrift muss kontrollierbar und Fehler müssen nachvollziehbar sein. | Fachlich brauchbare, aber formal ungültige Payloads werden im Standardpfad als `failed` persistiert; Repair bleibt vorbereitet. | [docs/adr/0002-analysis-contract-and-validation.md](../adr/0002-analysis-contract-and-validation.md) |
| ADR-0003 | Relationale Persistenz mit SQLAlchemy 2, Alembic-Migrationen und PostgreSQL als Zielsystem. | Implizite Tabellenerzeugung, reines SQLite oder dokumentenorientierte Persistenz. | Run-Daten, Schemahistorie und Migrationen sollen reproduzierbar bleiben. | SQLite bleibt Testhilfe; Zielbetrieb und Migrationen müssen separat gepflegt werden. | [docs/adr/0003-persistence-and-migrations.md](../adr/0003-persistence-and-migrations.md) |
| ADR-0004 | LLM-Zugriff über Adapter-Port mit versionierten Prompts und persistierter `model_id`/`prompt_version`. | Direkte Provider-Aufrufe im Workflow-Code oder inline Prompts. | Providerabhängigkeit, Testbarkeit und Herkunft der Analyse sollen getrennt bleiben. | Zusätzliche Adapterabstraktion; technische Providerfehler werden als API-Fehler und nicht als Analyse-Run behandelt. | [docs/adr/0004-llm-adapter-and-prompt-versioning.md](../adr/0004-llm-adapter-and-prompt-versioning.md) |
| ADR-0005 | Lokaler Zielbetrieb über Docker Compose mit `frontend`, `api` und `db`. | Nur lokale Dev-Server oder frühe Service-Orchestrierung. | Der verteilte Mindestbetrieb soll reproduzierbar sichtbar sein, ohne Produktionskomplexität einzuführen. | Compose deckt TLS, Secret-Management, Hochverfügbarkeit und zentrale Observability noch nicht ab. | [docs/adr/0005-containerized-local-runtime.md](../adr/0005-containerized-local-runtime.md) |
| ADR-0006 | Clientseitige React/Vite-SPA mit deterministischer Pipeline-Inszenierung. | SSR, Streaming-UI oder serverseitige Template-Anwendung. | Die didaktische Analysepipeline lässt sich aus dem synchron gelieferten Run im Browser stabil ableiten. | Kein SSR-/SEO-Vorteil; Flow- und Review-Modus müssen bewusst im Frontend gepflegt werden. | [docs/adr/0006-frontend-spa-and-client-side-pipeline.md](../adr/0006-frontend-spa-and-client-side-pipeline.md) |

Die vollständigen Repo-Pfade der ADRs sind:

- `docs/adr/0001-architecture-style.md`
- `docs/adr/0002-analysis-contract-and-validation.md`
- `docs/adr/0003-persistence-and-migrations.md`
- `docs/adr/0004-llm-adapter-and-prompt-versioning.md`
- `docs/adr/0005-containerized-local-runtime.md`
- `docs/adr/0006-frontend-spa-and-client-side-pipeline.md`

Für den state-driven Flow-/Review-Modus, den Archiv-Tab und die reduzierte Export-/Metadateninszenierung ist keine zusätzliche ADR nötig. Diese Punkte sind Ausprägungen der bestehenden Frontend-Architektur und keine neue systemweite Struktur- oder Integrationsentscheidung. Dokumentiert werden sie deshalb in Baustein-, Laufzeit- und Querschnittssicht.

Die Diagrammquellen präzisieren bestehende Architekturentscheidungen; sie führen keine zusätzliche Architekturentscheidung ein.
