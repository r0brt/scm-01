# arc42 Architekturdokumentation

Dieser Ordner enthält die Architekturdokumentation im arc42-Format.

## Inhaltsverzeichnis

1. [Einführung und Ziele](01_introduction_and_goals.md)
2. [Randbedingungen](02_architecture_constraints.md)
3. [Systemkontext und -abgrenzung](03_system_scope_and_context.md)
4. [Lösungsstrategie](04_solution_strategy.md)
5. [Bausteinsicht](05_building_block_view.md)
6. [Laufzeitsicht](06_runtime_view.md)
7. [Verteilungssicht](07_deployment_view.md)
8. [Querschnittliche Konzepte](08_concepts.md)
9. [Architekturentscheidungen](09_architecture_decisions.md)
10. [Qualitätsszenarien](10_quality_scenarios.md)
11. [Technische Risiken](11_technical_risks.md)
12. [Glossar](12_glossary.md)

## Pflegehinweise

- Kapitel prägnant halten und nur betroffene Kapitel aktualisieren.
- Entscheidungen als ADRs in `docs/adr/` referenzieren.
- Konsistenz mit `docs/prd.md`, `PLAN.md` und Implementierung sicherstellen.

## arc42 Update Trigger

Aktualisiere relevante Kapitel, wenn sich einer der folgenden Punkte ändert:

- API-Oberfläche (OpenAPI, Endpunkte, Fehlervertrag)
- Datenmodell, Persistenz, Migrationen oder DB-Technologie
- Laufzeit-/Deployment-Topologie (Compose, Container, Umgebungsvariablen)
- LLM-Integrationsverhalten (Adapter, Prompt-Versionierung, Reliability Guardrails)
- Querschnittsthemen (Logging, Correlation IDs, Validierung/Repair, Sicherheitsannahmen)
