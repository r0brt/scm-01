# 09 Architekturentscheidungen

Architekturentscheidungen werden als ADRs in [`docs/adr/`](../adr/) dokumentiert.

Aktuelle ADRs:

- [ADR-0001: Architekturstil](../adr/0001-architecture-style.md)
- [ADR-0002: Analysevertrag und Validierung](../adr/0002-analysis-contract-and-validation.md)
- [ADR-0003: Persistenz und Migrationen](../adr/0003-persistence-and-migrations.md)
- [ADR-0004: LLM-Adapter und Prompt-Versionierung](../adr/0004-llm-adapter-and-prompt-versioning.md)
- [ADR-0005: Containerisierter lokaler Zielbetrieb](../adr/0005-containerized-local-runtime.md)

Bewertung des aktuellen Repo-Stands: Fuer die juengsten Frontend-Anpassungen ist derzeit keine zusaetzliche ADR noetig. Der state-driven Flow-/Review-Modus, der Archiv-Tab und die reduzierte Export-/Metadateninszenierung sind Auspraegungen der bestehenden Frontend-Architektur und keine neue systemweite Struktur- oder Integrationsentscheidung. Dokumentationspflichtig war hier vor allem die Nachfuehrung von Baustein-, Laufzeit- und Querschnittssicht.
