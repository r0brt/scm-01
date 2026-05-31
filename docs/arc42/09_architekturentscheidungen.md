# 09 Architekturentscheidungen

Architekturentscheidungen werden als ADRs in [`docs/adr/`](../adr/) dokumentiert.

Dieses Kapitel fasst die architektonisch wichtigsten Entscheidungen in kurzer Form zusammen. Die ausführliche Begründung, Alternativen und Konsequenzen bleiben in den jeweiligen ADRs dokumentiert.

Aktuelle ADRs:

- [ADR-0001: Architekturstil](../adr/0001-architecture-style.md)
- [ADR-0002: Analysevertrag und Validierung](../adr/0002-analysis-contract-and-validation.md)
- [ADR-0003: Persistenz und Migrationen](../adr/0003-persistence-and-migrations.md)
- [ADR-0004: LLM-Adapter und Prompt-Versionierung](../adr/0004-llm-adapter-and-prompt-versioning.md)
- [ADR-0005: Containerisierter lokaler Zielbetrieb](../adr/0005-containerized-local-runtime.md)
- [ADR-0006: Frontend als clientseitig gerenderte SPA](../adr/0006-frontend-spa-and-client-side-pipeline.md)

## Relevante Kernentscheidungen

### Modularer Monolith statt früher Microservices

Die Gesamtarchitektur bleibt bewusst bei einem modularen Monolithen. Für den aktuellen Umfang bringt diese Entscheidung das beste Verhältnis aus Evolvierbarkeit, Testbarkeit und geringer Betriebs- beziehungsweise Integrationskomplexität.

Siehe: [ADR-0001](../adr/0001-architecture-style.md)

### Strikter Analysevertrag mit expliziter Validierung

Die zentrale Produktfunktion wird nicht allein über Prompting abgesichert, sondern über einen formalen JSON-Vertrag mit strukturierter Validierung. Dadurch bleiben API, Persistenz und Frontend gegen Formatdrift geschützt. Validierungs- und Sprachprüfungsfehler werden als sichtbare Fehlerläufe behandelt; technische Providerfehler bleiben davon getrennte API-Fehler.

Siehe: [ADR-0002](../adr/0002-analysis-contract-and-validation.md)

### Relationale Persistenz mit versionierten Migrationen

Analyse-Runs werden relational gespeichert und über Alembic-Migrationen versioniert. Das unterstützt die gewünschte Nachvollziehbarkeit, weil Datenmodell und Schemahistorie nicht implizit auseinanderlaufen.

Siehe: [ADR-0003](../adr/0003-persistence-and-migrations.md)

### Adapter-basierte LLM-Integration mit Prompt-Versionierung

Die Analyseerzeugung ist architektonisch von API, Validierung und Persistenz entkoppelt. Gleichzeitig werden `model_id` und `prompt_version` pro Run persistiert, damit Analyseergebnisse nicht als modelllose Blackbox erscheinen. Providerfehler vor einem verwertbaren Payload werden explizit über den API-Fehlervertrag abgebildet und nicht als Analyse-Run persistiert.

Siehe: [ADR-0004](../adr/0004-llm-adapter-and-prompt-versioning.md)

### Containerisierter lokaler Zielbetrieb

Die verteilte MVP-Laufzeit wird über `frontend`, `api` und `db` via Docker Compose sichtbar gemacht. Damit bleibt der Projektbetrieb lokal reproduzierbar, ohne bereits produktionsnahe Orchestrierung oder Service-Zersplitterung einzuführen.

Siehe: [ADR-0005](../adr/0005-containerized-local-runtime.md)

### Clientseitige SPA mit deterministischer Pipeline-Inszenierung

Die Frontend-Entscheidung zugunsten einer clientseitig gerenderten SPA passt zum synchron gelieferten Analyse-Run und zur didaktischen Pipeline-Darstellung. Die Zustandsableitung bleibt im Browser und ist dadurch ohne zusätzliche Server-UI-Schicht testbar.

Siehe: [ADR-0006](../adr/0006-frontend-spa-and-client-side-pipeline.md)

Für den state-driven Flow-/Review-Modus, den Archiv-Tab und die reduzierte Export-/Metadateninszenierung ist keine zusätzliche ADR nötig. Diese Punkte sind Ausprägungen der bestehenden Frontend-Architektur und keine neue systemweite Struktur- oder Integrationsentscheidung. Dokumentiert werden sie deshalb in Baustein-, Laufzeit- und Querschnittssicht.

Die Diagrammquellen präzisieren bestehende Architekturentscheidungen; sie führen keine zusätzliche Architekturentscheidung ein.
